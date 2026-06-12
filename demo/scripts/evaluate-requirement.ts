import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";

const baseURL = process.env.ANTHROPIC_BASE_URL || 'https://api.deepseek.com/anthropic';
const apiKey = process.env.ANTHROPIC_AUTH_TOKEN || process.env.ANTHROPIC_API_KEY || '';
const model = process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL || 'deepseek-v4-flash';

const anthropic = new Anthropic({ baseURL,  apiKey });

async function evaluateRequirement(specPath: string) {
  const spec = readFileSync(specPath, 'utf-8');

  console.log('📄 Spec loaded:', spec.length, 'characters');
  console.log(`🧠 Sending to ${model} (via ${baseURL}) for evaluation...\n`);

  const response = await anthropic.messages.create({
    model,
    max_tokens: 8192,
    system: `You are a senior QA architect. Analyze the given specification
for testing completeness. Return ONLY valid JSON (no markdown, no explanation
outside the JSON) with this structure:

{
  "completeness": {
    "covered": ["list of well-defined behaviors"],
    "missing": ["list of behaviors not addressed in the spec"],
    "ambiguous": ["list of behaviors that are underspecified"]
  },
  "specByExample": [
    {
      "scenario": "descriptive name",
      "inputs": { "email": "...", "newPassword": "...", "delay": "..." },
      "expectedOutcome": "what should happen"
    }
  ],
  "testCases": [
    {
      "name": "test case name",
      "intent": "what this test is really validating",
      "severity": "critical|high|medium|low",
      "preconditions": ["..."],
      "steps": ["..."],
      "assertions": ["..."]
    }
  ],
  "summary": "2-3 sentence overall assessment"
}`,
    messages: [{
      role: 'user',
      content: `Evaluate this specification for testing completeness.
Identify gaps, generate specification-by-example scenarios,
and design test cases.\n\nSPECIFICATION:\n${spec}`
    }]
  });

  // DeepSeek returns thinking blocks alongside text blocks.
  // Find the first "text" block — skip any "thinking" blocks.
  const textBlock = response.content.find(
    (b: any) => b.type === 'text'
  ) as { type: 'text'; text: string } | undefined;

  const text = textBlock?.text ?? '';

  if (!text) {
    console.error('❌ No text block found in response. Content blocks:');
    for (const b of response.content) {
      console.error(`   type=${(b as any).type}, keys=${Object.keys(b).join(',')}`);
    }
    process.exit(1);
  }

  return JSON.parse(text);
}

(async () => {
  const start = Date.now();
  const result = await evaluateRequirement('./specs/password-reset.md');
  const elapsed = Date.now() - start;

  console.log(`✅ Evaluation complete (${elapsed}ms)`);
  console.log('\n📋 COMPLETENESS:');
  console.log('   ✅ Covered:', result.completeness.covered.length, 'items');
  console.log('   ❌ Missing:', result.completeness.missing.length, 'items');
  for (const m of result.completeness.missing) {
    console.log('      -', m);
  }
  console.log('   ⚠️  Ambiguous:', result.completeness.ambiguous.length, 'items');
  for (const a of result.completeness.ambiguous) {
    console.log('      -', a);
  }

  console.log('\n📊 SPEC-BY-EXAMPLE:', result.specByExample.length, 'scenarios');
  console.log('📋 TEST CASES:', result.testCases.length, 'generated');

  console.log('\n💬 SUMMARY:', result.summary);
})();
