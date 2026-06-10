# The AI-Augmented Testing Lifecycle

> From Spec to Report — and Everything Between

Companion repository for the _"AI-Augmented Testing Lifecycle"_ workshop. Three live demos covering each phase of the testing lifecycle — design-time spec evaluation, runtime agentic testing, and post-execution report analysis — each using a different model size and AI pattern.

---

## Project Structure

```
.
├── presentation/                  # reveal-md slide deck
│   ├── slides.md                  # Main slide deck (reveal.js markdown)
│   ├── slides-content.md          # Supplementary slide content
│   ├── speaker-notes.md           # Speaker notes and talking points
│   └── demo-script.md             # Step-by-step demo execution guide
├── demo/                          # All demo code
│   ├── package.json               # Dependencies + npm scripts
│   ├── tsconfig.json              # TypeScript config
│   ├── wdio.conf.ts               # WebdriverIO + wdio-agent-service config
│   ├── specs/
│   │   └── password-reset.md      # Demo 1: deliberately incomplete spec
│   ├── scripts/
│   │   ├── evaluate-requirement.ts # Demo 1: spec evaluation via cloud LLM
│   │   └── analyze-report.ts      # Demo 3: report triage via local LLM
│   ├── test/
│   │   └── specs/
│   │       └── demo-agentic.ts    # Demo 2: runtime agentic tests
│   └── reports/
│       └── nightly-report.json    # Demo 3: sample nightly test report
└── .gitattributes                 # Enforce LF line endings
```

---

## Prerequisites

| Tool | Purpose | Required For |
|---|---|---|
| **Node.js ≥ 18** | Runtime | All demos |
| **pnpm** | Package manager | All demos |
| **Chrome / Chromium** | Browser for WebdriverIO | Demo 2 |
| **LM Studio** or **Ollama** | Local LLM hosting | Demos 2, 3 |
| **qwen3.5-4b** model | Element targeting + report triage | Demos 2, 3 |
| **DeepSeek API key** (or Anthropic) | Cloud reasoning for spec eval | Demo 1 |
| **reveal-md** (optional) | Present slides in the browser | Presentation |

### Install reveal-md (for the slide deck)

```bash
npm install -g reveal-md
```

### Set up LM Studio (for Demos 2 & 3)

1. Download [LM Studio](https://lmstudio.ai)
2. Search for and download `qwen3.5-4b` (~3.4 GB)
3. Load the model and start the local server (default: `http://localhost:1234`)
4. **Important:** Disable "Reasoning" in the right sidebar (Reasoning → Off), then reload the model
5. Verify: `curl http://localhost:1234/v1/models`

---

## Setup

```bash
git clone https://github.com/Winify/ai-layers-in-testing.git
cd ai-layers-in-testing/demo
pnpm install
```

---

## Running the Presentation

```bash
# From the repo root
reveal-md presentation/slides.md --watch

# Custom port and theme
reveal-md presentation/slides.md --port 1948 --theme black
```

The slide deck uses reveal.js with markdown. Speaker notes are inline (press `S` in the browser to open the notes window). See `presentation/demo-script.md` for the full demo walkthrough with talking points, expected output, and troubleshooting.

---

## Demo 1: Spec Evaluation (Design-Time)

**Model:** DeepSeek V4 Flash (cloud) — reasoning quality over latency
**Cost:** ~$0.001 per run
**Frequency:** Once per spec change

Feeds a deliberately incomplete password-reset spec to a cloud LLM. The LLM evaluates REQ completeness, generates specification-by-example scenarios, and outputs structured test cases.

```bash
cd demo

# Set your API token (DeepSeek or Anthropic)
export ANTHROPIC_AUTH_TOKEN="sk-your-token-here"

pnpm run demo:spec
```

**What it does:**
1. Reads `demo/specs/password-reset.md` (a 5-line spec with deliberate gaps)
2. Sends it to the LLM with a structured QA architect prompt
3. Returns: missing behaviors, spec-by-example table, test cases, and a summary

**Expected gaps the LLM catches:**
- Non-existent email handling (user enumeration)
- Password reuse policy
- Rate limiting
- Concurrent reset handling
- Ambiguous: "valid for 1 hour" — from send time or first click?

---

## Demo 2: Runtime Agentic Testing (Runtime)

**Model:** qwen3.5-4b (local, ~3.4 GB) via LM Studio
**Cost:** $0 (local)
**Frequency:** Every test execution

WebdriverIO tests that use `wdio-agent-service` for semantic element targeting. Demonstrates single-action, multi-action, and self-healing patterns — all running against [the-internet.herokuapp.com](https://the-internet.herokuapp.com).

```bash
cd demo

# Ensure LM Studio is running with qwen3.5-4b on port 1234
export LLM_PROVIDER_URL="http://localhost:1234"
export LLM_MODEL="qwen/qwen3.5-4b"

pnpm run demo:agentic
```

**The three test patterns:**

| Test | Pattern | What it shows |
|---|---|---|
| 2a | Single-action agentic | Navigate by semantic intent (`"click the Form Authentication link"`) |
| 2b | Hybrid (traditional + agentic) | Agent fills form; traditional assertions verify |
| 2c | Self-healing | Agent adapts when CSS classes change — no test code changes |

**Configuration** (`wdio.conf.ts`):
- `maxActions: 2` — agent plans multi-step actions in one LLM call
- `toonFormat: 'yaml-like'` — DOM snapshot stripped to visible, interactable elements only
- `maxRetries: 2` — agent re-observes and retries on failure

Tests are `it.skip` by default. Remove `.skip` to run them, or run individual tests via mocha's `--grep`:

```bash
pnpm exec wdio run wdio.conf.ts --grep "self-heal"
```

---

## Demo 3: Post-Execution Analysis (Post-Execution)

**Model:** qwen3.5-4b (local, ~3.4 GB) via LM Studio
**Cost:** $0 (local)
**Frequency:** After every nightly test run

Feeds a realistic nightly test report (847 tests, 23 failures) to a local LLM for automated triage. The LLM classifies failures into APP_BUG / TEST_BUG / ENV / FLAKY, groups them by root cause, and generates a Slack-ready summary.

```bash
cd demo

# Ensure LM Studio is running
pnpm run demo:report
```

**What it does:**
1. Reads `demo/reports/nightly-report.json`
2. Sends a digest to the local LLM with a classification prompt
3. Outputs: failure groups by root cause, a 3-sentence Slack summary, and suggested actions with priorities

**Human triage: 30-45 min. LLM: ~2 seconds. Data never leaves your machine.**

---

## Environment Variables

| Variable | Default | Used By |
|---|---|---|
| `ANTHROPIC_AUTH_TOKEN` | — | Demo 1 (DeepSeek/Anthropic API key) |
| `ANTHROPIC_BASE_URL` | `https://api.deepseek.com/anthropic` | Demo 1 (API endpoint) |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | `deepseek-v4-flash` | Demo 1 (model name) |
| `LLM_PROVIDER_URL` | `http://localhost:1234` | Demos 2, 3 (LM Studio endpoint) |
| `LLM_MODEL` | `qwen/qwen3.5-4b` | Demos 2, 3 (local model name) |
| `OPENAI_API_KEY` | `lm-studio-no-auth` | Demo 2 (wdio-agent-service auth) |

---

## Model-to-Phase Map

| Phase | Model | Size | Runs | Task |
|---|---|---|---|---|
| Design-Time | DeepSeek V4 Flash / Claude Haiku | Cloud | Infrequent | Spec analysis, test design |
| Runtime | qwen3.5-4b | 3.4 GB local | Every test run | Element targeting, self-healing |
| Post-Execution | qwen3.5-4b | 3.4 GB local | Per report | Failure classification, triage |

Pattern: **small + local for frequent tasks, cloud for infrequent reasoning.**

---

## Troubleshooting

**Demo 1 — API errors:**
- Verify `ANTHROPIC_AUTH_TOKEN` is set and valid
- Check network access to `api.deepseek.com`
- Have a screenshot fallback ready (see `presentation/demo-script.md`)

**Demo 2 — Agent times out or selects wrong element:**
- Ensure LM Studio is running and qwen3.5-4b is loaded
- Verify at `http://localhost:1234/v1/models`
- Confirm "Reasoning" is disabled in LM Studio (right sidebar → Reasoning → Off)
- Add more detail to prompts: `"click the blue 'Sign In' button"` beats `"click login"`

**Demo 3 — LLM returns non-JSON:**
- The script includes a JSON salvage path for truncated output
- Ensure "Reasoning" is disabled (same as Demo 2)
- For critical reports, consider a 7B+ model

**LM Studio model not responding:**
- Check the model is fully loaded (progress bar complete in LM Studio)
- Restart the local server (toggle off/on in LM Studio)
- Ensure port 1234 isn't in use: `lsof -i :1234`
