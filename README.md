# Agent Architect

**An AI sales-and-scoping tool for designing automation stacks for small businesses — starting with the trades.**

Agent Architect compresses the discovery and architecture work that normally goes into selling a small-business automation engagement (plumbers, electricians, HVAC, dental practices, auto shops, salons, etc.) from weeks into minutes. Type a business type and city, get back a diagnostic of revenue leaks and a six-agent automation stack tailored to that company.

It's designed to be opened on a laptop in a sales meeting and walked through live with the prospect.

---

## 🚀 Live Demo

**[Open the demo →](https://agent-architect-trades.netlify.app)**
*(replace this link after you deploy)*

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR-USERNAME/agent-architect)

---

## What's in this repo

| File | What it is | What you do with it |
|---|---|---|
| `index.html` | Standalone single-file demo app. React via CDN, no build step. | Open in a browser, or deploy to Netlify / GitHub Pages / any static host. |
| `AgentArchitect.jsx` | Standalone React component — a more general agent designer (workflow editor, eval table, tool catalog). | Drop into a React/Vite/Next.js project. Needs `lucide-react` and Tailwind. |
| `docs/IMPLEMENTATION_GUIDE.md` | The full trades-industry playbook: positioning, pricing, the canonical six-agent stack, and the live-API build (system prompts, JSON-extraction code, common failure modes). | Read before you sell this to a client. |
| `docs/Agent_Architect_Guide.docx` | The same guide as a Word doc. | Hand to clients or copy into proposals. |

---

## ⚠️ Honest scope note

**The HTML demo is template-driven, not live-AI-driven.** When you type a business and hit Scan, it generates the diagnostic and agent stack from pre-baked templates keyed off business category — *not* from a real Claude API call. This is intentional: the demo runs anywhere with zero setup, zero API key, zero cost, and produces visually identical output to the live version.

To build the **live API-driven version** (real Claude calls, novel businesses, dynamic output), follow `docs/IMPLEMENTATION_GUIDE.md` §5 — it has the system prompts, the 4-layer JSON extractor, and the known failure modes with fixes. You'll need an Anthropic API key and a thin backend (the API does not allow direct browser calls without exposing your key).

---

## Quick start

### Option 1: Just open it
```bash
git clone https://github.com/YOUR-USERNAME/agent-architect.git
cd agent-architect
open index.html
```

### Option 2: Deploy to Netlify (1 minute)
1. Fork this repo
2. Click the "Deploy to Netlify" button above, OR
3. In Netlify: New site → Import from Git → pick the fork → leave build settings empty → Deploy

`netlify.toml` is included; nothing else to configure.

### Option 3: Deploy to GitHub Pages
Settings → Pages → Source: `main` branch, `/` root → Save. Done.

### Option 4: Use the React component
```bash
npm install lucide-react
```
Drop `AgentArchitect.jsx` into your project. Tailwind classes are used throughout; if you don't have Tailwind, the inline styles still carry most of the layout but the polish will be off.

---

## How it's intended to be used (the actual workflow)

The full sales play is in `docs/IMPLEMENTATION_GUIDE.md`, but the short version:

1. **Discovery call (30 min).** Open the tool live in the meeting. Type the prospect's company. Walk them through the diagnostic as it appears. Ask: *"Is this accurate?"* — they almost always say yes, and add detail.
2. **Proposal.** Use the generated six-agent stack as the spine of the Phase 1 proposal. Typical price: $4–7k flat fee for a trades client.
3. **Build.** The tool does the architecture. A human consultant still owns CRM authentication, Twilio/A2P 10DLC setup, Make.com scenarios, and QA.
4. **Retain.** $500–1,200/month for monitoring and tuning.

---

## Roadmap / known gaps

- **Live API mode** — wire the HTML demo to a real backend that calls Claude. The templates would become fallbacks, not the primary path.
- **More verticals** — the guide lists candidate next markets (law firms, real estate, dental, fitness, restaurants). Each needs its own template pack until live mode ships.
- **Export to proposal** — one-click export of the agent stack into a brand-able PDF / Google Doc.
- **Persistence** — currently nothing saves between sessions; a real version needs at least localStorage, ideally a backend.

PRs welcome. Especially on the live-API backend.

---

## License

MIT — see [LICENSE](./LICENSE). Use it commercially, fork it, white-label it, sell it to your clients. No warranty.

---

## Credits

Built and documented by Andrew. The methodology behind it (multi-disciplinary iterative architecture review) is described separately in the [Iterative Multi-Disciplinary Design Methodology](https://gist.github.com/...) document if you want to apply the same approach to your own systems.
