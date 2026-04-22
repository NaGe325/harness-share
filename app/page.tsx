import FrameworkGrid from "@/components/FrameworkGrid";
import Link from "next/link";
import { ArrowRight, GitFork, Layers, Wrench } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-page mx-auto px-6">
      {/* Hero */}
      <section className="pt-14 pb-16 md:pt-24 md:pb-20 noise relative">
        <div className="absolute inset-0 grid-lines pointer-events-none opacity-30" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-6">
            the editorial guide · v0.1 · apr 2026
          </p>
          <h1 className="display-title text-5xl md:text-7xl mb-6">
            Harness
            <br />
            <span className="display-subtitle text-[var(--color-text-muted)]">
              engineering
            </span>
            <span className="text-[#D85A30]">.</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-[var(--color-text-muted)] leading-relaxed mb-8">
            模型负责推理,{" "}
            <span className="text-[var(--color-text)] font-medium">harness 负责其他一切</span>{" "}
            —— 上下文管理、工具治理、记忆、验证、沙盒。这是围绕 LLM 搭建 agent 的工程学科,
            <span className="display-subtitle"> 2026 年正在成型。</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#frameworks"
              className="inline-flex items-center gap-1.5 px-5 h-11 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] text-sm font-medium hover:opacity-90 transition-opacity"
            >
              探索 10 个工具
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 px-5 h-11 rounded-full border border-[var(--color-border-strong)] text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
            >
              side-by-side 对比
            </Link>
          </div>
        </div>
      </section>

      {/* Formula band */}
      <section className="py-10 md:py-12 border-y border-[var(--color-border)]">
        <div className="flex flex-wrap items-center gap-6 md:gap-10 justify-between">
          <div className="flex items-baseline gap-5 font-display text-3xl md:text-5xl">
            <span>Agent</span>
            <span className="text-[var(--color-text-faint)] text-4xl">=</span>
            <span className="display-subtitle">Model</span>
            <span className="text-[var(--color-text-faint)] text-4xl">+</span>
            <span style={{ color: "#D85A30" }}>Harness</span>
          </div>
          <div className="text-sm text-[var(--color-text-muted)] max-w-xs">
            by OpenAI (harness engineering) × Anthropic (effective agents), 2025–2026
          </div>
        </div>
      </section>

      {/* Three-column intro */}
      <section className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: GitFork,
            title: "核心框架",
            count: "6 个",
            detail:
              "Agent 编排的主骨架。LangGraph、AutoGen、OpenAI Agents SDK、CrewAI、Pydantic AI、Google ADK、smolagents —— 每一个都有自己的哲学。",
          },
          {
            icon: Layers,
            title: "记忆与状态",
            count: "2 个",
            detail:
              "让 agent 跨 session 记得用户。Letta 是架构级方案(memory-first),mem0 是插件级方案(三行接入)。",
          },
          {
            icon: Wrench,
            title: "工具与协议",
            count: "1 个标准",
            detail:
              "MCP 是 agent 世界的 USB-C,已被 OpenAI / Google 采纳。配合 Claude Agent SDK 继承整个工具层。",
          },
        ].map((col, i) => (
          <div key={i}>
            <col.icon
              size={20}
              className="text-[var(--color-text-faint)] mb-4"
            />
            <div className="flex items-baseline gap-3 mb-3">
              <h2 className="display-title text-2xl">{col.title}</h2>
              <span className="font-mono text-sm text-[var(--color-text-faint)]">
                {col.count}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
              {col.detail}
            </p>
          </div>
        ))}
      </section>

      {/* Framework grid */}
      <section id="frameworks" className="pt-4 pb-12 scroll-mt-16">
        <div className="mb-8 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h2 className="display-title text-4xl md:text-5xl mb-2">
              10 个必知
            </h2>
            <p className="display-subtitle text-[var(--color-text-muted)] text-lg">
              按类别筛选,点卡片进详情页
            </p>
          </div>
          <Link
            href="/compare"
            className="text-sm link-underline text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            看它们写代码有什么不同 →
          </Link>
        </div>
        <FrameworkGrid />
      </section>

      {/* Callout */}
      <section className="my-20 py-12 px-8 md:px-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background:
              "linear-gradient(90deg, #639922 0%, #378ADD 25%, #D4537E 50%, #EF9F27 75%, #D85A30 100%)",
          }}
        />
        <div className="max-w-2xl">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-4">
            editorial take
          </p>
          <p className="display-title text-2xl md:text-3xl leading-snug mb-6">
            "最好的 harness 知道自己终将过时。每一个 harness 组件都是因为模型做不到某件事而存在的 —— 那些假设会随着模型变强而消失。"
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            — Anthropic Engineering, Harness Design for Long-Running Application Development
          </p>
        </div>
      </section>
    </div>
  );
}
