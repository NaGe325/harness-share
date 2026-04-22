import Link from "next/link";
import { ArrowUpRight, BookOpenText } from "lucide-react";
import { cn } from "@/lib/cn";

export const metadata = {
  title: "Patterns · Harness Wiki",
  description:
    "Cross-framework patterns in harness engineering: agent loop, context compaction, HITL, tool design, memory tiers.",
};

type Pattern = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  frameworks: string[];
  readings: { label: string; href: string }[];
  status: "published" | "draft";
};

const patterns: Pattern[] = [
  {
    slug: "agent-loop",
    title: "Agent Loop",
    subtitle: "Thought → Action → Observation",
    summary:
      "ReAct 以来的基本循环结构:每一轮 agent 观察当前状态、思考下一步、调用工具、读取结果,再进入下一轮。不同框架对 loop 边界的暴露程度不同 —— LangGraph 把每一轮变成一次图遍历,smolagents 让模型直接写 Python 跑完多步,OpenAI SDK 把 loop 隐藏只暴露 handoff。",
    frameworks: ["langgraph", "smolagents", "openai-agents"],
    readings: [
      {
        label: "ReAct 原论文 (2022)",
        href: "https://arxiv.org/abs/2210.03629",
      },
      {
        label: "OpenAI: Unrolling the Codex Agent Loop",
        href: "https://openai.com/index/unrolling-the-codex-agent-loop/",
      },
    ],
    status: "published",
  },
  {
    slug: "context-compaction",
    title: "Context Compaction",
    subtitle: "对抗 context rot",
    summary:
      "长任务必然超出上下文窗口。Compaction 是 harness 主动介入的过程:当历史太长时,把旧对话压缩成摘要腾出空间。关键决策是触发时机(harness 定期 vs agent 自主)和压缩粒度(按 token 预算 vs 按任务边界)。Anthropic 的 server-side compaction 在 100 轮 web search 实验中降低 84% token 消耗。",
    frameworks: ["mcp", "langgraph", "letta"],
    readings: [
      {
        label: "Anthropic: Effective Context Engineering",
        href: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      },
      {
        label: "LangChain: Autonomous Context Compression",
        href: "https://blog.langchain.com/autonomous-context-compression/",
      },
    ],
    status: "published",
  },
  {
    slug: "human-in-the-loop",
    title: "Human-in-the-Loop",
    subtitle: "interrupt · approve · resume",
    summary:
      "在 agent 任意一步暂停等人工审批。三种插入方式:breakpoint(特定节点前后)、interrupt(动态决定)、approve-with-changes(人工可以修改 agent 的提议再继续)。Claude Agent SDK 的 canUseTool callback 是目前最细的权限模型。",
    frameworks: ["langgraph", "autogen", "mcp"],
    readings: [
      {
        label: "LangGraph: Human-in-the-Loop Concepts",
        href: "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/",
      },
      {
        label: "Claude Agent SDK: Permissions",
        href: "https://platform.claude.com/docs/en/agent-sdk/permissions",
      },
    ],
    status: "published",
  },
  {
    slug: "tool-design",
    title: "Tool Design",
    subtitle: "tool schema is agent UX",
    summary:
      "一个设计糟糕的工具能让 agent 整体表现暴跌 30%。关键原则:名字清楚表达意图、schema 严格、错误信息机器可读、返回值结构化。playwright-mcp 用 accessibility tree 而不是截图 —— 这是同类工具中最好的设计范例。",
    frameworks: ["mcp"],
    readings: [
      {
        label: "Anthropic: Writing Effective Tools for Agents",
        href: "https://www.anthropic.com/engineering/writing-effective-tools-for-agents",
      },
      {
        label: "MCP: Tool Annotations as Risk Vocabulary",
        href: "https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/",
      },
    ],
    status: "draft",
  },
  {
    slug: "memory-tiers",
    title: "Memory Tiers",
    subtitle: "core · archival · recall",
    summary:
      "MemGPT 论文定义的三层记忆结构已成为有状态 agent 的参考范式。核心记忆常驻 context(persona / 关键事实),归档记忆是向量库按需检索,召回记忆是完整历史按时间或实体召回。关键是 agent 自主决定什么进哪层。",
    frameworks: ["letta", "mem0"],
    readings: [
      {
        label: "MemGPT paper",
        href: "https://arxiv.org/abs/2310.08560",
      },
      {
        label: "Facts as First Class Objects",
        href: "https://arxiv.org/abs/2603.17781",
      },
    ],
    status: "draft",
  },
  {
    slug: "verification-loop",
    title: "Verification Loop",
    subtitle: "structured self-check",
    summary:
      "不是让 LLM 更准,而是让 harness 能验证 LLM 的输出。编译器、linter、单元测试、assertion、LLM-as-judge 都是 verification 的形式。LangChain 的 Deep Agents 通过在规划和验证阶段加重推理(reasoning sandwich),把 Terminal Bench 2.0 从第 30 名提升到前 5。",
    frameworks: ["langgraph", "pydantic-ai"],
    readings: [
      {
        label: "LangChain: Improving Deep Agents with Harness Engineering",
        href: "https://blog.langchain.com/improving-deep-agents-with-harness-engineering/",
      },
    ],
    status: "draft",
  },
];

export default function PatternsPage() {
  return (
    <div className="max-w-page mx-auto px-6 py-12 md:py-16">
      <header className="mb-12 max-w-3xl">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-4">
          the L3 layer
        </p>
        <h1 className="display-title text-5xl md:text-6xl mb-4">
          Patterns,<br />
          <span className="display-subtitle text-[var(--color-text-muted)]">
            not framework features
          </span>
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-4">
          框架会过时,pattern 会留下。这一层讲 harness engineering 的核心抽象 —— agent loop、context compaction、HITL、tool design、memory tiers、verification —— 以及每个 pattern 在不同框架里是怎么实现的。
        </p>
        <p className="text-sm text-[var(--color-text-faint)] italic display-subtitle">
          这一层正在持续扩充。draft 状态的 pattern 欢迎提 PR。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {patterns.map((p) => (
          <article
            key={p.slug}
            className="group p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-border-strong)]"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="display-title text-2xl mb-1">{p.title}</h2>
                <p className="display-subtitle text-[var(--color-text-muted)]">
                  {p.subtitle}
                </p>
              </div>
              <span
                className={cn(
                  "text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border flex-shrink-0",
                  p.status === "published"
                    ? "border-[#1D9E75] text-[#0F6E56] bg-[#E1F5EE]"
                    : "border-[var(--color-border)] text-[var(--color-text-faint)]"
                )}
              >
                {p.status}
              </span>
            </div>

            <p className="text-sm leading-relaxed mb-5 text-[var(--color-text-muted)]">
              {p.summary}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {p.frameworks.map((fid) => (
                <Link
                  key={fid}
                  href={`/frameworks/${fid}`}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-strong)] transition-colors"
                >
                  {fid}
                </Link>
              ))}
            </div>

            {p.readings.length > 0 && (
              <div className="pt-4 border-t border-[var(--color-border)]">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-faint)] mb-2.5 flex items-center gap-1.5">
                  <BookOpenText size={11} /> 必读
                </p>
                <ul className="space-y-1.5">
                  {p.readings.map((r) => (
                    <li key={r.href}>
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] inline-flex items-center gap-1 link-underline"
                      >
                        {r.label} <ArrowUpRight size={10} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
