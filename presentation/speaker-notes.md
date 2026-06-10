# Speaker Notes: The AI-Augmented Testing Lifecycle

Deep-dive reference organized by lifecycle phase. Know these cold before the workshop. Use for Q&A and hallway conversations.

---

## The Architecture: Why "Lifecycle" Not "Layers"

The original framing ("4 layers of AI") was a teaser. The real architecture is the testing lifecycle:

- **Design-Time:** What should we test? — spec analysis, REQ evaluation, test case design, intent inference
- **Runtime:** Does it actually work? — element targeting, hybrid execution, self-healing, assertion evaluation
- **Post-Execution:** What did we learn? — report parsing, failure classification, pattern detection, management sync

The endgame isn't "Layer 4." It's the connected loop where each phase feeds the next autonomously.

---

## Phase 1: Design-Time — Extended Context

### Specification-by-Example
The most underrated AI-in-testing application. Abstract requirements are the source of most testing gaps. "The system shall authenticate users" — what does that mean? The LLM forces concreteness by generating a table of inputs and expected outputs for every scenario it can derive.

Pattern:
```
Given [abstract requirement]
Generate a table: Scenario | Input A | Input B | ... | Expected Outcome
Mark any row where the spec doesn't define the expected outcome as AMBIGUOUS.
```

This alone catches more bugs than most test suites.

### REQ Completeness Evaluation
The prompt pattern that works best:
```
You are evaluating a requirements specification for testing completeness.
For each requirement, ask:
1. Is the happy path defined?
2. Are error states defined?
3. Are edge cases defined? (empty, null, max length, special chars)
4. Are security concerns addressed? (injection, enumeration, rate limiting)
5. Are non-functional requirements specified? (performance, accessibility, localization)
6. Are dependencies documented? (what external systems does this touch?)
Flag anything missing or ambiguous.
```

### When Design-Time AI Pays Off Most
- New feature specs (before a single line of code is written)
- Compliance/regulatory requirements (where gaps have legal consequences)
- API contracts (OpenAPI specs — the LLM generates test cases directly from the schema)
- Migration projects (old spec vs. new spec — what changed? what tests need updating?)

### Model Choice for Design-Time
- **Default:** Claude Haiku or GPT-4o-mini. Fast, cheap, good reasoning.
- **Complex specs:** Claude Sonnet or GPT-4o. When the spec is 50+ pages or cross-system.
- **Local option:** qwen2.5-coder:14b can handle basic spec evaluation. Struggles with nuanced gap analysis.
- **Cost:** ~$0.002-0.05 per analysis. Run once per spec change. Negligible.

---

## Phase 2: Runtime — Extended Context

### Why "Hybrid" Is the Only Pragmatic Approach
Pure agentic testing (every interaction via LLM) is:
- Slow (300ms per interaction × 20 interactions = 6 seconds added per test)
- Expensive at scale (1000 tests × 20 calls × $0.001 = $20 per run)
- Less debuggable (why did the agent click THAT?)

Pure traditional testing is:
- Fragile (CSS class changes → test fails)
- High maintenance (selector updates across hundreds of tests)
- Blind to intent (tests selector presence, not behavioral correctness)

Hybrid gives you the best of both. Use traditional for what's stable. Use agentic for what's not.

### The Self-Healing Story (Know This Cold)
This is the most concrete, relatable benefit. Everyone in the room has spent hours fixing broken selectors.

The counter-argument: "Just use data-testid everywhere."
Rebuttal:
1. You can't data-testid a third-party iframe, a cookie banner, or an ad widget
2. data-testid proliferates into a parallel DOM that also needs maintenance
3. Testing by testid is STILL testing by implementation detail, not by intent
4. Agentic testing tests what the user sees — which is what actually matters

### TOON Format Explained
TOON = Token-Efficient Object Notation. It's a stripped-down DOM representation.

What's INCLUDED: role, accessible name, visible text, simplified CSS selector, interactable flag, visibility, input type, ARIA attributes.

What's EXCLUDED: full class lists, hidden elements, layout/styling, scripts, comments, non-interactable elements.

Why it matters: A typical DOM page might be 50,000+ tokens. TOON encoding reduces this to 500-2,000 tokens. This is the difference between a 3B model handling it vs. requiring a cloud model.

### Latency Budget
```
Traditional WebdriverIO click:   ~50ms
Agent call (local 3B):           ~310ms (snapshot 50ms + encode 10ms + LLM 200ms + execute 50ms)
Agent call (cloud Haiku):        ~500ms (adds network round-trip)
```

For 2-3 agent calls per test, you're adding ~1 second. For the elements that would otherwise flake, this is a bargain. For 50 agent calls per test, you have a design problem — too much reliance on agentic targeting.

### When NOT to Use browser.agent()
- Stable login forms you own
- Elements with known, unchanging data-testid
- Simple navigation (browser.url() is faster and more reliable)
- Assertions on known text content
- Loops (batch agent calls instead)

### Caching Strategy for CI
For CI runs where the same page is tested repeatedly:
```typescript
// First run: agent decides, caches the selector
// Subsequent runs: use cached decision
// Re-validate cache every N runs or when the page version changes
```
This eliminates LLM latency on CI while keeping the self-healing benefit of the initial agent decision.

---

## Phase 3: Post-Execution — Extended Context

### Why Post-Execution Is Underinvested
Most teams apply AI to runtime (obvious — "AI clicks buttons!") but ignore post-execution. This is backwards. Post-execution AI:
- Has higher ROI (saves 30-45 minutes of human time per run vs. 1-2 seconds of latency savings)
- Is easier (classification is simpler than real-time DOM reasoning)
- Is more private (report data stays local)
- Has fewer failure modes (worst case: wrong classification. Runtime worst case: wrong element clicked)

### Failure Classification Categories
The four-category system that works:
1. **APP_BUG** — actual regression. Error is in the application behavior.
2. **TEST_BUG** — test needs updating. Selector changed, assertion wrong, test data stale.
3. **ENV** — environment issue. Timeout, network, expired credentials, infrastructure.
4. **FLAKY** — non-deterministic. Passed on retry, no code changes.

The LLM classifies. The human validates. Over time, the human validates less as trust builds.

### Pattern Detection Across Runs
Beyond single-run analysis: feed the LLM the last 7 nightly reports. It detects:
- Which failures are new (regression introduced yesterday)
- Which failures are recurring (permanently flaky tests)
- Which failures are correlated with specific deploys
- Trend lines: is the suite getting more or less stable?

This turns test reports from "what happened last night" into "what should we do today."

### Privacy Advantage of Local Models
Post-execution reports often contain:
- Internal URLs and endpoints
- Test data (sometimes production-like)
- Business logic exposed in assertion messages
- Stack traces with internal paths

Sending this to a cloud API is a security concern at many companies. Local 3B models keep everything on-prem. This is a major selling point for enterprise audiences.

---

## Cross-Cutting: Model Selection

### The Frequency-Cost-Reliability Triangle

| Frequency | Model | Why |
|---|---|---|
| Every test run (100s/day) | Local 3B | Free, fast, private |
| Every deployment (10s/day) | Local 7-14B or Cloud Haiku | More reasoning, still cheap |
| Every spec change (1-5/week) | Cloud (Haiku/Sonnet) | Reasoning quality matters |
| Every sprint (1/2 weeks) | Cloud (Sonnet/Opus) | Strategic analysis, worth $0.05 |
| One-off (migration, audit) | Frontier (Opus) | Best analysis, cost irrelevant |

### Specific Model Recommendations

**qwen2.5-coder:3b (1.9 GB, local)**
- Element targeting on simple/moderate pages
- Report classification
- Label/status assignment
- Latency: 150-400ms
- Limitation: struggles with >50 element pages, sometimes picks ambiguous element

**qwen2.5-coder:14b (8.5 GB, local)**
- Complex page element targeting
- Basic spec evaluation
- Pattern detection in reports
- Latency: 500-2000ms
- Limitation: needs decent RAM, still weaker than cloud on complex reasoning

**Claude Haiku 4.5 (cloud)**
- Spec evaluation & test design
- Reliability-critical element targeting
- Intent inference
- Latency: 300-800ms (with network)
- Cost: ~$0.001/call

**Claude Sonnet 4.6 (cloud)**
- Complex spec analysis (50+ pages)
- Test strategy design
- Cross-system test planning
- Cost: ~$0.01-0.05/call

**GPT-4o-mini (cloud)**
- General-purpose design-time tasks
- Good fallback if Anthropic API is unavailable
- Cost: ~$0.0005/call

---

## Cross-Cutting: The Trust Ladder

How to introduce autonomous testing without getting fired:

1. **Shadow Mode** (month 1): Agent runs alongside existing tests. Results compared, not blocking. Zero risk. Pure data collection.

2. **Advisory Mode** (months 2-3): Agent findings surfaced to humans. "Here's what the agent found. Do you agree?" Human makes the call.

3. **Gated Mode** (months 3-6): Agent auto-handles known, routine flows. Unknowns and anomalies escalated to humans. Agent saves time on the boring stuff.

4. **Autonomous Mode** (6+ months): Agent trusted within defined scope. Runs, decides, reports, files PRs. Scope expands as confidence grows.

Most teams should be at Shadow or Advisory today for anything beyond Layer 3.

---

## Anticipated Q&A

### Q: "Doesn't this make tests non-deterministic?"
**A:** The agent's element selection could in theory vary between runs if the DOM changes. But with temperature=0 (default), the same DOM + same prompt = same output. The LLM call is stateless and deterministic. What's non-deterministic is the DOM itself — but that's the point. The agent adapts to DOM changes, which is exactly what a brittle traditional selector can't do.

### Q: "What about test reporting? How do I trace agent decisions?"
**A:** Every `browser.agent()` call returns the structured JSON action. Log it. The wdio-agent-service emits debug output showing: snapshot size, TOON token count, LLM response time, exact selector used. For CI, store these as test artifacts. Agent decisions are fully auditable.

### Q: "How do I handle authentication / SSO with agents?"
**A:** Don't. Login forms are usually stable — use traditional WebdriverIO. If your SSO redirects through a third-party identity provider with a dynamic DOM, agent calls can navigate the SSO flow. But credential injection should always be traditional (known form fields).

### Q: "What if the 3B model picks the wrong element?"
**A:** Mitigations: (1) Be specific in your prompt. "Click the blue 'Sign In' button" is better than "click login." (2) Use `maxRetries` — the service retries with exponential backoff. (3) For critical flows, cache the first successful selector and reuse it. (4) Escalate to a larger model for reliability-critical tests. The failure mode is "wrong element clicked → assertion fails → test fails" — same outcome as a broken selector. But the fix is a better prompt, not a code change.

### Q: "Can the agent handle iframes?"
**A:** Yes, but switch context first: `browser.switchToFrame(selector)` → `browser.agent("click the pay button")`. The agent only sees elements within the current browsing context. This is deliberate — explicit iframe handling is more reliable than expecting the LLM to infer iframe boundaries.

### Q: "How does this compare to Playwright's AI features?"
**A:** Playwright has no native LLM-powered element targeting. Third-party tools (Browserbase, Octomind) offer it as managed services. wdio-agent-service is: open-source, provider-agnostic, can run fully locally. Different tradeoffs — control vs. convenience.

### Q: "What's the environmental impact?"
**A:** A 3B model running inference uses ~10-20W (laptop under light load). On GPU, faster and more efficient. A single cloud API call to a large model uses significantly more compute on the provider's end — it's just not your electricity bill. Local small models are the most energy-efficient option per agent call.

### Q: "When should I NOT use any of this?"
**A:** When your application is stable, your selectors never break, your test suite runs green every night, your specs are always complete, and your team has infinite time. For everyone else: start at one phase, prove the value, expand.

### Q: "How do I convince my manager/CTO?"
**A:** Don't pitch "AI testing." Pitch specific value:
- "We can catch missing requirements before implementation" (Design-Time) → saves rework
- "We can eliminate the 3 selectors that break every sprint" (Runtime) → reduces maintenance
- "We can triage nightly failures in 2 minutes instead of 45" (Post-Execution) → saves engineering hours
- Each of these has a measurable ROI. Pick one. Prove it. Then expand.

### Q: "What's the single biggest mistake teams make?"
**A:** Trying to go fully autonomous on day one. They replace all selectors with agent calls, burn tokens, add latency, and get inconsistent results. Then they declare "AI testing doesn't work." The right approach: surgical application. One flaky element. One spec analysis. One report triage. See the value. Then scale.
