**AGENT ARCHITECT**

Build an AI System That Designs AI Systems

A Complete Implementation Guide for the Trades Industry

Prepared for Cowork Deployment

# **1. The Opportunity**

The most promising new career path in AI is not building models. It is deploying them for businesses that do not know how. Every small company has the same problem: they are run by experts in their craft who are amateurs at operations. A plumbing company owner is a world-class plumber and a part-time office manager, scheduler, estimator, follow-up caller, and accounts receivable department. Every one of those roles is automatable today.

The businesses that need this most are trades companies: plumbers, electricians, HVAC contractors, roofers, landscapers, and general contractors. Here is why they are the ideal first market:

**Repeatable. **They are homogeneous. A plumbing company in Texas has nearly identical problems to one in Ohio. Build the stack once, redeploy it with minor customization for every client.

**Underserved by tech. **They are underserved. Enterprise software exists for Fortune 500 companies. There is almost nothing built specifically for a 4-person HVAC crew.

**The math is undeniable. **The ROI is obvious and immediate. A $1.5M HVAC company leaks $150-300k per year in missed leads, dead estimates, and slow invoices. Fixing that with a $5,000 automation stack is a 30-60x return.

**You have credibility. **They trust people who have worked the trade. If you have industry background, you are not selling to strangers. You are solving problems you have lived.

# **2. What We Are Building**

The Agent Architect is a two-phase AI system. Its job is to eliminate the weeks of discovery and architecture work that normally goes into designing an automation stack for a client. It compresses that work into minutes.

## **Phase 1: The Research Agent**

The research agent accepts a company name, type, or description as input. It analyzes the business and produces a structured diagnostic report covering:

Five core operational problems specific to their business type

Three revenue leaks with approximate dollar estimates

Their likely current toolset

Estimated team size

An urgency score (1-10) and the single highest-impact automation opportunity

## **Phase 2: The Builder Agent**

The builder agent receives the diagnostic and designs a stack of six specialized sub-agents tailored to that company. Each agent specification includes:

A name and clear one-sentence role

The specific trigger that activates it

The tools it requires (SMS, CRM, Calendar, QuickBooks, etc.)

The measurable business impact it delivers

An estimated build time in hours

A priority ranking (1 = most critical)

A sample behavior description or message it would send

| **Why six agents?** Six is the right number for a trades company first engagement. It covers every major revenue leak without overwhelming the client or making the project feel unmanageable. A typical stack takes 20-35 hours to build and deploy, fits in a $4,000-7,000 engagement, and delivers visible ROI within the first 30 days. |
| --- |

# **3. The Standard Trades Agent Stack**

Through research and pattern analysis, the same six agent categories appear in almost every trades business engagement. These are the universal pain points. The Agent Architect will generate variations of these based on the specific company input, but understanding the canonical stack gives you the foundation to evaluate and refine the output.

| **P1 — MISSED CALL RECOVERY AGENT** |
| --- |

| **TRIGGER** | Trigger: An inbound call goes unanswered or to voicemail. |
| --- | --- |
| **BEHAVIOR** | When a potential customer calls and nobody picks up, this agent immediately sends an SMS: "Hey, this is [Company]. Sorry we missed you — we're on a job. What can we help you with?" It captures the lead before they call a competitor. Studies show 85% of callers who get voicemail do not call back. |
| **IMPACT** | **~$40,000/year in recovered leads for a 4-tech company.** |

| **P2 — ESTIMATE FOLLOW-UP AGENT** |
| --- |

| **TRIGGER** | Trigger: An estimate has been sent and not responded to in 48 hours. |
| --- | --- |
| **BEHAVIOR** | Most trades companies send estimates and wait. This agent sends a follow-up sequence: a friendly SMS at 48 hours, a second touch at 5 days, and a final call-to-action at 10 days. It stops automatically when the estimate is accepted or declined. Close rates on estimates typically improve 20-35%. |
| **IMPACT** | **~$60,000/year in recovered estimate revenue.** |

| **P3 — JOB COMPLETION ****&**** REVIEW AGENT** |
| --- |

| **TRIGGER** | Trigger: A job is marked complete in the CRM or field software. |
| --- | --- |
| **BEHAVIOR** | 24 hours after a job closes, this agent sends the customer a thank-you message and a direct link to leave a Google review. It only sends to customers who rated the experience positively in a one-question satisfaction check. Google reviews are the primary driver of new inbound calls for local trades businesses. |
| **IMPACT** | **3-5x increase in review velocity, compounding lead generation over time.** |

| **P4 — SCHEDULING ****&**** DISPATCH OPTIMIZER AGENT** |
| --- |

| **TRIGGER** | Trigger: A new job is booked or an existing job is rescheduled. |
| --- | --- |
| **BEHAVIOR** | This agent maintains the dispatch board, sends customers automated confirmation and reminder messages (24hr and 2hr before), and notifies the tech. It also handles the awkward task of rescheduling — sending apology messages and rebooking confirmations automatically when jobs run long. |
| **IMPACT** | **Eliminates 2-3 hours of daily admin per dispatcher, reduces no-shows by ~40%.** |

| **P5 — INVOICE ****&**** COLLECTIONS AGENT** |
| --- |

| **TRIGGER** | Trigger: An invoice is sent and not paid within the agreed terms. |
| --- | --- |
| **BEHAVIOR** | This agent sends a polite payment reminder at the due date, a firmer reminder at 7 days past due, and escalates to a phone call request at 14 days. It integrates with QuickBooks or Stripe to mark invoices paid automatically when payment is received and stops all follow-up. |
| **IMPACT** | **Average accounts receivable aging reduced from 42 days to 18 days.** |

| **P6 — INBOUND LEAD QUALIFIER AGENT** |
| --- |

| **TRIGGER** | Trigger: A new form submission, web chat, or text arrives from a potential customer. |
| --- | --- |
| **BEHAVIOR** | When someone fills out the contact form or texts the business number, this agent responds immediately with a short qualification sequence: What type of work do you need? What city are you in? When are you looking to get this done? It pre-qualifies the lead and books a callback or sends a booking link based on the answers. |
| **IMPACT** | **Reduces time-to-contact from hours to under 2 minutes, increasing close rate on web leads.** |

# **4. System Architecture**

The Agent Architect itself is built on the Claude API with a React front-end. Here is how the full system is structured.

## **Front-End**

A React single-page application hosted as an artifact or deployed standalone. It provides:

A text input for the company name or description

A real-time terminal log showing each phase of analysis

An expandable card interface for each generated agent

A diagnostic panel summarizing the business analysis

A build summary with total estimated hours

## **API Layer**

Two sequential calls to the Claude API (claude-sonnet-4-20250514).

### **Call 1: Research Agent**

Model receives a system prompt defining its role as a trades business analyst. User message is the company input. Returns a raw JSON object with the diagnostic structure. Web search is disabled to keep the response clean and parseable.

### **Call 2: Builder Agent**

Model receives a system prompt defining its role as an agent architect. User message is the JSON diagnostic from Call 1. Returns a raw JSON array of six agent specifications.

| **Critical implementation note on JSON parsing:** Both API calls must use explicit system prompts that instruct the model to return ONLY raw JSON with no markdown fences, no preamble, and no explanation. The extractor function should have four fallback layers: (1) direct JSON.parse, (2) strip fences and retry, (3) find outermost brackets and slice, (4) fix trailing commas and retry. This handles the edge cases that cause 'Invalid response format' errors. |
| --- |

## **Deployment Tools**

| **Tool** | **Role** |
| --- | --- |
| Claude API | Primary intelligence layer. Both research and builder agents run here. |
| React / JSX | Front-end artifact. Single file, no external dependencies beyond Tailwind or inline styles. |
| Make.com | Automation layer for deploying the actual agents designed by the system. Connects to Twilio, CRMs, QuickBooks, Google Reviews. |
| Twilio | SMS and voice for the Missed Call Recovery and Follow-Up agents. |
| QuickBooks / Stripe | Payment integration for the Invoice and Collections agent. |
| Google Business API | Review link generation for the Job Completion agent. |
| ServiceTitan / Jobber | Most trades companies use one of these. CRM integration is the backbone of trigger-based agents. |

# **5. Implementation Guide**

## **Step 1: Build the Research Agent Prompt**

The system prompt for the research call must be unambiguous about output format. Use concatenated strings to avoid quote escaping issues in JSX. The prompt should state:

"You are a trades business analyst. Your entire response must be a single raw JSON object."

"Do not include any text, explanation, or markdown before or after the JSON."

"Required shape: {"companyType":"string","coreProblems":["p1","p2","p3","p4","p5"],"

"revenueLeaks":["~$X from r1","~$X from r2","~$X from r3"],"currentTools":["t1","t2"],"

"teamSize":"2-8 employees","urgencyScore":8,"topOpportunity":"string"}"

## **Step 2: Build the Builder Agent Prompt**

The builder prompt follows the same pattern and specifies the exact tool names the agents may use. Constraining the tool list prevents hallucinated tool names that would be unusable in Make.com workflows:

"You are an AI agent architect for trades businesses."

"Your entire response must be a single raw JSON array with no text before or after it."

"Each element must have: name, role, trigger, tools (from: SMS, Email, CRM, Calendar,"

"Maps/GPS, Stripe, QuickBooks, Forms, Twilio, Slack, Google Reviews, Make.com, Gmail),"

"impact, buildTime (e.g. 4 hours), priority (integer 1-5), script."

"Design exactly 6 agents."

## **Step 3: Build the JSON Extractor**

This is the most important reliability function in the system. The extractor must handle every way the model might wrap or format its response:

function extractJSON(data) {

  const raw = data.content.filter(b => b.type === 'text').map(b => b.text).join('');

  const cleaned = raw.replace(/```json\s*/gi,'').replace(/```\s*/g,'').trim();

  try { return JSON.parse(cleaned); } catch {}

  const o = cleaned.indexOf('{'), a = cleaned.indexOf('[');

  const isArr = a !== -1 && (o === -1 || a < o);

  const start = isArr ? a : o;

  const end = isArr ? cleaned.lastIndexOf(']') : cleaned.lastIndexOf('}');

  const slice = cleaned.slice(start, end + 1);

  try { return JSON.parse(slice); } catch {}

  return JSON.parse(slice.replace(/,(\s*[}\]])/g, '$1'));

}

## **Step 4: Avoid Inline Complex CSS in JSX**

A known issue with the artifact renderer is that complex inline style values — particularly CSS functions containing commas like linear-gradient() — can cause Babel parse errors. The fix is to extract all CSS to a string constant injected via a <style> tag rather than written inline in JSX props.

// WRONG — will cause parse error in artifact renderer:

style={{ backgroundImage: 'linear-gradient(#111 1px, transparent 1px)' }}

// CORRECT — inject CSS as a string constant:

const CSS = `

  .my-class { background-image: linear-gradient(#111 1px, transparent 1px); }

`;

return <div><style>{CSS}</style><div className='my-class'>...</div></div>

## **Step 5: Disable Web Search on API Calls**

The Claude API web search tool causes the response to contain multiple content block types (text, tool_use, tool_result). This makes the response harder to parse and increases the chance of the extractor failing. For structured JSON output, do not pass the web_search tool. The model has sufficient training data to diagnose common trades business types without live search.

# **6. Client Engagement Model**

The Agent Architect is a sales and scoping tool as much as it is a technical system. Here is how to use it in a client engagement.

## **Discovery Meeting (30 minutes)**

Open your laptop and run the Agent Architect live in the meeting. Type the client's company name and hit Scan. Walk them through the diagnostic as it appears. Ask them: 'Is this accurate? Does this reflect how your business actually operates?' Almost always they will say yes, and often add more detail. This positions you as someone who already understands their business before the engagement even starts.

## **The Proposal**

Use the generated agent stack as the basis for your proposal. Present it as the 'Phase 1 Automation Stack' — six agents addressing their six highest-priority pain points. Include the estimated build hours from the tool and price accordingly. A typical Phase 1 engagement for a trades company runs $4,000 to $7,000 depending on CRM complexity and the number of tool integrations required.

## **Pricing Framework**

| **Engagement** | **Pricing Range** |
| --- | --- |
| Discovery + Agent Architect scan | Free / part of your sales process |
| Phase 1 build (6 agents, 20-35 hrs) | $4,000 - $7,000 flat fee |
| Monthly management + monitoring | $500 - $1,200/month retainer |
| Phase 2 expansion (3-4 more agents) | $2,500 - $4,000 |
| White-label resale to other consultants | License the stack + training, $2,000-5,000 |

## **What Requires Human Judgment (Your Value Add)**

The Agent Architect handles research and design automatically. The following elements still require a skilled human consultant and represent your core value to the client:

CRM access and authentication setup (ServiceTitan, Jobber, Housecall Pro API keys)

Twilio number provisioning and SMS compliance (A2P 10DLC registration)

Make.com scenario architecture and webhook configuration

Client-specific message tone and brand voice tuning

Testing, QA, and edge case handling (what happens when a job is cancelled mid-follow-up?)

Ongoing monitoring and performance reporting

# **7. Expanding Beyond Trades**

The Agent Architect framework is industry-agnostic. Once the trades stack is proven, the same system can be repurposed for any small business vertical with homogeneous operational problems. The following industries are strong second targets.

| **Industry** | **Primary Automation Opportunities** |
| --- | --- |
| Small law firms | Client intake, document automation, billing follow-up, deadline reminders |
| Independent insurance agents | Quote follow-up, renewal reminders, cross-sell sequences, claims notifications |
| Real estate teams | Lead response, showing scheduling, offer follow-up, post-close review requests |
| Medical / dental practices | Appointment reminders, no-show recovery, insurance verification, review generation |
| Restaurants / catering | Reservation confirmation, event inquiry qualification, post-visit review requests |
| Gyms / personal trainers | Trial conversion, attendance drop-off recovery, membership renewal sequences |

For each new vertical, the process is: run the Agent Architect on a representative company in that space, review the output, build and test the stack with one real client, then systematize and sell it as a packaged product to that industry.

# **8. Quick Reference**

## **Agent Architect System Prompts**

| **RESEARCH AGENT — SYSTEM PROMPT** |
| --- |

"You are a trades business analyst."

"Your entire response must be a single raw JSON object."

"No text, explanation, or markdown before or after the JSON."

"Required shape (urgencyScore = integer 1-10, revenueLeaks include $ estimates):"

{"companyType":"string","coreProblems":["p1","p2","p3","p4","p5"],

 "revenueLeaks":["~$X from r1","~$X from r2","~$X from r3"],

 "currentTools":["t1","t2","t3"],"teamSize":"2-8 employees",

 "urgencyScore":8,"topOpportunity":"string"}

| **BUILDER AGENT — SYSTEM PROMPT** |
| --- |

"You are an AI agent architect for trades businesses."

"Your entire response must be a single raw JSON array."

"No text, explanation, or markdown before or after the JSON."

"Design exactly 6 agents. Each element:"

{"name":"string","role":"string","trigger":"string",

 "tools":["SMS","Email","CRM","Calendar","Maps/GPS","Stripe",

          "QuickBooks","Forms","Twilio","Slack","Google Reviews",

          "Make.com","Gmail"],

 "impact":"string","buildTime":"4 hours","priority":1,

 "script":"2-3 sentence example behavior"}

"priority = integer 1-5 where 1 = most critical."

"tools values must only come from the provided list."

## **Common Failure Points and Fixes**

| **Failure** | **Fix** |
| --- | --- |
| Invalid response format / JSON parse error | Model returned JSON wrapped in markdown fences. Use the 4-layer extractJSON function. Ensure system prompt says 'no markdown fences' explicitly. |
| Unexpected token error in artifact | Complex CSS values with commas (like linear-gradient) placed inline in JSX style props. Move all CSS to a string constant injected via <style> tag. |
| Empty or partial agent stack | Builder prompt was ambiguous. Add 'Design exactly 6 agents' and constrain the tools list explicitly. Increase max_tokens if responses are being cut off. |
| Web search breaking JSON extraction | When web search is enabled, the API returns mixed content blocks. Disable web search for both API calls. The model has enough training data for common trades business types. |
| Agent tools contain made-up tool names | Without a constrained tools list, the model will invent tools. Provide an explicit allowed list in the system prompt and instruct it to only use values from that list. |

Agent Architect — Trades Industry Implementation Guide