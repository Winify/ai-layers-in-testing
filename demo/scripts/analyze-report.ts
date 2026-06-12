import { readFileSync } from 'fs';

type Failure = {
  title: string
  fullTitle: string
  err?: string
}

const llmBase = (process.env.LLM_PROVIDER_URL || 'http://localhost:1234').replace(/\/+$/, '');
const model = process.env.LLM_MODEL || 'qwen/qwen3.5-4b';

const temperature = 0.2;
const max_tokens = 4096;

async function analyzeReport(reportPath: string) {
  const report = JSON.parse(readFileSync(reportPath, 'utf-8'));

  // Trim errors to 80 chars to keep prompt small for local models
  const failuresSummary = report.failures.map((f: Failure) => ({
    title: f.title,
    error: f.err ?? '',
  }));

  const reportDigest = {
    tests: report.stats.tests,
    failures: report.stats.failures,
    sample: failuresSummary,
  };

  const prompt = `Classify these test failures. Return ONLY JSON (no markdown):

${JSON.stringify(reportDigest)}

Output: {"groups":[{"rootCause":"...","category":"APP_BUG|TEST_BUG|ENV","count":N,"failures":["..."],"evidence":"..."}],"summary":"2 sentences","actions":[{"action":"...","priority":"high|medium|low","detail":"..."}]}`;

  console.log('📊 Report loaded:', report.stats.tests, 'tests,', report.stats.failures, 'failures');
  console.log('🤖 Sending to local model for analysis...\n');

  const start = Date.now();
  const response = await fetch(`${llmBase}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature,
      max_tokens,
    }),
  });

  const data = await response.json() as any;
  const elapsed = Date.now() - start;

  // Debug: show response structure on first run
  if (!data.choices) {
    console.error('❌ Unexpected API response structure. Keys:', Object.keys(data));
    console.error(JSON.stringify(data).substring(0, 300));
    process.exit(1);
  }

  const msg = data.choices[0].message;

  // Qwen3.5 thinking model: content is empty when reasoning consumes all tokens.
  // Fix: disable "Reasoning" in LM Studio UI (right sidebar → Reasoning → Off).
  // Fallback to reasoning_content only as a last resort (it's the thinking trace).
  let jsonStr = (msg?.content || '').trim();
  if (!jsonStr && data.choices[0].finish_reason !== 'stop') {
    console.error('❌ Model did not finish. Empty content. Likely reasoning is ON in LM Studio.');
    console.error('   Disable it: LM Studio right sidebar → Reasoning → Off, then reload model.');
    if (msg?.reasoning_content) {
      console.error('   Reasoning tokens consumed (sample):', msg.reasoning_content.substring(0, 120));
    }
    process.exit(1);
  }
  // If reasoning is off and model still outputs empty content, something else is wrong
  if (!jsonStr) {
    console.error('❌ Empty response. Check LM Studio logs.');
    console.error(JSON.stringify(data).substring(0, 500));
    process.exit(1);
  }
  jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

  // If JSON is truncated (common with small models), try to salvage
  let analysis;
  try {
    analysis = JSON.parse(jsonStr);
  } catch {
    // Try closing any unclosed braces
    let depth = 0;
    for (let i = jsonStr.length - 1; i >= 0; i--) {
      if (jsonStr[i] === '}') depth++;
      if (jsonStr[i] === '{') depth--;
      if (depth > 0) {
        jsonStr = jsonStr.substring(0, i) + '}';
        depth--;
      }
    }
    try {
      analysis = JSON.parse(jsonStr);
    } catch {
      console.error('❌ Could not parse LLM response. Raw output:');
      console.error(data.choices[0].message.content.substring(0, 500));
      process.exit(1);
    }
  }

  console.log(`✅ Analysis complete (${elapsed}ms, local model)\n`);

  console.log('🔍 FAILURE GROUPS:');
  for (const g of analysis.groups) {
    const icon = g.category === 'APP_BUG'
      ? '🔴'
      : g.category === 'TEST_BUG'
        ? '🟡'
        : g.category === 'ENV'
          ? '🔵'
          : '⚪';
    console.log(`   ${icon} ${g.rootCause}`);
    console.log(`      ${g.count} failures — ${g.category}`);
    console.log(`      Evidence: ${g.evidence}\n`);
  }

  console.log('💬 SLACK SUMMARY:');
  console.log('  ', analysis.summary);

  console.log('\n📋 SUGGESTED ACTIONS:');
  for (const a of analysis.actions) {
    console.log(`   [${a.priority.toUpperCase()}] ${a.action}: ${a.detail}`);
  }
}

(async () => {
  await analyzeReport('./reports/nightly-report.json');
})();
