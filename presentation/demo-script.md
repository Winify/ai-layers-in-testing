# Demo Script: Three Phases of the AI-Augmented Testing Lifecycle

**Total demo time:** 25 minutes across 3 demos
**Setup:** All prerequisites pre-installed, all code pre-prepared, execute only

---

## Common Prerequisites (Pre-Workshop)

```bash
# Local models (for Demos 2 & 3)
# LM Studio running with qwen3.5-4b loaded (~3.4 GB)
# Exposes OpenAI-compatible API at http://localhost:1234

# For Demo 1 (cloud)
# Set DeepSeek-compatible env vars
export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
export ANTHROPIC_AUTH_TOKEN="sk-****"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"

# Demo 2 only
npm install @wdio/cli @wdio/local-runner @wdio/mocha-framework wdio-agent-service

# Demo 3 only
# Pre-create the sample report file (see below)
```

---

# Demo 1: Spec Evaluation & Test Design (9 min)

**Phase:** Design-Time
**Model:** deepseek-v4-flash (cloud) — reasoning quality
**Runs:** Once per spec change, not per test execution
**Cost:** ~$0.001 per analysis

---

## What to Say

> "First demo: design-time. I have a requirements spec for a password reset feature. It looks complete — but it's not. Let's see what an LLM catches that a human might miss."

---

## Pre-Prepared Spec File

File: `specs/password-reset.md`

```markdown
# Feature: Password Reset

## Description
Allow users to reset their password when they forget it.

## Requirements
- User can request a password reset by entering their email address
- A reset link is sent to the user's email
- The reset link is valid for 1 hour
- The new password must be at least 8 characters
- After successful reset, the user is redirected to the login page
```

**Deliberate gaps in this spec (for the LLM to catch):**
- No behavior defined for non-existent email (user enumeration risk)
- No password reuse policy
- No rate limiting (brute force protection)
- No concurrent reset handling (link invalidation?)
- Ambiguous: "valid for 1 hour" — from send time or first click?
- No error response format specified

---

## Code Chunk 1: Evaluate the Spec

File: `scripts/evaluate-requirement.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';

const anthropic = new Anthropic();

async function evaluateRequirement(specPath: string) {
  const spec = readFileSync(specPath, 'utf-8');

  console.log('📄 Spec loaded:', spec.length, 'characters');
  console.log('🧠 Sending to Claude Haiku for evaluation...\n');

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
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

  const result = JSON.parse(response.content[0].text);
  return result;
}

// Execute
(async () => {
  const start = Date.now();
  const result = await evaluateRequirement('./specs/password-reset.md');
  const elapsed = Date.now() - start;

  console.log(`✅ Evaluation complete (${elapsed}ms, ~$0.002)`);
  console.log('\n📋 COMPLETENESS:');
  console.log('   ✅ Covered:', result.completeness.covered.length, 'items');
  console.log('   ❌ Missing:', result.completeness.missing.length, 'items');
  console.log('   ⚠️  Ambiguous:', result.completeness.ambiguous.length, 'items');

  console.log('\n🔍 MISSING BEHAVIORS:');
  result.completeness.missing.forEach(m => console.log('   -', m));

  console.log('\n📊 SPEC-BY-EXAMPLE:', result.specByExample.length, 'scenarios');
  console.log('📋 TEST CASES:', result.testCases.length, 'generated');
  console.log('\n💬 SUMMARY:', result.summary);
})();
```

---

## What to Highlight

1. **Before execution:** Point out the spec looks "complete" — it has clear requirements, seems well-written
2. **After execution:** Walk through the `completeness.missing` array — the LLM found 4-5 critical gaps that a human reading the spec would likely miss
3. **Specification-by-example:** Show how abstract "password must be 8 characters" becomes concrete test scenarios with exact inputs and expected outputs
4. **The ambiguous items:** "Valid for 1 hour" — from when? These force the conversation that should have happened during spec review
5. **Cost:** ~$0.002. Time: ~2 seconds. Value: catching design flaws before implementation

---

## Troubleshooting

- **API key not set:** Remind audience to set `ANTHROPIC_API_KEY`. Have a screenshot of expected output ready as fallback.
- **Slow response:** Haiku typically responds in 1-3 seconds. If slower, it's likely network — have the screenshot ready.

---

# Demo 2: Runtime Agentic Testing (9 min)

**Phase:** Runtime
**Model:** qwen3.5-4b (local, ~3.4 GB) via LM Studio
**Tool:** wdio-agent-service
**Target:** the-internet.herokuapp.com

---

## What to Say

> "Demo two: runtime. This is where the test actually executes. Same target — The Internet. qwen3.5-4b via LM Studio. Two patterns: single-action agent calls for navigation, and multi-action for form filling."

---

## Pre-Configured wdio.conf.ts

```typescript
export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: ['./test/specs/**/*.ts'],

  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['--headless=new'],  // Remove '--headless=new' for visual demo
    },
  }],

  services: ['agent'],

  agent: {
    provider: 'openai',
    providerUrl: 'http://localhost:1234',
    model: 'qwen/qwen3.5-4b',
    token: 'lm-studio-no-auth',
    maxActions: 2,
    timeout: 30000,
    maxRetries: 2,
    maxOutputTokens: 1024,
    toonFormat: 'yaml-like',
  },

  framework: 'mocha',
  mochaOpts: { ui: 'bdd', timeout: 60000 },
  logLevel: 'info',
};
```

---

## Code Chunk 2a: First Agent Call — Single Action

File: `test/specs/demo-agentic.ts`

```typescript
import { browser, expect } from '@wdio/globals';

describe('Runtime Agentic Testing', () => {

  it('should use agent to navigate to login page', async () => {
    await browser.url('https://the-internet.herokuapp.com');

    // Traditional: verify we're on the right page
    await expect($('h1.heading')).toHaveText('Welcome to the-internet');
    console.log('Traditional assertion: heading verified');

    // Agentic: find and click a link by semantic meaning
    console.log('\nCalling browser.agent("click the Form Authentication link")...');
    const result = await browser.agent(
      'click the "Form Authentication" link'
    );

    console.log('   Agent response:', JSON.stringify(result, null, 2));
    console.log('   Action:', result[0].type);
    console.log('   Selector:', result[0].target);

    // Verify we navigated correctly
    await expect($('h2')).toHaveText('Login Page');
    console.log('Agent successfully clicked the link\n');
  });
});
```

**Expected output:**
```
[wdio-agent-service] Snapshot captured: 42 interactable elements
[wdio-agent-service] LLM response received (234ms)

Agent response: [
  {
    "type": "CLICK",
    "target": { "linkText": "Form Authentication" }
  }
]
```

**Expected output highlights:**
```
[wdio-agent-service] Snapshot captured: 42 interactable elements
[wdio-agent-service] TOON-encoded prompt: 847 tokens
[wdio-agent-service] LLM response received (234ms)

Agent response: {
  "action": "CLICK",
  "selector": { "linkText": "Form Authentication" }
}
```

---

## Code Chunk 2b: Multi-Action Form Fill

```typescript
  it('should login using multi-action agentic form fill', async () => {
    await browser.url('https://the-internet.herokuapp.com/login');

    // Multi-action: agent plans entire form fill in one call (maxActions: 2)
    console.log('\nAgent: filling form with username/password...');
    const formAction = await browser.agent(
      'fill from with username / password: tomsmith / SuperSecretPassword!'
    );
    console.log('   Agent response:', JSON.stringify(formAction, null, 2));
    // → [
    //     { type: "SET_VALUE", target: { css: "#username" }, value: "tomsmith" },
    //     { type: "SET_VALUE", target: { css: "#password" }, value: "SuperSecretPassword!" }
    //   ]

    // Single action: agent targets the submit button
    console.log('\nAgent: locating and clicking submit button...');
    const clickResult = await browser.agent(
      'click the button that submits the login form'
    );
    console.log('   Agent used selector:', clickResult[0].target);

    // TRADITIONAL: verify result with known assertion
    await expect($('.flash.success')).toHaveText(
      expect.stringContaining('You logged into a secure area!')
    );
    console.log('Login successful — multi-action + traditional verification\n');
  });
```

**What to highlight:**
- `maxActions: 2` enables multi-step planning — agent returns an array of actions
- The form fill call returns two SET_VALUE actions targeting the correct fields
- Traditional assertion still verifies the outcome
- Pattern: agent handles unpredictable DOM interactions, traditional verifies the result

---

## Code Chunk 2c: Self-Healing

```typescript
  it('should self-heal when selectors change', async () => {
    // Assume we're logged in
    await browser.url('https://the-internet.herokuapp.com/secure');

    console.log('🔄 Scenario: logout button CSS class changed in latest deploy');
    console.log('   Old class: a.button.secondary.radius');
    console.log('   New class: a.button.alert.radius');
    console.log('   Traditional selector would FAIL ❌\n');

    console.log('🤖 Agent: observing DOM, adapting...');
    const logoutResult = await browser.agent(
      'click the logout button'  // semantic, not CSS-class-based
    );

    console.log('   Agent found element with selector:',
      JSON.stringify(logoutResult.selector));
    console.log('   ✅ Clicked successfully — zero test code changes\n');

    await expect($('h2')).toHaveText('Login Page');
    console.log('✅ Logout successful — the test healed itself');
  });
```

**What to highlight:**
- No hardcoded CSS class — the agent uses semantic understanding
- When the class changes, the test code stays the same
- The agent re-observes the DOM and finds the semantically matching element
- This is the difference between testing by selector (fragile) and testing by intent (robust)

---

## Troubleshooting

- **LM Studio not running:** Start LM Studio, ensure qwen3.5-4b is loaded and server is on port 1234
- **Model not loaded:** Download qwen3.5-4b in LM Studio, load it, verify at http://localhost:1234/v1/models
- **Agent times out:** Check memory — the 3B model needs ~2 GB RAM free
- **Agent selects wrong element:** Add detail to prompt — "click the blue 'Sign In' button" is better than "click login." Or escalate to a larger model.

---

# Demo 3: Post-Execution Analysis (7 min)

**Phase:** Post-Execution
**Model:** qwen3.5-4b (local) via LM Studio
**Runs:** After every nightly test run
**Cost:** $0 (local)

---

## What to Say

> "Final demo: post-execution. Tests ran overnight. We have 847 tests, 23 failures. A human would need 30-45 minutes to triage this. Let's see what a small local LLM does in seconds."

---

## Pre-Prepared: Sample Nightly Report

File: `reports/nightly-report.json`

```json
{
  "stats": {
    "tests": 847,
    "passes": 812,
    "failures": 23,
    "pending": 12,
    "duration": 1847000
  },
  "failures": [
    {
      "title": "Checkout — calculates total with tax",
      "fullTitle": "Checkout Flow — calculates total with tax",
      "err": "Expected 110.00 but got 108.50"
    },
    {
      "title": "Checkout — applies discount code",
      "fullTitle": "Checkout Flow — applies discount code",
      "err": "Expected 95.00 but got 100.00"
    },
    {
      "title": "Checkout — free shipping threshold",
      "fullTitle": "Checkout Flow — free shipping threshold",
      "err": "Expected free shipping badge to be visible but shipping was charged"
    },
    {
      "title": "Product page — displays price",
      "fullTitle": "Product Page — displays price",
      "err": "Expected $29.99 but got $0.00"
    },
    {
      "title": "Product page — shows stock status",
      "fullTitle": "Product Page — shows stock status",
      "err": "timeout: waiting for .stock-status"
    },
    {
      "title": "Checkout — validates shipping address",
      "fullTitle": "Checkout Flow — validates shipping address",
      "err": "element (#shipping-continue) not found"
    },
    {
      "title": "Checkout — payment method selection",
      "fullTitle": "Checkout Flow — payment method selection",
      "err": "element (#payment-credit-card) not found"
    },
    {
      "title": "Checkout — order review",
      "fullTitle": "Checkout Flow — order review",
      "err": "element (#review-submit) not found"
    },
    {
      "title": "Login — valid credentials",
      "fullTitle": "Authentication — valid credentials",
      "err": "timeout: waiting for .dashboard-header"
    },
    {
      "title": "API — authenticated request",
      "fullTitle": "API Tests — authenticated request",
      "err": "timeout: request to /api/user/profile timed out after 5000ms"
    }
  ]
}
```

**Pattern in the data (for the LLM to discover):**
- Failures 1-5: price/total calculation errors — likely /api/products returning wrong data
- Failures 6-8: element not found with `#shipping-continue`, `#payment-credit-card`, `#review-submit` — checkout UI restructured
- Failures 9-10: timeouts — likely environment/test data issue

---

## Code Chunk 3: Analyze the Report

File: `scripts/analyze-report.ts`

```typescript
import { readFileSync } from 'fs';

async function analyzeReport(reportPath: string) {
  const report = JSON.parse(readFileSync(reportPath, 'utf-8'));

  // Extract just what the LLM needs — not all 14,000 lines
  const failuresSummary = report.failures.map((f: any) => ({
    title: f.title,
    suite: f.fullTitle?.split('—')[0]?.trim() || 'Unknown',
    error: (f.err || '').substring(0, 200),
  }));

  const reportDigest = {
    stats: report.stats,
    failures: failuresSummary,
  };

  const prompt = `Analyze this test execution report.

${JSON.stringify(reportDigest, null, 2)}

Do the following:
1. Classify each failure into one of: APP_BUG (actual application regression),
   TEST_BUG (broken selector, wrong assertion — test needs update),
   ENV (timeout, network error, expired data), FLAKY (non-deterministic).
2. Group related failures by likely root cause. Look for shared error patterns.
3. Write a 3-sentence summary suitable for the team Slack channel.
4. Suggest concrete next actions (file bug, update test, rotate credentials, etc.)

Return ONLY valid JSON:
{
  "groups": [
    {
      "rootCause": "...",
      "category": "APP_BUG|TEST_BUG|ENV|FLAKY",
      "count": number,
      "failures": ["..."],
      "evidence": "..."
    }
  ],
  "summary": "3-sentence Slack-ready summary",
  "actions": [{ "action": "...", "priority": "critical|high|medium|low", "detail": "..." }]
}`;

  console.log('📊 Report loaded:', report.stats.tests, 'tests,',
    report.stats.failures, 'failures');
  console.log('🤖 Sending to local model for analysis...\n');

  const start = Date.now();
  const response = await fetch('http://localhost:1234/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen/qwen3.5-4b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      max_tokens: 2048,
    }),
  });

  const data = await response.json();
  const elapsed = Date.now() - start;

  // OpenAI-compatible response — extract from choices
  const analysis = JSON.parse(data.choices[0].message.content);

  console.log(`✅ Analysis complete (${elapsed}ms, local model)\n`);

  console.log('🔍 FAILURE GROUPS:');
  analysis.groups.forEach((g: any) => {
    const icon = g.category === 'APP_BUG' ? '🔴' :
                 g.category === 'TEST_BUG' ? '🟡' :
                 g.category === 'ENV' ? '🔵' : '⚪';
    console.log(`   ${icon} ${g.rootCause}`);
    console.log(`      ${g.count} failures — ${g.category}`);
    console.log(`      Evidence: ${g.evidence}\n`);
  });

  console.log('💬 SLACK SUMMARY:');
  console.log('  ', analysis.summary);

  console.log('\n📋 SUGGESTED ACTIONS:');
  analysis.actions.forEach((a: any) => {
    console.log(`   [${a.priority.toUpperCase()}] ${a.action}: ${a.detail}`);
  });
}

(async () => {
  await analyzeReport('./reports/nightly-report.json');
})();
```

---

## What to Highlight

1. **Before execution:** Show the raw failure list — 10 failures, different error messages. Looks like chaos.
2. **After execution:** The LLM grouped them into 3 root causes. 5 calculation errors → one API regression. 3 element-not-found → one UI restructure. 2 timeouts → expired credentials.
3. **The Slack summary:** 3 sentences, human-readable, actionable. Ready to paste.
4. **Time:** ~2 seconds. Cost: $0 (local model, private). Human equivalent: 30-45 minutes.
5. **Privacy:** The report never leaves the machine. No data sent to any API. This matters for companies with sensitive test data.

---

## Troubleshooting

- **LLM returns non-JSON:** The prompt says "Return ONLY valid JSON" but small models sometimes add markdown. Add `response = response.replace(/```json\n?/g, '').replace(/```\n?/g, '')` as a fallback.
- **Classification is wrong:** 3B models can misclassify. For critical reports, use a 7B model or add a human review step. The goal is to reduce triage time from 45 minutes to 5 minutes, not to eliminate the human entirely.

---

## Demo Checklist (Pre-Workshop)

- [ ] **Demo 1:** `ANTHROPIC_API_KEY` set and valid
- [ ] **Demo 1:** `specs/password-reset.md` file created
- [ ] **Demo 1:** Script executed once — have output screenshot as fallback
- [ ] **Demo 2:** LM Studio running with qwen3.5-4b loaded (verify at http://localhost:1234/v1/models)
- [ ] **Demo 2:** wdio-agent-service project set up, `wdio.conf.ts` configured (openai provider → LM Studio)
- [ ] **Demo 2:** wdio-agent-service project set up, `wdio.conf.ts` configured
- [ ] **Demo 2:** Chrome/Chromium installed
- [ ] **Demo 2:** `the-internet.herokuapp.com` accessible
- [ ] **Demo 2:** All three spec files execute without errors (pre-run each once)
- [ ] **Demo 3:** LM Studio running (same as Demo 2)
- [ ] **Demo 3:** `reports/nightly-report.json` file created
- [ ] **Demo 3:** Script executed once — have output screenshot as fallback
- [ ] **Terminal:** Font size ≥16pt, high contrast for projection
- [ ] **Backup:** Screenshots of all expected outputs ready in case of live issues
