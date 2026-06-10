---
title: "The AI-Augmented Testing Lifecycle"
theme: "dark"
highlightTheme: "monokai"
transition: "slide"
width: 1280
height: 720
margin: 0.1
---

<!-- ============================================================
     SECTION 0: TITLE & HOOK (3 min)
     ============================================================ -->

# The AI-Augmented<br/>Testing Lifecycle

## From Spec to Report — and Everything Between

<!-- .slide: data-background="#1a1a2e" -->

<div style="margin-top: 2em; font-size: 0.6em; opacity: 0.7;">
Vince Graics · Nitrowise & Friends · 2026-06-11
</div>

Notes:
- Welcome. 50-minute workshop + 10 minutes Q&A.
- This is about the full testing lifecycle — not just one tool or one technique.
- The question we're answering: "Where does AI actually fit in testing? Not in theory — in practice, today?"

---

## The Question Everyone's Asking

<div style="font-size: 1.3em; line-height: 2;">
  <p class="fragment">"Should we be using AI in our testing?"</p>
  <p class="fragment" style="color: #EB7A01;"><strong>Wrong question.</strong></p>
</div>

<div class="fragment" style="font-size: 1.4em; line-height: 2; margin-top: 1em;">
  <p style="color: #1A9988;"><strong>"Where in our testing lifecycle does AI add the most value —</strong></p>
  <p style="color: #1A9988;"><strong>and what kind of AI fits each job?"</strong></p>
</div>

Notes:
- Everyone's asking the binary question: "AI or no AI?"
- That's the wrong framing. AI isn't one thing. It's a toolkit.
- The right question: which part of your testing lifecycle benefits most, and what model size fits that task?
- Different phases need different AI. A 3B local model is perfect for some tasks. A cloud model is better for others.
- This talk is about knowing which is which.

---

## Agenda

<div style="display: flex; flex-direction: column; gap: 0.3em; font-size: 0.8em; text-align: left; max-width: 700px; margin: 0 auto;">

<div style="display: flex; gap: 0.5em; align-items: baseline;">
  <span style="font-size: 1.3em;">🏗️</span>
  <span><strong>The Testing Lifecycle</strong> &nbsp;—&nbsp; <span style="opacity: 0.7;">Where AI fits: design → runtime → post-execution</span></span>
</div>

<div style="display: flex; gap: 0.5em; align-items: baseline;">
  <span style="font-size: 1.3em;">🧠</span>
  <span><strong>Demo 1</strong> &nbsp;—&nbsp; <span style="opacity: 0.7;">Spec evaluation: from requirements to test cases</span></span>
</div>

<div style="display: flex; gap: 0.5em; align-items: baseline;">
  <span style="font-size: 1.3em;">🎮</span>
  <span><strong>Demo 2</strong> &nbsp;—&nbsp; <span style="opacity: 0.7;">Runtime agentic: tests that observe the DOM</span></span>
</div>

<div style="display: flex; gap: 0.5em; align-items: baseline;">
  <span style="font-size: 1.3em;">📊</span>
  <span><strong>Demo 3</strong> &nbsp;—&nbsp; <span style="opacity: 0.7;">Post-execution analysis: reports that explain themselves</span></span>
</div>

<div style="display: flex; gap: 0.5em; align-items: baseline;">
  <span style="font-size: 1.3em;">🔮</span>
  <span><strong>The Endgame</strong> &nbsp;—&nbsp; <span style="opacity: 0.7;">When the phases connect</span></span>
</div>

</div>

<div style="margin-top: 1.5em; font-size: 0.85em; opacity: 0.5;">
  50 min talk · 10 min Q&A
</div>

Notes:
- Quick roadmap. Architecture first — understand the lifecycle. Then three practical demos. Then the endgame vision.
- Each demo covers a different phase, a different model size, a different type of AI task.
- By the end you'll know: what to apply where, what model to use, and what's production-ready vs. emerging.

---

<!-- ============================================================
     SECTION 1: THE TESTING LIFECYCLE (14 min)
     ============================================================ -->

## Part 1

# The Testing Lifecycle

### Where AI Fits — And What Kind

Notes:
- Let's start with the architecture. Where in the testing lifecycle does AI actually belong?
- The answer: everywhere. But different AI at different phases.

---

## Testing Has Three Natural Phases

<div style="font-size: 1.3em; line-height: 2.5;">

<p>1️⃣ <strong>Design-Time</strong> — What should we test?</p>
<p>2️⃣ <strong>Runtime</strong> — Does it actually work?</p>
<p>3️⃣ <strong>Post-Execution</strong> — What did we learn?</p>

</div>

<div class="fragment" style="margin-top: 1em; color: #EB7A01;">
  <strong>Most teams only apply AI to #2. That's leaving value on the table.</strong>
</div>

Notes:
- Testing has three natural phases. You already do all three — you just might not think of them as distinct.
- Design-time: reading specs, writing test plans, designing test cases.
- Runtime: executing tests, interacting with the application, asserting behavior.
- Post-execution: reading reports, triaging failures, filing bugs, updating test management.
- Most teams take the obvious path: "AI can click buttons → let's use AI for that." But design-time and post-execution have huge AI potential that's being ignored.

---

## The Full Picture

<div style="display: flex; justify-content: space-around; text-align: center; gap: 0.5em; font-size: 0.55em;">

<div style="flex: 1; background: #1a2a3a; border-radius: 8px; padding: 0.5em; border-top: 3px solid #5bc0de;">
<h4 style="color: #5bc0de; margin: 0 0 0.4em;">DESIGN-TIME</h4>
<div style="background: #162030; border-radius: 6px; padding: 0.4em; margin-bottom: 0.4em;">
  <strong>Spec Ingestion & Evaluation</strong><br/>
  <span style="opacity: 0.7;">Pull from site/wiki/doc<br/>Evaluate REQ completeness<br/>Specification-by-example</span>
</div>
<div style="background: #162030; border-radius: 6px; padding: 0.4em;">
  <strong>Test Case Design</strong><br/>
  <span style="opacity: 0.7;">Infer test intent<br/>Structured test cases<br/>Coverage gap analysis</span>
</div>
<div style="margin-top: 0.4em; font-size: 0.85em; color: #5bc0de;">Model: Cloud (reasoning)</div>
</div>

<div style="flex: 1; background: #1a3a2a; border-radius: 8px; padding: 0.5em; border-top: 3px solid #1A9988;">
<h4 style="color: #1A9988; margin: 0 0 0.4em;">RUNTIME</h4>
<div style="background: #163020; border-radius: 6px; padding: 0.4em; margin-bottom: 0.4em;">
  <strong>Element Targeting & Execution</strong><br/>
  <span style="opacity: 0.7;">DOM snapshot → TOON<br/>LLM selects element<br/>WebdriverIO executes</span>
</div>
<div style="background: #163020; border-radius: 6px; padding: 0.4em;">
  <strong>Self-Healing & Evaluation</strong><br/>
  <span style="opacity: 0.7;">Selector fails → re-observe<br/>Adapt → succeed<br/>Evaluate assertions</span>
</div>
<div style="margin-top: 0.4em; font-size: 0.85em; color: #1A9988;">Model: Small local (4B)</div>
</div>

<div style="flex: 1; background: #2a2a1a; border-radius: 8px; padding: 0.5em; border-top: 3px solid #f0ad4e;">
<h4 style="color: #f0ad4e; margin: 0 0 0.4em;">POST-EXECUTION</h4>
<div style="background: #303016; border-radius: 6px; padding: 0.4em; margin-bottom: 0.4em;">
  <strong>Report Parsing & Triage</strong><br/>
  <span style="opacity: 0.7;">Parse JSON/XML reports<br/>Classify failures<br/>Detect patterns</span>
</div>
<div style="background: #303016; border-radius: 6px; padding: 0.4em;">
  <strong>Management System Sync</strong><br/>
  <span style="opacity: 0.7;">Summarize findings<br/>File bugs with evidence<br/>Update test cases / auto-PR</span>
</div>
<div style="margin-top: 0.4em; font-size: 0.85em; color: #f0ad4e;">Model: Small local (4B)</div>
</div>

</div>

<div style="margin-top: 1em; text-align: center; font-size: 0.6em; opacity: 0.8;">
◄── Each phase feeds the next ──► &nbsp; | &nbsp;
<strong>ENDGAME:</strong> Agent loop connects all three into continuous autonomous validation
</div>

Notes:
- Here's the full picture. Three phases. Each has multiple AI applications.
- Design-time: spec ingestion, REQ evaluation, test case design. Heavier models — cloud, 7B+. These are reasoning-heavy tasks. But they run once per spec change, not per test execution.
- Runtime: element targeting, self-healing, assertion evaluation. Lightweight models — 3B local. These run on every test execution, so latency and cost matter.
- Post-execution: report parsing, failure classification, management sync. Classification tasks — 3-7B local works well. Pattern matching, not reasoning.
- The endgame is the bottom arrow: when these phases connect into an autonomous loop.

---

<!-- Design-Time Phase -->

## Phase 1: Design-Time

### "What Should We Test?"

Notes:
- Let's zoom into each phase. Design-time first — this is where testing intent is born.

---

## Design-Time: Spec → Understanding

<div style="text-align: left; font-size: 0.62em;">

**The flow:**

```
Requirement doc / spec page
     │
     ▼
LLM reads & analyzes
     │
     ├── REQ completeness: "What's missing? What's ambiguous?"
     │
     ├── Specification-by-example:
     │     Abstract → concrete scenarios with inputs and expected outcomes
     │
     └── Structured test cases:
          Preconditions · Steps · Assertions · Risk level · Test data
```

</div>

<div class="fragment" style="margin-top: 0.5em; color: #1A9988;">
  <strong>Not generating code. Generating understanding.</strong>
</div>

Notes:
- Design-time AI is about understanding, not code.
- You feed the LLM a specification — a requirements doc, a product page, a user story, an API spec.
- It does three things: evaluates completeness (what's missing?), generates concrete examples from abstract requirements (specification-by-example), and produces structured test cases.
- The output isn't test code. It's a test plan. But it's a test plan that a machine can consume — which matters when we get to runtime.
- Model choice: this needs reasoning. Cloud models (Claude Haiku, GPT-4o-mini) are the sweet spot. You run this once per spec change, not per test run, so cost is negligible.

---

## Design-Time: Specification-by-Example

<div style="text-align: left; font-size: 0.6em;">

**Abstract:** "The login form must validate user credentials."

**LLM generates concrete scenarios:**

<table style="font-size: 0.85em;">
<tr><th>Scenario</th><th>Username</th><th>Password</th><th>Expected</th></tr>
<tr><td>Valid login</td><td>testuser</td><td>correct-pass</td><td style="color:#1A9988">Dashboard visible</td></tr>
<tr><td>Wrong password</td><td>testuser</td><td>wrong-pass</td><td style="color:#EB7A01">"Invalid credentials"</td></tr>
<tr><td>Empty fields</td><td>(empty)</td><td>(empty)</td><td style="color:#EB7A01">Validation message</td></tr>
<tr><td>SQL injection</td><td>admin'--</td><td>anything</td><td style="color:#EB7A01">No auth bypass</td></tr>
</table>

</div>

<div class="fragment" style="margin-top: 0.3em; font-size: 0.6em;">
  <em>LLM caught scenarios the human didn't: SQL injection, user enumeration.</em>
</div>

Notes:
- Specification-by-example is one of the highest-ROI applications of AI in testing.
- Abstract requirements are ambiguous. "Validate credentials" — what does that mean? The LLM forces concreteness.
- It generates a table of scenarios: every combination of inputs and expected outcomes.
- Notice it caught edge cases the human didn't explicitly write: SQL injection, user enumeration. These are standard testing concerns the LLM knows about.
- We'll see this live in Demo 1.

---

## Design-Time: REQ Completeness Check

<div style="text-align: left; font-size: 0.58em;">

**Input:** Requirements doc for a "password reset" feature

<div class="fragment">
<p><strong>LLM evaluation:</strong></p>

<table style="font-size: 0.8em;">
<tr><th style="color:#1A9988">✅ Covered</th><th style="color:#EB7A01">⚠️ Missing / Ambiguous</th></tr>
<tr><td>User can request reset via email</td><td>What if email doesn't exist? (user enumeration)</td></tr>
<tr><td>Reset link expires after 1 hour</td><td>What if user requests reset twice?</td></tr>
<tr><td>New password ≥8 characters</td><td>Can user reuse old password?</td></tr>
<tr><td></td><td>Rate limiting on reset endpoint?</td></tr>
<tr><td></td><td>Response format? (API vs. redirect?)</td></tr>
</table>

</div>

<div class="fragment" style="margin-top: 0.3em; color: #EB7A01; font-size: 0.9em;">
  <strong>4 critical gaps found. The spec was "complete" — to a human.</strong>
</div>

</div>

Notes:
- This is the REQ completeness check. Feed the LLM a requirements document. Ask it: "What's missing?"
- Humans are bad at spotting absences. We see what's written and assume completeness.
- The LLM identifies gaps: user enumeration risk, link invalidation logic, password reuse policy, rate limiting, response format ambiguity.
- These aren't hypothetical — every one of these gaps has caused production incidents.
- The cost: one API call. The value: catching design flaws before a single line of test code is written.

---

## Phase 2: Runtime

### "Does It Actually Work?"

Notes:
- Phase 2. Runtime. This is where most people think AI in testing lives — and it does. But there's more to it than "AI clicks buttons."

---

## Runtime: The Agentic Pattern

<div style="display: flex; justify-content: center; align-items: stretch; gap: 0.3em; font-size: 0.55em; margin-top: 0.5em;">

<div style="flex: 1; text-align: center;">
  <div style="background: #1a2a3a; border-radius: 8px; padding: 0.6em 0.3em; margin-bottom: 0.3em; border: 1px solid #5bc0de;">
    <div style="color: #5bc0de; font-weight: bold; margin-bottom: 0.3em;">1. OBSERVE</div>
    <div style="opacity: 0.8;">@wdio/mcp/snapshot</div>
    <div style="opacity: 0.7;">Visible, interactable</div>
    <div style="opacity: 0.7;">elements → TOON format</div>
  </div>
</div>

<div style="display: flex; align-items: center; color: #5bc0de; font-size: 1.5em;">→</div>

<div style="flex: 1; text-align: center;">
  <div style="background: #1a3a2a; border-radius: 8px; padding: 0.6em 0.3em; margin-bottom: 0.3em; border: 1px solid #1A9988;">
    <div style="color: #1A9988; font-weight: bold; margin-bottom: 0.3em;">2. REASON</div>
    <div style="opacity: 0.8;">TOON DOM + prompt → LLM</div>
    <div style="opacity: 0.7;">"Which element matches</div>
    <div style="opacity: 0.7;">'login button'?"</div>
  </div>
</div>

<div style="display: flex; align-items: center; color: #1A9988; font-size: 1.5em;">→</div>

<div style="flex: 1; text-align: center;">
  <div style="background: #2a2a1a; border-radius: 8px; padding: 0.6em 0.3em; margin-bottom: 0.3em; border: 1px solid #f0ad4e;">
    <div style="color: #f0ad4e; font-weight: bold; margin-bottom: 0.3em;">3. ACT</div>
    <div style="opacity: 0.8;">{ action: "CLICK",</div>
    <div style="opacity: 0.7;">selector: { css: "..." } }</div>
    <div style="opacity: 0.7;">→ WebdriverIO executes</div>
  </div>
</div>

<div style="display: flex; align-items: center; color: #f0ad4e; font-size: 1.5em;">→</div>

<div style="flex: 1; text-align: center;">
  <div style="background: #2a1a1a; border-radius: 8px; padding: 0.6em 0.3em; border: 1px solid #EB7A01;">
    <div style="color: #EB7A01; font-weight: bold; margin-bottom: 0.3em;">4. EVALUATE</div>
    <div style="opacity: 0.8;">Did the action succeed?</div>
    <div style="opacity: 0.7;">Assertion passes?</div>
    <div style="color: #EB7A01; margin-top: 0.2em;">FAILED → back to REASON</div>
  </div>
</div>

</div>

<div style="text-align: center; margin-top: 0.8em; font-size: 0.6em; opacity: 0.7;">
  <code style="background: #2d2d2d; padding: 0.2em 0.6em; border-radius: 4px;">browser.agent("click the login button")</code>
</div>

Notes:
- The runtime agentic pattern. Observe → Reason → Act → Evaluate.
- Step 1: Snapshot the DOM. Only visible, interactable elements. Stripped down to TOON format for token efficiency.
- Step 2: Send to the LLM. "Here's the DOM. Here's what the user wants to do. What's the action?"
- Step 3: Execute as a standard WebdriverIO command. The LLM doesn't execute arbitrary code — it returns a structured action that maps to WebdriverIO primitives.
- Step 4: Evaluate. Did it work? If not, feed the error back and try again. That's the self-healing loop.
- Model: Small local model (4B) is sufficient. Element targeting is a narrow, well-defined task.

---

## Runtime: The Hybrid Approach

<div style="text-align: left; font-size: 0.58em; background: #2d2d2d; padding: 0.6em; border-radius: 8px;">

```typescript
// TRADITIONAL: stable elements you control
await $('#username').setValue('testuser');
await $('#password').setValue('correct-pass');

// AGENTIC: flaky / unpredictable elements
await browser.agent('dismiss the cookie consent banner if visible');
await browser.agent('click the login submit button');

// TRADITIONAL: verify the result
await expect($('.dashboard-header')).toBeDisplayed();
await expect(browser).toHaveUrl(expect.stringContaining('/dashboard'));
```

</div>

<div class="fragment" style="margin-top: 0.5em; font-size: 0.6em; color: #1A9988;">
  <strong>Not "replace all selectors with AI."</strong> Traditional for what's stable. Agentic for what changes.
</div>

Notes:
- This is the hybrid approach. It's not AI everywhere. It's AI where AI solves a real problem.
- Username and password fields — stable, known IDs. Use traditional WebdriverIO. Fast, debuggable, reliable.
- Cookie banner — unpredictable classes, may or may not appear. Agent call.
- Submit button — might have dynamic classes from A/B testing. Agent call.
- Assertions — known elements, known expectations. Traditional.
- The key: you're mixing AI and traditional in the same test. It's not one or the other.

---

## Runtime: Self-Healing

<div style="text-align: left; font-size: 0.7em;">

**Scenario:** The logout button's CSS class changed in the latest deploy.

<div style="display: flex; gap: 1em; margin-top: 1em;">

<div style="width: 48%; background: #2d2d2d; padding: 0.8em; border-radius: 8px;">
<h4 style="color: #EB7A01;">❌ Traditional</h4>
<pre><code>// Hardcoded selector
await $('a.button.secondary.radius')
  .click();

// ❌ FAILS: element not found
// Manual fix required
// Test is blocked until fixed</code></pre>
</div>

<div style="width: 48%; background: #2d2d2d; padding: 0.8em; border-radius: 8px;">
<h4 style="color: #1A9988;">✅ Agentic</h4>
<pre><code>// Semantic intent
await browser.agent(
  'click the logout button'
);

// Agent observes DOM
// Finds button with text "Logout"
// Uses new class: .button.alert.radius
// ✅ SUCCEEDS — zero code changes</code></pre>
</div>

</div>

</div>

<div class="fragment" style="margin-top: 0.8em;">
  <strong>The test doesn't report failure. It recovers.</strong>
</div>

Notes:
- Self-healing is the most immediately valuable feature of agentic runtime testing.
- Traditional test: hardcoded selector → class changes → test fails → human fixes it. Scale that across 500 tests.
- Agentic test: semantic intent ("logout button") → agent observes actual DOM → finds the right element regardless of class name → succeeds.
- Zero test code changes. The test adapts at runtime.
- We'll see this live in Demo 2.

---

## Runtime: Model Selection Matters Here

<div style="text-align: left; font-size: 0.6em;">

| Model | Size | Runs | Latency | Best For |
|---|---|---|---|---|
| **qwen3.5-4b** (LM Studio) | 3.4 GB | Local | 200-500ms | Simple element targeting, stable pages |
| **qwen2.5:14b** (LM Studio) | 8.5 GB | Local | 500-2000ms | Complex pages, disambiguation |
| **Claude Haiku 4.5** | Cloud | API | 300-800ms | Reliability-critical runs |
| **GPT-4o-mini** | Cloud | API | 400-1000ms | Broad compatibility |

</div>

<div class="fragment" style="margin-top: 0.8em; font-size: 0.85em;">
  <strong>Start local. Escalate to cloud only when you need to.</strong><br/>
  <span style="font-size: 0.75em;">A small local model handles 80% of element targeting. The other 20% gets a larger model.</span>
</div>

Notes:
- Model selection at runtime is critical because latency and cost multiply across hundreds of tests.
- Start with the local 3B. It handles most element targeting. It's free, private, and fast.
- Escalate to a larger local model (14B) or cloud model only for the 20% of cases where the 3B struggles — very complex pages, ambiguous elements.
- Pattern: default to small, escalate strategically.

---

## Phase 3: Post-Execution

### "What Did We Learn?"

Notes:
- Phase 3. The one most teams ignore completely. Post-execution: after tests run, what happens to the results?

---

## Post-Execution: Reports That Explain Themselves

<div style="text-align: left; font-size: 0.62em;">

**The problem:** 847 tests, 23 failures, 14,000 lines of JUnit XML. Human triage: 45 minutes.

**The AI approach:**

```
JUnit/JSON report
      │
      ▼
Small local LLM reads the report
      │
      ├── Failure classification:
      │     • 18/23: same API returning 500
      │     • 3/23: selector changes (UI restructured)
      │     • 2/23: test data expired
      │
      ├── 3-sentence Slack summary: "18 failures trace to
      │     /api/products 500 after 3am deploy. 3 selector
      │     changes in checkout. 2 expired credentials."
      │
      └── Management system: auto-file bugs, link evidence
```

</div>

Notes:
- Post-execution is where AI saves the most human time — and where almost nobody is applying it yet.
- The problem: nightly runs produce massive reports. A human spends 30-60 minutes just triaging.
- The AI approach: feed the report to a small local LLM. It classifies failures by root cause, detects patterns, and writes a summary.
- 18 failures tracing to one API change — a human would spot that eventually. The LLM spots it instantly.
- Classification, pattern matching, summarization — these are tasks where 3B models excel. No cloud needed.

---

## Post-Execution: Failure Classification

<div style="text-align: left; font-size: 0.55em;">

**LLM classifies each failure into actionable categories:**

<table>
<tr><th>Category</th><th>Example</th><th>Action</th></tr>
<tr><td style="color:#EB7A01;">🔴 App Bug</td><td>API returned 500, wrong total in cart</td><td>File bug, notify dev team</td></tr>
<tr><td style="color:#f0ad4e;">🟡 Test Bug</td><td>Selector not found (UI changed), wrong assertion value</td><td>Update test or self-heal</td></tr>
<tr><td style="color:#5bc0de;">🔵 Env</td><td>Timeout, network error, test data expired</td><td>Check infra, refresh data</td></tr>
<tr><td style="color:#999;">⚪ Flaky</td><td>Passed on retry, no code changes</td><td>Flag for stabilization</td></tr>
</table>

</div>

<div class="fragment" style="margin-top: 1em; font-size: 0.85em;">
  <strong>From "23 failures" to "1 root cause" in seconds.</strong><br/>
  <span style="font-size: 0.75em;">Not replacing human judgment — focusing it where it matters.</span>
</div>

Notes:
- The LLM doesn't just say "23 failures." It categorizes them by what action is needed.
- App bug → file a bug report. Test bug → update the test. Environment → check infrastructure. Flaky → flag for investigation.
- The human still makes the final call. But instead of spending 45 minutes reading logs to figure out what's related, they spend 5 minutes reviewing the LLM's classification and acting.
- This is force multiplication, not replacement.

---

## Post-Execution: Management System Sync

<div style="text-align: left; font-size: 0.75em;">

```
LLM analysis complete
      │
      ├──▶ Jira: Create bug for /api/products 500
      │      • Title: "Products API returning 500 after nightly deploy"
      │      • Evidence: 18 test failures attached
      │      • Severity: Critical (blocking checkout)
      │
      ├──▶ TestRail/Xray: Update test case status
      │      • TC-401 (Checkout flow): FAILED → selector change
      │      • TC-402 (Product search): PASSED
      │      • TC-403 (Login): PASSED
      │
      └──▶ Slack: Post summary to #qa-channel
             "Nightly run summary: 847 tests, 23 failures.
              18 caused by API regression (bug filed: PROJ-1234).
              3 selector updates needed. 2 credentials expired."
```

</div>

<div class="fragment" style="margin-top: 0.8em; font-size: 0.85em;">
  <strong>The report doesn't just sit in CI logs. It acts.</strong>
</div>

Notes:
- The final step: the analysis doesn't stay in a log file. It flows into the systems the team actually uses.
- Bug tracker gets a properly formatted issue with evidence attached.
- Test management system gets updated statuses.
- Team chat gets a human-readable summary.
- This closes the loop. Design → Execute → Analyze → Act.

---

## The Model-Size-to-Task Map

<div style="font-size: 0.55em; text-align: left;">

| Tier | Size | Runs | Good At | Tasks | Phase |
|---|---|---|---|---|---|
| **Micro** | 1-3B | Local | Classification, targeting | Element clicks, report triage | Runtime, Post-exec |
| **Small** | 7-14B | Local | Analysis, generation | Spec eval, pattern detection | Design-time, Post-exec |
| **Fast Cloud** | Haiku, 4o-mini | API | Reasoning | Test design, intent inference | Design-time |
| **Frontier** | Opus, GPT-4.5 | API | Strategy, discovery | Autonomous exploration | Endgame |

</div>

<div class="fragment" style="margin-top: 0.6em; font-size: 0.65em; color: #1A9988;">
  <strong>Pattern:</strong> Small & local for frequent tasks. Cloud for infrequent, high-value reasoning.
</div>

Notes:
- This is the model-size-to-task map. It's the key takeaway from the architecture section.
- Micro models (1-3B): run locally, handle narrow tasks cheaply and privately. Element targeting, report classification.
- Small models (7-14B): run locally if you have the RAM, handle structured analysis. Spec evaluation, pattern detection.
- Fast cloud: cheap API calls for design-time reasoning. Run once per spec change, not per test run. Cost is negligible.
- Frontier: expensive, for strategy and discovery. Not for everyday use. For the endgame.
- Pattern: frequency and cost drive model selection. Frequent tasks → small local. Infrequent reasoning → cloud.

---

<!-- ============================================================
     SECTION 2: DEMO 1 — SPEC EVALUATION (9 min)
     ============================================================ -->

## Part 2 — Demo 1

# Spec Evaluation

### From a Requirement to a Test Plan

Notes:
- Enough architecture. Let's see this working.
- Demo 1: Design-time. We take a requirements document, feed it to an LLM, and get back a REQ evaluation, specification-by-example, and structured test cases.
- This uses a cloud model (Claude Haiku) because spec evaluation requires reasoning. But it runs once per spec change — cost is fractions of a cent.
- [SWITCH TO TERMINAL — Demo 1]
- Script reads a deliberately incomplete spec (password-reset.md), sends to LLM via DeepSeek-compatible API.
- LLM outputs: completeness assessment (4 missing, 3 ambiguous), spec-by-example table, structured test cases, summary.
- Key moment: LLM catches user enumeration risk, missing rate limiting — gaps a human missed.

---

<!-- ============================================================
     SECTION 3: DEMO 2 — RUNTIME AGENTIC (9 min)
     ============================================================ -->

## Part 3 — Demo 2

# Runtime Agentic Testing

### Tests That Observe the DOM

Notes:
- Demo 2. Runtime. wdio-agent-service with qwen3.5-4b via LM Studio.
- Local 4B model. No API key, no cloud, no cost per call. Target: the-internet.herokuapp.com.
- [SWITCH TO TERMINAL — Demo 2]

---

## Demo 2: Single-Action vs. Multi-Action

<div style="text-align: left; font-size: 0.55em; background: #2d2d2d; padding: 0.6em; border-radius: 8px;">

```typescript
// Single action: agent navigates, traditional verifies
await browser.agent('click the "Form Authentication" link');
// → [{ type: "CLICK", target: { linkText: "Form Authentication" } }]
await expect($('h2')).toHaveText('Login Page');                    // traditional

// Multi-action: agent fills the form in one call (maxActions: 2)
await browser.agent('fill from with username / password: tomsmith / SuperSecretPassword!');
// → [{ type: "SET_VALUE", target: {css:"#username"}, value:"tomsmith" },
//    { type: "SET_VALUE", target: {css:"#password"}, value:"SuperSecretPassword!" }]

await browser.agent('click the button that submits the login form');
await expect($('.flash.success'))                                  // traditional
  .toHaveText(expect.stringContaining('You logged into a secure area!'));
```

</div>

<div style="margin-top: 0.4em; font-size: 0.6em; color: #1A9988;">
  <strong>maxActions: 2</strong> — agent plans multiple steps at once. Traditional assertions verify the outcome.
</div>

Notes:
- Two patterns. Test 1: single agent action for navigation, traditional for verification.
- Test 2: multi-action — the agent plans the entire form fill in one call (`maxActions: 2`), returns an array of SET_VALUE + CLICK actions.
- Traditional assertion at the end verifies the result.
- The key: agent handles the unpredictable DOM interactions. Traditional handles the stable verification.
- [SWITCH TO TERMINAL, EXECUTE]
- [SHOW OUTPUT — point out: the JSON array of actions, TOON snapshot, LLM response time]

---

## Demo 2: Self-Healing

<div style="text-align: left; font-size: 0.65em; background: #2d2d2d; padding: 1em; border-radius: 8px;">

```typescript
// Self-healing: the logout button's class changed in the latest deploy
// Old class: a.button.secondary.radius
// New class: a.button.alert.radius

console.log('🔄 Simulating: class changed overnight...');
console.log('   Traditional selector would FAIL:');
console.log('   $("a.button.secondary.radius") → element not found ❌\n');

console.log('🤖 Agent: observing DOM, adapting...');
const logoutResult = await browser.agent(
  'click the logout button'  // semantic intent, not CSS class
);

console.log('Agent adapted — used:', JSON.stringify(logoutResult.selector));
// → { css: "a.button.alert.radius", text: "Logout" }
// ✅ Agent found the element despite the class change

await expect($('h2')).toHaveText('Login Page');
console.log('✅ Logout successful — zero test code changes');
console.log('   The test healed itself.');
```

</div>

<div style="margin-top: 0.5em; font-size: 0.85em; color: #1A9988;">
  <strong>Selector broke. Agent observed. Agent adapted. Test passed.</strong><br/>
  <span style="font-size: 0.75em;">No human touched this test.</span>
</div>

Notes:
- [EXECUTE]
- Self-healing in action. The CSS class changed. A traditional test would fail and block the pipeline.
- The agent observes the actual DOM, finds the semantically matching element, and clicks it.
- This is testing by intent, not by selector.
- [SHOW OUTPUT — highlight: old class not found, new class found, test passed]

---

<!-- ============================================================
     SECTION 4: DEMO 3 — POST-EXECUTION ANALYSIS (7 min)
     ============================================================ -->

## Part 4 — Demo 3

# Post-Execution Analysis

### Reports That Explain Themselves

Notes:
- Demo 3. Post-execution. The phase most teams miss.
- We have a realistic nightly report: 847 tests, 23 failures.
- Script feeds it to local qwen3.5-4b via LM Studio. LLM classifies failures, detects patterns, writes Slack summary.
- Human triage: 30-45 min. LLM: ~2 seconds. Cost: $0. Data stays local.
- [SWITCH TO TERMINAL — Demo 3]

---

<!-- ============================================================
     SECTION 5: THE ENDGAME (6 min)
     ============================================================ -->

## Part 5

# The Endgame

### When the Phases Connect

Notes:
- We've seen three separate demos — three phases, three AI applications, three model sizes.
- The endgame is when these aren't separate. They're connected into an autonomous loop.

---

## Today: Three Separate Phases

<div style="display: flex; justify-content: center; align-items: stretch; gap: 0.3em; font-size: 0.5em; margin-top: 0.5em;">

<div style="flex: 1; text-align: center;">
  <div style="background: #1a2a3a; border-radius: 8px; padding: 0.6em; border: 1px solid #5bc0de;">
    <div style="color: #5bc0de; font-weight: bold; margin-bottom: 0.3em;">DESIGN-TIME</div>
    <div style="opacity: 0.8;">Human reads spec</div>
    <div style="opacity: 0.7;">LLM assists with</div>
    <div style="opacity: 0.7;">analysis & test design</div>
    <div style="margin-top: 0.4em; font-size: 0.9em;">🧑 Human-driven</div>
  </div>
</div>

<div style="display: flex; align-items: center; color: #5bc0de; font-size: 1.5em;">→</div>

<div style="flex: 1; text-align: center;">
  <div style="background: #1a3a2a; border-radius: 8px; padding: 0.6em; border: 1px solid #1A9988;">
    <div style="color: #1A9988; font-weight: bold; margin-bottom: 0.3em;">RUNTIME</div>
    <div style="opacity: 0.8;">Tests execute with</div>
    <div style="opacity: 0.7;">agentic calls mixed in</div>
    <div style="opacity: 0.7;">for flaky elements</div>
    <div style="margin-top: 0.4em; font-size: 0.9em;">🤖 + 🧑 Mixed</div>
  </div>
</div>

<div style="display: flex; align-items: center; color: #1A9988; font-size: 1.5em;">→</div>

<div style="flex: 1; text-align: center;">
  <div style="background: #2a2a1a; border-radius: 8px; padding: 0.6em; border: 1px solid #f0ad4e;">
    <div style="color: #f0ad4e; font-weight: bold; margin-bottom: 0.3em;">POST-EXECUTION</div>
    <div style="opacity: 0.8;">Human reads report</div>
    <div style="opacity: 0.7;">and triages failures</div>
    <div style="opacity: 0.7;">manually</div>
    <div style="margin-top: 0.4em; font-size: 0.9em;">🧑 Human-driven</div>
  </div>
</div>

</div>

<div class="fragment" style="margin-top: 0.8em; font-size: 0.65em; color: #EB7A01; text-align: center;">
  <strong>Each phase has AI. But they don't talk to each other.</strong>
</div>

Notes:
- Today's reality: each phase has AI augmentation, but they're disconnected.
- Design-time: human drives, LLM assists. Runtime: human wrote the tests, agent helps with flaky elements. Post-execution: human reads the report.
- The phases don't feed into each other. A runtime failure doesn't automatically trigger a design-time spec reassessment. A post-execution pattern doesn't automatically update the runtime tests.

---

## Tomorrow: The Connected Loop

<div style="display: flex; justify-content: center; align-items: stretch; gap: 0.2em; font-size: 0.5em; margin-top: 0.4em;">

<div style="flex: 1; text-align: center;">
  <div style="background: #1a2a3a; border-radius: 8px; padding: 0.5em; border: 1px solid #5bc0de;">
    <div style="color: #5bc0de; font-weight: bold;">SPEC CHANGE</div>
    <div style="opacity: 0.7;">Spec updated</div>
  </div>
</div>
<div style="display: flex; align-items: center; color: #5bc0de; font-size: 1.4em;">→</div>

<div style="flex: 1; text-align: center;">
  <div style="background: #1a2a3a; border-radius: 8px; padding: 0.5em; border: 1px solid #5bc0de;">
    <div style="color: #5bc0de; font-weight: bold;">TEST DESIGN</div>
    <div style="opacity: 0.7;">Regenerate cases</div>
  </div>
</div>
<div style="display: flex; align-items: center; color: #1A9988; font-size: 1.4em;">→</div>

<div style="flex: 1; text-align: center;">
  <div style="background: #1a3a2a; border-radius: 8px; padding: 0.5em; border: 1px solid #1A9988;">
    <div style="color: #1A9988; font-weight: bold;">EXPLORE + EXECUTE</div>
    <div style="opacity: 0.7;">Map UI + run tests</div>
  </div>
</div>
<div style="display: flex; align-items: center; color: #f0ad4e; font-size: 1.4em;">→</div>

<div style="flex: 1; text-align: center;">
  <div style="background: #2a2a1a; border-radius: 8px; padding: 0.5em; border: 1px solid #f0ad4e;">
    <div style="color: #f0ad4e; font-weight: bold;">SELF-HEAL + EVAL</div>
    <div style="opacity: 0.7;">Recover & classify</div>
  </div>
</div>
<div style="display: flex; align-items: center; color: #EB7A01; font-size: 1.4em;">→</div>

<div style="flex: 1; text-align: center;">
  <div style="background: #2a1a1a; border-radius: 8px; padding: 0.5em; border: 1px solid #EB7A01;">
    <div style="color: #EB7A01; font-weight: bold;">REPORT + PR</div>
    <div style="opacity: 0.7;">Auto-file, update spec ↻</div>
  </div>
</div>

</div>

<div style="margin-top: 0.5em; text-align: center; font-size: 0.55em; opacity: 0.8;">
  Every phase feeds the next. The loop never stops.
</div>

Notes:
- The connected loop. This is the endgame.
- Spec changes → agent regenerates test cases → agent explores the app to map new UI → executes tests → self-heals on failure → evaluates results → reports findings → files PRs with new test code → updates the spec with discovered behaviors.
- Every phase feeds the next. The loop never stops.
- This isn't science fiction. Each piece exists today. The integration is the hard part.

---

## What's Holding This Back

<div style="text-align: left; font-size: 0.6em;">

| Blocker | Reality | Timeline |
|---|---|---|
| 🧠 Model reliability | LLMs hallucinate in long agent loops | Improving every 6 months |
| 💰 Cost at scale | Full-loop runs cost $0.05-0.50 each | Dropping ~50% yearly |
| 🔍 Observability | Debugging agent decisions is hard | Tooling emerging |
| 🛡️ Trust | Nobody ships based on "agent says OK" | Shadow → advisory → gated → autonomous |

</div>

<div class="fragment" style="margin-top: 0.6em; font-size: 0.6em;">
  <strong>Engineering problems, not physics problems. They will be solved.</strong>
</div>

Notes:
- Honest assessment. Four blockers. All are being worked on.
- Model reliability: context windows get larger, hallucination rates drop. Each generation improves.
- Cost: token prices drop ~50% per year. A $0.50 loop today will be $0.05 in two years.
- Observability: agent traces, structured logging, replay tools — all being built.
- Trust: the ladder is shadow mode → advisory → gated → autonomous. You climb it as confidence grows.
- None of these are fundamental limits. They're the same class of problems we solved for CI/CD, for cloud, for containers.

---

## What You Can Do Now

<div style="text-align: left; font-size: 0.6em;">

**Start at one phase. Prove value. Expand.**

| Phase | Start Here | Time |
|---|---|---|
| **Design-Time** | Feed your next spec to an LLM. Ask: "What's missing?" | 5 min |
| **Runtime** | Pick your flakiest element. Replace with `browser.agent()` | 30 min |
| **Post-Execution** | Pipe your nightly report through a local LLM for triage | 1 hr |

<div class="fragment" style="margin-top: 0.5em; font-size: 0.85em;">
  <strong style="color:#EB7A01;">⚠️ Don't:</strong> Try to build the autonomous loop next week.
  <strong style="color:#1A9988;">✅ Do:</strong> Apply AI surgically to one phase. See the value. Then connect.
</div>

</div>

Notes:
- Concrete next steps. Not "rewrite everything." Not "wait for the perfect model."
- Pick one phase. Design-time: 5 minutes to feed a spec to an LLM and ask what's missing.
- Runtime: 30 minutes to install wdio-agent-service and replace your flakiest selector.
- Post-execution: 1 hour to pipe a nightly report through a local LLM.
- Each of these delivers immediate value. Each builds confidence for the next step.

---

## Key Takeaways

<div style="font-size: 0.6em; line-height: 2.0; text-align: left;">

<p>1️⃣ AI in testing is a <strong>lifecycle</strong>, not a feature — design, runtime, post-execution</p>

<p>2️⃣ <strong>Different phases need different AI</strong> — small local for frequent tasks, cloud for reasoning</p>

<p>3️⃣ The <strong>hybrid approach</strong> — traditional where it works, AI where it adds value</p>

<p>4️⃣ <strong>Post-execution</strong> is the biggest untapped opportunity — reports that triage themselves</p>

<p>5️⃣ The endgame: a <strong>connected loop</strong> — spec → design → execute → analyze → adapt</p>

</div>

Notes:
- Five takeaways. These are what I want you to remember a week from now.
- One: lifecycle, not feature. AI belongs at every phase.
- Two: different phases, different models. Match model size to task.
- Three: hybrid. Not "AI or traditional." Both, where each is strongest.
- Four: post-execution is the sleeping giant. Everyone focuses on runtime. The biggest time-saver is reports that triage themselves.
- Five: the connected loop is the endgame. Each piece works today. Connecting them is the next frontier.

---

## Resources

<div style="text-align: left; font-size: 0.65em;">

|   |   |
|---|---|
| 📦 **wdio-agent-service** | [github.com/Winify/wdio-agent-service](https://github.com/Winify/wdio-agent-service) |
| 🤖 **LM Studio** (local models) | [lmstudio.ai](https://lmstudio.ai) |
| 🤖 **Ollama** (local models) | [ollama.com](https://ollama.com) |
| 🧪 **The Internet** (demo app) | [the-internet.herokuapp.com](https://the-internet.herokuapp.com) |
| 🔧 **WebdriverIO** | [webdriver.io](https://webdriver.io) |
| 📖 **Demo scripts** (this talk) | [github.com/Winify/...](#) |

</div>

Notes:
- Resources to take home. The wdio-agent-service repo has full docs.
- Demo scripts from this talk are available — includes all three demos we walked through.
- Happy to answer questions after the session or online.

---

<!-- ============================================================
     SECTION 6: Q&A (10 min)
     ============================================================ -->

# Questions?

<div style="font-size: 1.5em; opacity: 0.7; margin-top: 2em;">
  Design. Runtime. Post-Execution.<br/>
  Where do you want to start?
</div>

Notes:
- 10 minutes for questions.
- Common topics I'm ready for:
  - Model selection: "When should I use a 3B vs. 7B vs. cloud?"
  - Cost: "What does this cost at scale?"
  - Trust: "How do you know the agent didn't click the wrong thing?"
  - CI/CD integration: "How do I run agentic tests in my pipeline?"
  - Specific testing challenges: iframes, shadow DOM, mobile, visual regression
- If we run out of time, come find me after.

---

<!-- ============================================================
     BACKUP SLIDES
     ============================================================ -->

## Backup: TOON Format

<div style="text-align: left; font-size: 0.65em;">

**YAML-like** (default, better for ≤7B models):
```yaml
- role: button
  name: Login
  css: button#login-btn
  text: Sign In
  visible: true
  interactable: true
```

**Tabular** (token-efficient, better for large models):
```
| role   | name  | css              | text    | visible | interactable |
|--------|-------|-----------------|---------|---------|--------------|
| button | Login | button#login-btn| Sign In | true    | true         |
```

TOON strips out: full class lists, hidden elements, layout info, scripts, comments.
Keeps only what the LLM needs to decide an action.

</div>

Notes:
- Backup: TOON format details for Q&A.
- YAML-like gives structure — small models need explicit key-value pairs.
- Tabular is token-dense — large models parse dense formats well.
- The encoding strips ~80% of the DOM. Only interactable, visible elements.

---

## Backup: Model Selection Decision Tree

<div style="display: flex; gap: 0.5em; font-size: 0.55em; text-align: left;">

<div style="flex: 1; background: #1a2a3a; border-radius: 8px; padding: 0.6em; border-top: 3px solid #5bc0de;">
<h4 style="color: #5bc0de; margin: 0 0 0.4em;">Design-Time</h4>
<p style="margin: 0 0 0.4em;"><strong>Use:</strong> Cloud<br/><span style="opacity: 0.7;">Claude Haiku / GPT-4o-mini</span></p>
<p style="margin: 0; opacity: 0.6; font-size: 0.9em;">Runs infrequently.<br/>Reasoning quality over speed.</p>
</div>

<div style="flex: 1; background: #1a3a2a; border-radius: 8px; padding: 0.6em; border-top: 3px solid #1A9988;">
<h4 style="color: #1A9988; margin: 0 0 0.4em;">Runtime</h4>
<p style="margin: 0 0 0.2em;"><strong>Default:</strong><br/><span style="opacity: 0.7;">Local 4B (qwen3.5-4b)</span></p>
<p style="margin: 0 0 0.2em;"><strong>Complex:</strong><br/><span style="opacity: 0.7;">Local 7-14B or Cloud</span></p>
<p style="margin: 0 0 0.2em;"><strong>Critical:</strong><br/><span style="opacity: 0.7;">Cloud with caching</span></p>
<p style="margin: 0; opacity: 0.6; font-size: 0.9em;">Fast + free for 80% of cases.</p>
</div>

<div style="flex: 1; background: #2a2a1a; border-radius: 8px; padding: 0.6em; border-top: 3px solid #f0ad4e;">
<h4 style="color: #f0ad4e; margin: 0 0 0.4em;">Post-Execution</h4>
<p style="margin: 0 0 0.4em;"><strong>Use:</strong> Local 4B<br/><span style="opacity: 0.7;">Classification + triage</span></p>
<p style="margin: 0; opacity: 0.6; font-size: 0.9em;">Pattern matching, not reasoning.<br/>Privacy: no data leaves CI.</p>
</div>

</div>

<div style="text-align: center; margin-top: 0.8em; font-size: 0.55em; opacity: 0.5;">
  Pattern: frequent tasks → small local &nbsp;|&nbsp; infrequent reasoning → cloud
</div>

Notes:
- Backup: decision tree for model selection.
- Design-time: cloud. Reasoning quality over latency.
- Runtime: start local 3B. Escalate only when needed.
- Post-execution: local. Classification doesn't need a frontier model.

---

## Backup: Cost Comparison

<div style="text-align: left; font-size: 0.55em;">

| Approach | Per Run | Per 1000 | Notes |
|---|---|---|---|
| Traditional (no AI) | $0 | $0 | Human maintenance cost dominates |
| Runtime: local model | $0 | $0 | Electricity only (~10W) |
| Runtime: cloud Haiku | ~$0.001 | ~$10 | Per agent call |
| Design-time: cloud | $0 | $0 | Once per spec change (~$0.002) |
| Post-exec: local model | $0 | $0 | Report triage, private |
| Full connected loop | ~$0.10-0.50 | ~$100-500 | All phases, mixed models |

</div>

<div style="margin-top: 0.5em; font-size: 0.6em;">
  <strong>The most expensive thing isn't the API call.</strong> It's the human spending 45 minutes triaging.
</div>

Notes:
- Backup: cost comparison. For Q&A on "what does this cost?"
- Local models: $0. Cloud: fractions of a cent per call.
- The real cost of NOT doing this: human time. 45 minutes triaging. Hours fixing broken selectors. Days writing test cases for specs that are incomplete.
- AI doesn't add cost — it shifts cost from human time to compute time. And compute time is cheaper.

---

## Backup: The Trust Ladder

<div style="text-align: left; font-size: 0.75em;">

| Stage | What Happens | When to Use |
|---|---|---|
| 1. **Shadow** | Agent runs alongside existing tests. Results compared but not blocking. | First month. Build confidence. |
| 2. **Advisory** | Agent findings surfaced to humans for review before action. | Month 2-3. Agent is useful but not trusted yet. |
| 3. **Gated** | Agent auto-approves known flows. Unknowns escalated to humans. | Month 3-6. Agent handles routine. Humans handle exceptions. |
| 4. **Autonomous** | Agent runs, decides, reports, and files PRs independently. | 6+ months. Scope expands as confidence grows. |

</div>

<div style="margin-top: 1em; font-size: 0.85em; color: #1A9988;">
  <strong>You don't deploy autonomous testing. You grow into it.</strong>
</div>

Notes:
- Backup: trust ladder. For the inevitable "how do you trust it?" question.
- You don't go from zero to autonomous. You climb a ladder.
- Shadow mode: no risk. Just data. Compare agent results with human results.
- Advisory: agent helps, human decides.
- Gated: agent handles routine, escalates unknowns.
- Autonomous: agent is trusted within defined scope.
- Every team should be at shadow or advisory today.
