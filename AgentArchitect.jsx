import { useState, useRef } from "react";
import {
  Bot, Plus, Trash2, ChevronRight, ChevronDown, GripVertical,
  Zap, MessageSquare, Wrench, FlaskConical, LayoutDashboard,
  Play, CheckCircle2, XCircle, Clock, Copy, Download,
  ToggleLeft, ToggleRight, Search, Settings, Sparkles,
  ArrowRight, AlertCircle, Code2, Globe, Database, FileText,
  Terminal, Send, RotateCcw, Layers, PenLine, ListChecks,
  ChevronUp, Cpu, Star, Edit3, Save, X
} from "lucide-react";

// ─── Seed Data ────────────────────────────────────────────────────────────────
const defaultSystemPrompt = `You are a helpful AI assistant. You are knowledgeable, concise, and always strive to give accurate and useful responses.

When answering questions:
- Be clear and direct
- Cite sources when relevant
- Ask for clarification if the request is ambiguous
- Admit uncertainty rather than guessing`;

const MODELS = ["claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5", "gpt-4o", "gpt-4o-mini", "gemini-1.5-pro"];

const STEP_TYPES = [
  { id: "trigger",  label: "Trigger",   color: "#6366f1", icon: Zap },
  { id: "action",   label: "Action",    color: "#0ea5e9", icon: Play },
  { id: "decision", label: "Decision",  color: "#f59e0b", icon: AlertCircle },
  { id: "tool",     label: "Tool Call", color: "#10b981", icon: Wrench },
  { id: "output",   label: "Output",    color: "#8b5cf6", icon: Send },
];

const TOOL_CATALOG = [
  { id: "web_search",     name: "Web Search",       category: "Web",   icon: Globe,    desc: "Search the web for current information", auth: "API Key" },
  { id: "web_fetch",      name: "Web Fetch",         category: "Web",   icon: Globe,    desc: "Fetch and read content from URLs", auth: "None" },
  { id: "code_exec",      name: "Code Execution",    category: "Code",  icon: Terminal, desc: "Run Python/JS code in a sandbox", auth: "None" },
  { id: "file_read",      name: "File Read",         category: "Files", icon: FileText, desc: "Read files from the workspace", auth: "None" },
  { id: "file_write",     name: "File Write",        category: "Files", icon: FileText, desc: "Write files to the workspace", auth: "None" },
  { id: "db_query",       name: "Database Query",    category: "Data",  icon: Database, desc: "Query SQL databases", auth: "Connection String" },
  { id: "slack_send",     name: "Slack Message",     category: "Comms", icon: MessageSquare, desc: "Send messages to Slack channels", auth: "OAuth" },
  { id: "github_pr",      name: "GitHub PR",         category: "Code",  icon: Code2,    desc: "Create and manage pull requests", auth: "OAuth" },
  { id: "custom_api",     name: "Custom API",        category: "Custom",icon: Settings, desc: "Call any REST API endpoint", auth: "Custom" },
];

const mkId = () => Math.random().toString(36).slice(2, 9);

const mkAgent = (name = "New Agent") => ({
  id: mkId(),
  name,
  model: "claude-sonnet-4-6",
  description: "An AI agent for your workflow",
  systemPrompt: defaultSystemPrompt,
  workflow: [
    { id: mkId(), type: "trigger",  label: "User Message",     desc: "Receive input from the user", tool: null },
    { id: mkId(), type: "action",   label: "Process Request",  desc: "Analyze and understand the user intent", tool: null },
    { id: mkId(), type: "tool",     label: "Web Search",       desc: "Search for relevant information", tool: "web_search" },
    { id: mkId(), type: "output",   label: "Respond to User",  desc: "Return the final answer", tool: null },
  ],
  tools: ["web_search", "web_fetch"],
  evals: [
    { id: mkId(), input: "What is the capital of France?", expected: "Paris", result: "Paris is the capital of France.", status: "pass", score: 100 },
    { id: mkId(), input: "Summarize the latest AI news", expected: "A concise summary of recent AI developments", result: "", status: "pending", score: null },
  ],
});

// ─── Small helpers ────────────────────────────────────────────────────────────
const Badge = ({ color, children }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44` }}
    className="text-xs font-medium px-2 py-0.5 rounded-full">{children}</span>
);

const statusIcon = (s) => ({
  pass:    <CheckCircle2 size={14} className="text-emerald-400" />,
  fail:    <XCircle size={14} className="text-red-400" />,
  pending: <Clock size={14} className="text-amber-400" />,
}[s] ?? null);

const statusColor = (s) => ({ pass: "#10b981", fail: "#ef4444", pending: "#f59e0b" }[s] ?? "#64748b");

// ─── Sections ─────────────────────────────────────────────────────────────────

function OverviewSection({ agent, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: agent.name, description: agent.description, model: agent.model });

  const save = () => { onUpdate(draft); setEditing(false); };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            <Bot size={24} className="text-white" />
          </div>
          <div>
            {editing ? (
              <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                className="text-xl font-semibold bg-transparent border-b border-indigo-400 outline-none text-white" />
            ) : (
              <h2 className="text-xl font-semibold text-white">{agent.name}</h2>
            )}
            <p className="text-sm text-slate-400 mt-0.5">Agent ID: {agent.id}</p>
          </div>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={save} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm text-white transition-colors">
              <Save size={14} /> Save
            </button>
            <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors">
              <X size={14} /> Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
            <Edit3 size={14} /> Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Workflow Steps", value: agent.workflow.length, icon: Layers, color: "#6366f1" },
          { label: "Tools Enabled",  value: agent.tools.length,    icon: Wrench, color: "#10b981" },
          { label: "Eval Tests",     value: agent.evals.length,    icon: FlaskConical, color: "#f59e0b" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={16} style={{ color }} />
              <span className="text-xs text-slate-400">{label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Configuration</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Description</label>
            {editing ? (
              <textarea value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
                rows={2} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 resize-none" />
            ) : (
              <p className="text-sm text-slate-300">{agent.description}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Model</label>
            {editing ? (
              <select value={draft.model} onChange={e => setDraft(d => ({ ...d, model: e.target.value }))}
                className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500">
                {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            ) : (
              <Badge color="#6366f1">{agent.model}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Eval summary */}
      {agent.evals.length > 0 && (() => {
        const passed = agent.evals.filter(e => e.status === "pass").length;
        const pct = Math.round((passed / agent.evals.filter(e => e.status !== "pending").length || 0) * 100) || 0;
        return (
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Eval Health</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-700 rounded-full h-2">
                <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-sm font-semibold text-emerald-400">{pct}%</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">{passed} of {agent.evals.filter(e => e.status !== "pending").length} tests passing</p>
          </div>
        );
      })()}
    </div>
  );
}

function PromptSection({ agent, onUpdate }) {
  const [prompt, setPrompt] = useState(agent.systemPrompt);
  const [saved, setSaved] = useState(true);
  const TEMPLATES = [
    { name: "Assistant",   icon: "💬", prompt: `You are a helpful AI assistant. Be clear, concise, and honest. Ask for clarification when needed.` },
    { name: "Analyst",     icon: "📊", prompt: `You are a data analyst AI. Focus on extracting insights from data, identifying trends, and providing evidence-based recommendations.` },
    { name: "Developer",   icon: "💻", prompt: `You are an expert software developer. Write clean, well-documented code. Prefer simplicity over complexity. Always explain your reasoning.` },
    { name: "Researcher",  icon: "🔬", prompt: `You are a rigorous research assistant. Cite sources, acknowledge uncertainty, and present multiple perspectives before drawing conclusions.` },
  ];

  const apply = (t) => { setPrompt(t.prompt); setSaved(false); };
  const save  = () => { onUpdate({ systemPrompt: prompt }); setSaved(true); };

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">System Prompt</h2>
          <p className="text-sm text-slate-400">Define how your agent thinks and behaves</p>
        </div>
        <button onClick={save}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${saved ? "bg-slate-800 text-slate-500 cursor-default" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`}>
          <Save size={14} /> {saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Quick Templates</p>
        <div className="flex gap-2 flex-wrap">
          {TEMPLATES.map(t => (
            <button key={t.name} onClick={() => apply(t)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 rounded-lg text-sm text-slate-300 transition-all">
              <span>{t.icon}</span> {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <textarea
          value={prompt}
          onChange={e => { setPrompt(e.target.value); setSaved(false); }}
          rows={18}
          className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-4 text-sm text-slate-200 font-mono outline-none resize-none leading-relaxed transition-colors"
          placeholder="Enter your system prompt here..."
        />
        <div className="absolute bottom-3 right-4 text-xs text-slate-600">{prompt.length} chars</div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">💡 Prompt Tips</p>
        <ul className="space-y-1">
          {["Use XML tags to structure multi-part instructions", "Specify output format explicitly (JSON, markdown, etc.)", "Include examples for complex tasks", "Define edge case behavior up front"].map(tip => (
            <li key={tip} className="flex items-start gap-2 text-xs text-slate-400">
              <Sparkles size={11} className="mt-0.5 text-indigo-400 shrink-0" />{tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function WorkflowSection({ agent, onUpdate }) {
  const [steps, setSteps]     = useState(agent.workflow);
  const [editing, setEditing] = useState(null); // step id

  const addStep = () => {
    const ns = { id: mkId(), type: "action", label: "New Step", desc: "", tool: null };
    const upd = [...steps, ns];
    setSteps(upd); onUpdate({ workflow: upd }); setEditing(ns.id);
  };

  const delStep = (id) => {
    const upd = steps.filter(s => s.id !== id);
    setSteps(upd); onUpdate({ workflow: upd });
  };

  const updateStep = (id, patch) => {
    const upd = steps.map(s => s.id === id ? { ...s, ...patch } : s);
    setSteps(upd); onUpdate({ workflow: upd });
  };

  const moveStep = (id, dir) => {
    const i = steps.findIndex(s => s.id === id);
    if (i + dir < 0 || i + dir >= steps.length) return;
    const upd = [...steps];
    [upd[i], upd[i + dir]] = [upd[i + dir], upd[i]];
    setSteps(upd); onUpdate({ workflow: upd });
  };

  return (
    <div className="p-6 space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Workflow Builder</h2>
          <p className="text-sm text-slate-400">Define the step-by-step flow of your agent</p>
        </div>
        <button onClick={addStep}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm text-white transition-colors">
          <Plus size={14} /> Add Step
        </button>
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => {
          const typeInfo = STEP_TYPES.find(t => t.id === step.type) ?? STEP_TYPES[1];
          const Icon = typeInfo.icon;
          const isEditing = editing === step.id;
          return (
            <div key={step.id}>
              <div className={`bg-slate-800 border rounded-xl p-4 transition-all ${isEditing ? "border-indigo-500" : "border-slate-700 hover:border-slate-600"}`}>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 mt-0.5">
                    <button onClick={() => moveStep(step.id, -1)} disabled={i === 0}
                      className="text-slate-600 hover:text-slate-400 disabled:opacity-20 transition-colors">
                      <ChevronUp size={14} />
                    </button>
                    <button onClick={() => moveStep(step.id, 1)} disabled={i === steps.length - 1}
                      className="text-slate-600 hover:text-slate-400 disabled:opacity-20 transition-colors">
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: typeInfo.color + "22", border: `1px solid ${typeInfo.color}44` }}>
                    <Icon size={16} style={{ color: typeInfo.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input value={step.label} onChange={e => updateStep(step.id, { label: e.target.value })}
                            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-indigo-500" />
                          <select value={step.type} onChange={e => updateStep(step.id, { type: e.target.value })}
                            className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-slate-300 outline-none">
                            {STEP_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                          </select>
                        </div>
                        <input value={step.desc} onChange={e => updateStep(step.id, { desc: e.target.value })}
                          placeholder="Step description…"
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-400 outline-none focus:border-indigo-500" />
                        {step.type === "tool" && (
                          <select value={step.tool ?? ""} onChange={e => updateStep(step.id, { tool: e.target.value || null })}
                            className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-slate-300 outline-none">
                            <option value="">Select tool…</option>
                            {TOOL_CATALOG.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                          </select>
                        )}
                        <button onClick={() => setEditing(null)}
                          className="text-xs text-indigo-400 hover:text-indigo-300">Done editing</button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{step.label}</span>
                            <Badge color={typeInfo.color}>{typeInfo.label}</Badge>
                          </div>
                          {step.desc && <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>}
                          {step.tool && <p className="text-xs text-emerald-500 mt-0.5">🔧 {TOOL_CATALOG.find(t => t.id === step.tool)?.name}</p>}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button onClick={() => setEditing(step.id)}
                            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-300 transition-colors">
                            <Edit3 size={13} />
                          </button>
                          <button onClick={() => delStep(step.id)}
                            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-red-400 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center my-1">
                  <ArrowRight size={14} className="rotate-90 text-slate-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ToolsSection({ agent, onUpdate }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...new Set(TOOL_CATALOG.map(t => t.category))];

  const toggle = (id) => {
    const tools = agent.tools.includes(id)
      ? agent.tools.filter(t => t !== id)
      : [...agent.tools, id];
    onUpdate({ tools });
  };

  const filtered = TOOL_CATALOG
    .filter(t => activeCategory === "All" || t.category === activeCategory)
    .filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-white">Tools & MCP Configuration</h2>
        <p className="text-sm text-slate-400">Select the tools your agent can use during execution</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools…"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
        </div>
        <div className="flex gap-1.5">
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeCategory === c ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map(tool => {
          const Icon = tool.icon;
          const enabled = agent.tools.includes(tool.id);
          return (
            <div key={tool.id}
              className={`bg-slate-800 border rounded-xl p-4 cursor-pointer transition-all ${enabled ? "border-indigo-500 bg-indigo-950/30" : "border-slate-700 hover:border-slate-600"}`}
              onClick={() => toggle(tool.id)}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${enabled ? "bg-indigo-500/20" : "bg-slate-700"}`}>
                    <Icon size={15} className={enabled ? "text-indigo-400" : "text-slate-400"} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{tool.name}</p>
                    <p className="text-xs text-slate-500">{tool.category}</p>
                  </div>
                </div>
                <div className={`w-8 h-5 rounded-full flex items-center transition-all ${enabled ? "bg-indigo-600" : "bg-slate-700"}`}>
                  <div className={`w-3 h-3 rounded-full bg-white shadow transition-transform mx-0.5 ${enabled ? "translate-x-3.5" : "translate-x-0"}`} />
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{tool.desc}</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-xs text-slate-600">Auth:</span>
                <span className="text-xs text-slate-500">{tool.auth}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">{agent.tools.length} tools enabled</p>
          <p className="text-xs text-slate-500">out of {TOOL_CATALOG.length} available</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onUpdate({ tools: [] })} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Clear all</button>
          <span className="text-slate-700">|</span>
          <button onClick={() => onUpdate({ tools: TOOL_CATALOG.map(t => t.id) })} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Enable all</button>
        </div>
      </div>
    </div>
  );
}

function EvalsSection({ agent, onUpdate }) {
  const [evals, setEvals] = useState(agent.evals);
  const [running, setRunning] = useState(false);
  const [newRow, setNewRow] = useState({ input: "", expected: "" });

  const addEval = () => {
    if (!newRow.input.trim()) return;
    const upd = [...evals, { id: mkId(), ...newRow, result: "", status: "pending", score: null }];
    setEvals(upd); onUpdate({ evals: upd });
    setNewRow({ input: "", expected: "" });
  };

  const delEval = (id) => {
    const upd = evals.filter(e => e.id !== id);
    setEvals(upd); onUpdate({ evals: upd });
  };

  const runAll = () => {
    setRunning(true);
    setTimeout(() => {
      const upd = evals.map(e => e.status === "pending"
        ? { ...e, result: `[Simulated] ${e.expected || "Response generated."}`, status: "pass", score: Math.floor(Math.random() * 30) + 70 }
        : e);
      setEvals(upd); onUpdate({ evals: upd }); setRunning(false);
    }, 1800);
  };

  const passCount    = evals.filter(e => e.status === "pass").length;
  const failCount    = evals.filter(e => e.status === "fail").length;
  const pendingCount = evals.filter(e => e.status === "pending").length;
  const avgScore     = evals.filter(e => e.score !== null).length
    ? Math.round(evals.filter(e => e.score !== null).reduce((a, e) => a + e.score, 0) / evals.filter(e => e.score !== null).length)
    : null;

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Eval Tracker</h2>
          <p className="text-sm text-slate-400">Test your agent against expected behaviors</p>
        </div>
        <button onClick={runAll} disabled={running || pendingCount === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm text-white font-medium transition-all">
          {running ? <><RotateCcw size={14} className="animate-spin" /> Running…</> : <><Play size={14} /> Run Pending</>}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Passing",  value: passCount,    color: "#10b981" },
          { label: "Failing",  value: failCount,    color: "#ef4444" },
          { label: "Pending",  value: pendingCount, color: "#f59e0b" },
          { label: "Avg Score", value: avgScore !== null ? `${avgScore}%` : "—", color: "#6366f1" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Input</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Expected</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Result</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {evals.map((ev, i) => (
              <tr key={ev.id} className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${i % 2 === 0 ? "" : "bg-slate-800/50"}`}>
                <td className="px-4 py-3 text-slate-300 max-w-[180px] truncate" title={ev.input}>{ev.input}</td>
                <td className="px-4 py-3 text-slate-400 max-w-[160px] truncate" title={ev.expected}>{ev.expected || "—"}</td>
                <td className="px-4 py-3 text-slate-400 max-w-[180px] truncate" title={ev.result}>{ev.result || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    {statusIcon(ev.status)}
                    <span className="text-xs capitalize" style={{ color: statusColor(ev.status) }}>{ev.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  {ev.score !== null ? (
                    <span className={`text-xs font-semibold ${ev.score >= 80 ? "text-emerald-400" : ev.score >= 60 ? "text-amber-400" : "text-red-400"}`}>{ev.score}%</span>
                  ) : <span className="text-slate-600">—</span>}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => delEval(ev.id)} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {evals.length === 0 && (
          <div className="py-12 text-center text-slate-600">No eval cases yet. Add one below.</div>
        )}
      </div>

      {/* Add row */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-end gap-3">
        <div className="flex-1">
          <label className="text-xs text-slate-500 mb-1 block">Input</label>
          <input value={newRow.input} onChange={e => setNewRow(r => ({ ...r, input: e.target.value }))}
            placeholder="User message or test input…"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
        </div>
        <div className="flex-1">
          <label className="text-xs text-slate-500 mb-1 block">Expected Output</label>
          <input value={newRow.expected} onChange={e => setNewRow(r => ({ ...r, expected: e.target.value }))}
            placeholder="What should the agent respond?…"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
        </div>
        <button onClick={addEval}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm text-white shrink-0 transition-colors">
          <Plus size={14} /> Add Test
        </button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",  label: "Overview",  icon: LayoutDashboard },
  { id: "prompt",    label: "Prompt",    icon: PenLine },
  { id: "workflow",  label: "Workflow",  icon: Layers },
  { id: "tools",     label: "Tools",     icon: Wrench },
  { id: "evals",     label: "Evals",     icon: FlaskConical },
];

export default function AgentArchitect() {
  const [agents, setAgents]         = useState([mkAgent("Customer Support Agent"), mkAgent("Research Assistant")]);
  const [activeId, setActiveId]     = useState(agents[0].id);
  const [activeTab, setActiveTab]   = useState("overview");
  const [sidebarOpen, setSidebar]   = useState(true);

  const agent = agents.find(a => a.id === activeId);

  const createAgent = () => {
    const a = mkAgent("Untitled Agent");
    setAgents(prev => [...prev, a]);
    setActiveId(a.id);
    setActiveTab("overview");
  };

  const deleteAgent = (id) => {
    if (agents.length === 1) return;
    const remaining = agents.filter(a => a.id !== id);
    setAgents(remaining);
    if (activeId === id) setActiveId(remaining[0].id);
  };

  const updateAgent = (patch) => {
    setAgents(prev => prev.map(a => a.id === activeId ? { ...a, ...patch } : a));
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-60" : "w-0 overflow-hidden"} shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-200`}>
        {/* Logo */}
        <div className="px-4 py-4 border-b border-slate-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            <Cpu size={16} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-white">Agent Architect</span>
        </div>

        {/* Agents list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Agents</span>
            <button onClick={createAgent} className="text-slate-500 hover:text-indigo-400 transition-colors">
              <Plus size={14} />
            </button>
          </div>
          {agents.map(a => (
            <div key={a.id} onClick={() => { setActiveId(a.id); setActiveTab("overview"); }}
              className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${a.id === activeId ? "bg-indigo-600/20 border border-indigo-600/40" : "hover:bg-slate-800 border border-transparent"}`}>
              <Bot size={14} className={a.id === activeId ? "text-indigo-400" : "text-slate-500"} />
              <span className={`flex-1 text-sm truncate ${a.id === activeId ? "text-white" : "text-slate-400"}`}>{a.name}</span>
              {agents.length > 1 && (
                <button onClick={e => { e.stopPropagation(); deleteAgent(a.id); }}
                  className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* New agent button */}
        <div className="p-3 border-t border-slate-800">
          <button onClick={createAgent}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-600/30 rounded-lg text-sm text-indigo-400 transition-all">
            <Plus size={14} /> New Agent
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="border-b border-slate-800 bg-slate-900/50 flex items-center">
          <button onClick={() => setSidebar(v => !v)} className="px-4 py-3 text-slate-500 hover:text-slate-300 transition-colors">
            <Layers size={16} />
          </button>
          <div className="flex-1 flex items-center">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-all ${active ? "text-white border-indigo-500" : "text-slate-500 border-transparent hover:text-slate-300 hover:border-slate-600"}`}>
                  <Icon size={14} /> {tab.label}
                </button>
              );
            })}
          </div>
          {agent && (
            <div className="px-4 flex items-center gap-2">
              <span className="text-xs text-slate-600">{agent.name}</span>
              <Badge color="#6366f1">{agent.model}</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!agent ? (
            <div className="flex items-center justify-center h-full text-slate-600">Select or create an agent</div>
          ) : activeTab === "overview" ? (
            <OverviewSection agent={agent} onUpdate={updateAgent} />
          ) : activeTab === "prompt" ? (
            <PromptSection agent={agent} onUpdate={updateAgent} />
          ) : activeTab === "workflow" ? (
            <WorkflowSection agent={agent} onUpdate={updateAgent} />
          ) : activeTab === "tools" ? (
            <ToolsSection agent={agent} onUpdate={updateAgent} />
          ) : (
            <EvalsSection agent={agent} onUpdate={updateAgent} />
          )}
        </div>
      </div>
    </div>
  );
}
