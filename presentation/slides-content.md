# The AI-Augmented Testing Lifecycle — Presenter's Script

**50-minute workshop + 10 min Q&A**
Vince Graics · Nitrowise & Friends · 2026-06-11

---

## SECTION 0: HOOK (3 min)

### Slide 1 — Title

The AI-Augmented Testing Lifecycle

From Spec to Report — and Everything Between
*or* Layers of Language Models in Quality Assurance

> *Speaker:* Welcome. 50-minute workshop + 10 min Q&A. The question: "Where does AI actually fit in testing — not in theory, in practice, today?"

---

### Slide 2 — The Wrong Question

**"Should we be using AI in our testing?"** — Wrong question.

**"Where in our testing lifecycle does AI add the most value — and what kind of AI fits each job?"**

> *Speaker:* Binary question = wrong framing. AI is a toolkit. Different phases need different AI. A small local model is perfect for some tasks; a cloud model is better for others. This talk is about knowing which is which.

---

### Slide 3 — Agenda

| Icon | Topic | Detail |
|---|---|---|
| 🏗️ | The Testing Lifecycle | Where AI fits: design → runtime → post-execution |
| 🧠 | Demo 1 | Spec evaluation: from requirements to test cases |
| 🎮 | Demo 2 | Runtime agentic: tests that observe the DOM |
| 📊 | Demo 3 | Post-execution analysis: reports that explain themselves |
| 🔮 | The Endgame | When the phases connect |

50 min talk · 10 min Q&A

---

## SECTION 1: THE TESTING LIFECYCLE (14 min)

### Slide 4 — Part 1 Divider

**The Testing Lifecycle** — Where AI Fits, and What Kind

> *Speaker:* Let's start with the architecture. Where in the testing lifecycle does AI actually belong? Everywhere — but different AI at different phases.

---

### Slide 5 — Three Natural Phases

1. **Design-Time** — What should we test?
2. **Runtime** — Does it actually work?
3. **Post-Execution** — What did we learn?

**Most teams only apply AI to #2. That's leaving value on the table.**

> *Speaker:* You already do all three. Design-time: reading specs, writing test plans. Runtime: executing tests, asserting behavior. Post-execution: reading reports, triaging failures. Most teams take the obvious path: "AI can click buttons → use AI for that." But design-time and post-execution have huge untapped potential.

---

### Slide 6 — The Full Picture (Lifecycle Cards)

```
DESIGN-TIME                  RUNTIME                  POST-EXECUTION

Spec Ingestion & Eval    Element Targeting         Report Parsing & Triage
• Pull from site/docs    • DOM snapshot → TOON     • Parse JSON/XML reports
• Evaluate REQ complete  • LLM selects element     • Classify failures
• Specification-by-ex    • WebdriverIO executes    • Detect patterns

Test Case Design         Self-Healing & Eval       Management System Sync
• Infer test intent      • Selector fails →        • Summarize findings
• Structured test cases    re-observe → adapt      • File bugs with evidence
• Coverage gap analysis  • Evaluate assertions     • Update test cases / PR

Model: Cloud (reasoning) Model: Small local (4B)   Model: Small local (4B)

◄── Each phase feeds the next ──►
ENDGAME: Agent loop connects all three into continuous autonomous validation
```

> *Speaker:* Design-time: cloud, reasoning-heavy, runs once per spec change. Runtime: small local, fast, runs on every test execution. Post-execution: local, classification, private. The endgame is when these connect.

---

### Slide 7 — Phase 1: Design-Time

**Design-Time: "What Should We Test?"**

**Spec → Understanding flow:**
```
Requirement doc / spec page
    ↓
LLM reads & analyzes
    ├── REQ completeness: "What's missing? What's ambiguous?"
    ├── Specification-by-example (abstract → concrete scenarios)
    └── Structured test cases (preconditions, steps, assertions, risk)
```

**Not generating code. Generating understanding.**

> *Speaker:* Design-time AI is about understanding, not code. Feed spec → LLM evaluates completeness, generates concrete examples from abstract requirements, produces structured test cases.

---

### Slide 8 — Specification-by-Example

**Abstract:** "The login form must validate user credentials."

| Scenario | Username | Password | Expected |
|---|---|---|---|
| Valid login | testuser | correct-pass | Dashboard visible |
| Wrong password | testuser | wrong-pass | "Invalid credentials" |
| Empty fields | (empty) | (empty) | Validation message |
| SQL injection | admin'-- | anything | No auth bypass |
| Nonexistent user | no-such-user | anything | "Invalid credentials" (no user enum) |

**The LLM caught scenarios the human didn't write: SQL injection, user enumeration.**

> *Speaker:* Spec-by-example is the highest-ROI AI application. Abstract "validate credentials" becomes a concrete table. LLM catches edge cases humans miss.

---

### Slide 9 — REQ Completeness Check

**Input:** Requirements doc for "password reset" feature.

| ✅ Covered | ⚠️ Missing / Ambiguous |
|---|---|
| User can request reset via email | What if email doesn't exist? (enumeration risk) |
| Reset link expires after 1 hour | What if user requests reset twice? |
| New password ≥8 characters | Can user reuse old password? |
| | Rate limiting on reset endpoint? |
| | Response format? (API vs. redirect?) |

**4 critical gaps found. The spec was "complete" — to a human.**

> *Speaker:* Humans are bad at spotting absences. LLM identifies gaps: enumeration risk, rate limiting, password reuse, response format. Cost: one API call. Value: catching design flaws before implementation.

---

### Slide 10 — Phase 2: Runtime

**Runtime: "Does It Actually Work?"**

**The Agentic Pattern — Observe → Reason → Act → Evaluate:**

```
browser.agent("click the login button")

1. OBSERVE — @wdio/mcp/snapshot → visible, interactable elements → TOON format
   ↓
2. REASON — [TOON DOM] + [user prompt] → LLM
   "Which element matches 'login button'?"
   ↓
3. ACT — { action: "CLICK", selector: { css: "button[type='submit']" } }
   → Standard WebdriverIO command
   ↓
4. EVALUATE — Did click succeed? Page loaded? Assertion pass?
   If FAILED → feed error back → REASON again (self-healing)
```

> *Speaker:* Every agent call: snapshot DOM, LLM selects element, execute via WebdriverIO, evaluate result. If evaluation fails → feed error back → try new strategy. That's self-healing. Small local model (4B) is sufficient — element targeting is narrow and well-defined.

---

### Slide 11 — The Hybrid Approach

```typescript
describe('Login flow', () => {
  it('should login successfully', async () => {
    // TRADITIONAL: stable elements you control
    await $('#username').setValue('testuser');
    await $('#password').setValue('correct-pass');

    // AGENTIC: flaky / unpredictable elements
    await browser.agent('dismiss the cookie consent banner if visible');
    await browser.agent('click the login submit button');

    // TRADITIONAL: verify the result
    await expect($('.dashboard-header')).toBeDisplayed();
    await expect(browser).toHaveUrl(expect.stringContaining('/dashboard'));
  });
});
```

**Not "replace all selectors with AI." Traditional for what's stable. Agentic for what changes.**

> *Speaker:* The pattern. Traditional for stable, agentic for flaky. In the same test. Not one or the other — both, where each is strongest.

---

### Slide 12 — Self-Healing

**Scenario:** The logout button's CSS class changed in latest deploy.

| Traditional ❌ | Agentic ✅ |
|---|---|
| `$('a.button.secondary.radius').click()` | `browser.agent('click the logout button')` |
| FAILS — element not found | Agent observes DOM, finds button by text "Logout" |
| Manual fix required | Uses new class: `.button.alert.radius` |
| Test blocked until fixed | SUCCEEDS — zero code changes |

**The test doesn't report failure. It recovers.**

> *Speaker:* Self-healing is the most immediately valuable feature. Testing by intent, not by CSS class. Class changes → agent re-observes → adapts. This is the difference that matters.

---

### Slide 13 — Model Selection at Runtime

| Model | Size | Runs | Latency | Best For |
|---|---|---|---|---|
| qwen3.5-4b (LM Studio) | 3.4 GB | Local | 200-500ms | Simple element targeting |
| qwen2.5:14b (LM Studio) | 8.5 GB | Local | 500-2000ms | Complex pages, disambiguation |
| Claude Haiku 4.5 | Cloud | API | 300-800ms | Reliability-critical runs |
| GPT-4o-mini | Cloud | API | 400-1000ms | Broad compatibility |

**Start local. Escalate to cloud only when you need to. A small local model handles 80% of element targeting.**

> *Speaker:* Default to small local. Free, fast, private. Escalate to larger model or cloud only for the 20% of edge cases.

---

### Slide 14 — Phase 3: Post-Execution

**Post-Execution: "What Did We Learn?"**

**Reports that explain themselves:**
```
Nightly run: 847 tests · 23 failures · JUnit XML: 14,000 lines
Human triage time: 45 minutes

        ↓

Small local LLM reads the report
        ├── Classify failures: APP_BUG vs TEST_BUG vs ENV vs FLAKY
        ├── Group by root cause: "18 failures = same API returning 500"
        ├── 3-sentence Slack summary
        └── Auto-file bugs with evidence in Jira
```

**From "23 failures" to "1 root cause" in seconds. $0, private, local.**

> *Speaker:* Post-execution is the most underinvested opportunity. A small local LLM does the triage. Human does the decisions. Classification, pattern detection, summarization — perfect for small models.

---

### Slide 15 — Failure Classification

| Category | Example | Action |
|---|---|---|
| 🔴 App Bug | API returned 500, wrong total in cart | File bug, notify dev team |
| 🟡 Test Bug | Selector not found, wrong assertion value | Update test or self-heal |
| 🔵 Environment | Timeout, network error, test data expired | Check infra, refresh data |
| ⚪ Flaky | Passed on retry, no code changes | Flag for stabilization |

> *Speaker:* Four categories. LLM classifies. Human validates. Over time, the human validates less.

---

### Slide 16 — Management System Sync

```
LLM analysis complete
    ├── Jira: Create bug for /api/products 500
    │   Title, evidence attached, severity set
    ├── TestRail/Xray: Update test case statuses
    └── Slack: Post summary to #qa-channel
```

**The report doesn't just sit in CI logs. It acts.**

> *Speaker:* The final step: analysis flows into the systems the team actually uses. This closes the loop.

---

### Slide 17 — Model-Size-to-Task Map

| Tier | Size | Runs | Good At | Tasks | Phase |
|---|---|---|---|---|---|
| Micro | 1-3B | Local | Classification, targeting | Element clicks, report triage | Runtime, Post-exec |
| Small | 7-14B | Local | Analysis, generation | Spec eval, pattern detection | Design-time, Post-exec |
| Fast Cloud | Haiku, 4o-mini | API | Reasoning | Test design, intent inference | Design-time |
| Frontier | Opus, GPT-4.5 | API | Strategy, discovery | Autonomous exploration | Endgame |

**Pattern: Small & local for frequent tasks. Large & cloud for infrequent, high-value reasoning.**

---

## SECTION 2: DEMO 1 — SPEC EVALUATION (9 min)

### Slide 18 — Demo 1 Setup

**Phase:** Design-Time
**Model:** deepseek-v4-flash (cloud)
**Runs:** Once per spec change, not per test execution

We have a deliberately incomplete spec (`password-reset.md`):
```
Feature: Password Reset
- User can request a password reset via email
- Reset link is valid for 1 hour
- New password must be at least 8 characters
- User is redirected to login after reset
```

**What's missing (that the LLM should catch):**
- What if the email doesn't exist? (user enumeration)
- Can the user reuse their old password?
- Is there rate limiting?
- What's the error response format?

> *Speaker:* Feed to LLM. It evaluates completeness, generates spec-by-example, designs test cases. [EXECUTE]

---

### Slide 19 — Demo 1 Execution

```typescript
// scripts/evaluate-requirement.ts
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';

const BASE_URL = process.env.ANTHROPIC_BASE_URL || 'https://api.deepseek.com/anthropic';
const AUTH_TOKEN = process.env.ANTHROPIC_AUTH_TOKEN || '';
const MODEL = process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL || 'deepseek-v4-flash';

const anthropic = new Anthropic({ baseURL: BASE_URL, apiKey: AUTH_TOKEN });

const response = await anthropic.messages.create({
  model: MODEL,
  max_tokens: 8192,
  system: `You are a senior QA architect. Analyze for testing completeness.
    Return JSON: { completeness, specByExample, testCases, summary }`,
  messages: [{ role: 'user', content: `Evaluate:\n\n${spec}` }]
});
```

> *Speaker:* Simple script. Read spec file, send to LLM, get structured JSON. [SHOW OUTPUT]

---

### Slide 20 — Demo 1 Expected Output

```json
{
  "completeness": {
    "covered": ["Email reset flow", "Link expiration", "Min password length"],
    "missing": [
      "Behavior when email doesn't exist (user enumeration risk)",
      "Password reuse policy",
      "Rate limiting on reset endpoint",
      "Concurrent reset requests (link invalidation?)"
    ],
    "ambiguous": [
      "Error response format not specified (JSON? HTML?)",
      "'Valid for 1 hour' — from send time or first click?"
    ]
  },
  "specByExample": [ /* Scenarios with inputs and expected outcomes */ ],
  "testCases": [ /* Structured test cases with intent, severity, steps */ ],
  "summary": "Spec covers happy path but has critical gaps in error handling, security, and edge cases. 5 ambiguous behaviors need clarification."
}
```

> *Speaker:* LLM found 4 missing behaviors, 3 ambiguous items. Spec looked complete — to a human. Cost: ~$0.001. Time: ~2 seconds.

---

## SECTION 3: DEMO 2 — RUNTIME AGENTIC (9 min)

### Slide 21 — Demo 2 Setup

**Phase:** Runtime
**Model:** qwen3.5-4b (local, ~3.4 GB) via LM Studio
**Tool:** wdio-agent-service
**Target:** the-internet.herokuapp.com

```bash
npm install wdio-agent-service
# LM Studio running locally with qwen3.5-4b loaded
```

```typescript
// wdio.conf.ts
const config = {
  // ...
  services: [
    ['agent', {
      provider: 'openai', // LM Studio's OpenAI-compatible API
      providerUrl: process.env.LLM_PROVIDER_URL || 'http://localhost:1234',
      model: process.env.LLM_MODEL || 'qwen/qwen3.5-4b',
      token: process.env.OPENAI_API_KEY || 'lm-studio-no-auth',
      maxActions: 2,
      timeout: 30000,
      maxRetries: 2,
      maxOutputTokens: 1024,
      toonFormat: 'yaml-like',
    }],
  ],
}
```

> *Speaker:* Setup is minimal. LM Studio runs the model locally, exposes OpenAI-compatible API. No cloud, no cost. [EXECUTE]

---

### Slide 22 — Demo 2: Single-Action + Multi-Action

```typescript
// Test 1 — Single action: agent navigates, traditional verifies
await browser.url('https://the-internet.herokuapp.com');
await expect($('h1.heading')).toHaveText('Welcome to the-internet');  // traditional

const result = await browser.agent('click the "Form Authentication" link');
// → [{ type: "CLICK", target: { linkText: "Form Authentication" } }]
await expect($('h2')).toHaveText('Login Page');                       // traditional

// Test 2 — Multi-action: agent fills entire form (maxActions: 2)
const formAction = await browser.agent(
  'fill from with username / password: tomsmith / SuperSecretPassword!'
);
// → [{ type: "SET_VALUE", target: {css:"#username"}, value:"tomsmith" },
//    { type: "SET_VALUE", target: {css:"#password"}, value:"SuperSecretPassword!" }]

await browser.agent('click the button that submits the login form');
await expect($('.flash.success'))                                    // traditional
  .toHaveText(expect.stringContaining('You logged into a secure area!'));
```

> *Speaker:* Two patterns. Single-action for navigation. Multi-action for form fills (maxActions: 2). Traditional assertion always verifies the result.

---

### Slide 23 — Demo 2: Self-Healing

```typescript
// Self-healing: logout button CSS class changed in latest deploy
// Old class: a.button.secondary.radius → New class: a.button.alert.radius

console.log('Traditional selector would FAIL');
// $("a.button.secondary.radius") → element not found ❌

const logoutResult = await browser.agent('click the logout button');
// Agent observes DOM, finds button with text "Logout"
// Uses new class: .button.alert.radius
// ✅ Logout successful — zero test code changes

await expect($('h2')).toHaveText('Login Page');
// The test healed itself
```

**Agent adds ~300ms. Test failure + re-run + human debugging = 10+ minutes.**

> *Speaker:* Self-healing in action. CSS class changed, agent adapted, test passed. No human touched this test. Testing by intent, not by selector. [EXECUTE]

---

## SECTION 4: DEMO 3 — POST-EXECUTION ANALYSIS (7 min)

### Slide 24 — Demo 3 Setup

**Phase:** Post-Execution
**Model:** qwen3.5-4b (local) via LM Studio

We have a realistic Mocha JSON report: 847 tests, 23 failures.

```json
{
  "stats": { "tests": 847, "failures": 23, "passes": 812 },
  "failures": [
    { "title": "Checkout — calculates total with tax",
      "err": "Expected 110.00 but got 108.50" },
    { "title": "Checkout — applies discount code",
      "err": "Expected 95.00 but got 100.00" },
    { "title": "Checkout — validates shipping address",
      "err": "element (#shipping-continue) not found" },
    ...
  ]
}
```

> *Speaker:* Realistic scenario. 23 failures scattered across suites. Human triage: 30-45 minutes. Let's see what the LLM does. [EXECUTE]

---

### Slide 25 — Demo 3 Execution

```typescript
// scripts/analyze-report.ts
const report = JSON.parse(readFileSync('./reports/nightly-report.json', 'utf-8'));

const response = await fetch('http://localhost:1234/v1/chat/completions', {
  method: 'POST',
  body: JSON.stringify({
    model: 'qwen/qwen3.5-4b',
    messages: [{ role: 'user', content: `Classify these failures: ${JSON.stringify(report)}` }],
    temperature: 0,
    max_tokens: 2048,
  })
});

const analysis = JSON.parse(data.choices[0].message.content);
```

> *Speaker:* Simple script. Read report, send to local LM Studio, get structured analysis back.

---

### Slide 26 — Demo 3 Expected Output

```json
{
  "groups": [
    { "rootCause": "/api/products returning 500", "category": "APP_BUG",
      "count": 18, "evidence": "All 18 failures started after 3am deploy" },
    { "rootCause": "Checkout UI restructured — selectors changed",
      "category": "TEST_BUG", "count": 3 },
    { "rootCause": "Test credentials expired",
      "category": "ENV", "count": 2 }
  ],
  "summary": "18 failures caused by /api/products returning 500 after 3am deploy. 3 are selector changes in checkout. 2 are expired credentials. Suggest rollback.",
  "actions": [
    { "action": "FILE_BUG", "priority": "critical",
      "title": "/api/products returning 500 since 3am deploy" },
    { "action": "UPDATE_TESTS", "priority": "high",
      "detail": "3 checkout selectors need updating" }
  ]
}
```

> *Speaker:* 18 failures → 1 root cause. 3-sentence Slack summary. Concrete actions. Time: ~2 seconds. Cost: $0. Private: report never leaves the machine.

---

## SECTION 5: THE ENDGAME (6 min)

### Slide 27 — Today vs. Tomorrow

**Today:** Three separate phases, loosely connected. Human drives each handoff.

**Tomorrow — The Connected Loop:**
```
Spec change → Test design → App exploration → Execution
    ↑                                              ↓
Spec updated ← Auto-PR ← Report findings ← Self-heal + Evaluate
```

> *Speaker:* Every phase feeds the next. The loop never stops. Each piece exists today. Integration is the hard part.

---

### Slide 28 — What's Holding This Back

| Blocker | Reality | Timeline |
|---|---|---|
| 🧠 Model reliability | LLMs hallucinate in long agent loops | Improving every 6 months |
| 💰 Cost at scale | Full-loop runs cost $0.05-0.50 each | Dropping ~50% yearly |
| 🔍 Observability | Debugging agent decisions is hard | Tooling emerging |
| 🛡️ Trust | Nobody ships based on "agent says OK" | Shadow → advisory → gated → autonomous |

**These are engineering problems, not physics problems.**

> *Speaker:* Four blockers. All being worked on. None are fundamental limits. Climb the trust ladder.

---

### Slide 29 — What You Can Do Now

| Phase | Start Here | Time to Value |
|---|---|---|
| Design-Time | Feed your next spec to an LLM. Ask: "What's missing?" | 5 minutes |
| Runtime | Pick your flakiest element. Replace with `browser.agent()` | 30 minutes |
| Post-Execution | Pipe your nightly report through a local LLM for triage | 1 hour |

⚠️ **Don't:** Try to build the connected autonomous loop next week.
✅ **Do:** Apply AI surgically to one phase. See the value. Then expand.

---

### Slide 30 — Key Takeaways

1. **AI in testing is a lifecycle, not a feature** — design, runtime, post-execution
2. **Different phases need different AI** — small local for frequent tasks, cloud for reasoning
3. **The hybrid approach is the pragmatic path** — traditional where it works, AI where it adds value
4. **Post-execution is the biggest untapped opportunity** — reports that triage themselves
5. **The endgame: a connected loop** — spec → design → execute → analyze → adapt — autonomously

---

### Slide 31 — Resources

| Resource | Link |
|---|---|
| 📦 wdio-agent-service | github.com/Winify/wdio-agent-service |
| 🤖 LM Studio (local models) | lmstudio.ai |
| 🤖 Ollama (local models) | ollama.com |
| 🧪 The Internet (demo app) | the-internet.herokuapp.com |
| 🔧 WebdriverIO | webdriver.io |

---

### Slide 32 — Q&A

**Questions?**

Design. Runtime. Post-Execution.
Where do you want to start?

---

## BACKUP SLIDES

### Backup — TOON Format

**TOON = Token-Efficient Object Notation.** Stripped-down DOM representation.

YAML-like (better for ≤7B models):
```yaml
- role: button
  name: Login
  css: button#login-btn
  text: Sign In
  visible: true
  interactable: true
```

Tabular (better for large models):
```
| role   | name  | css              | text    | visible | interactable |
|--------|-------|-----------------|---------|---------|--------------|
| button | Login | button#login-btn| Sign In | true    | true         |
```

Includes: role, accessible name, visible text, simplified CSS, interactable, visibility.
Excludes: full class lists, hidden elements, layout, scripts, comments (~80% stripped).

---

### Backup — Model Selection Decision Tree

- **Design-time** → Cloud (Claude Haiku / GPT-4o-mini). Reasoning quality matters, runs infrequently.
- **Runtime** → Default: Local 4B (qwen3.5-4b). Complex: Local 7-14B or cloud. Critical: Cloud with caching.
- **Post-execution** → Local 4B. Classification is pattern matching, not reasoning. Privacy matters.

**Pattern:** frequent tasks → small local | infrequent reasoning → cloud.

---

### Backup — Cost Comparison

| Approach | Per Test Run | Per 1000 Runs |
|---|---|---|
| Traditional (no AI) | $0 | $0 (human maintenance dominates) |
| Runtime: local 4B | $0 | $0 |
| Runtime: cloud Haiku | ~$0.001 | ~$10 |
| Design-time: cloud | $0 at runtime | $0 at runtime |
| Post-exec: local 4B | $0 | $0 |

**The most expensive thing isn't the API call. It's the human spending 45 minutes triaging a report.**

---

### Backup — The Trust Ladder

| Stage | What Happens | When |
|---|---|---|
| Shadow | Agent runs alongside existing tests, results compared, not blocking | Month 1 |
| Advisory | Agent findings surfaced to humans for review | Months 2-3 |
| Gated | Agent auto-handles known flows, escalates unknowns | Months 3-6 |
| Autonomous | Agent runs, decides, reports, files PRs independently | 6+ months |

**You don't deploy autonomous testing. You grow into it.**
