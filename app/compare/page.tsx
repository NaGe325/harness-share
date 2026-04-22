import CompareView from "@/components/CompareView";

export const metadata = {
  title: "Side-by-side · Harness Wiki",
  description:
    "Same task, different harnesses. See the code shape and mental model difference across LangGraph, CrewAI, OpenAI Agents SDK, smolagents, mem0, and Letta.",
};

export default function ComparePage() {
  return (
    <div className="max-w-page mx-auto px-6 py-12 md:py-16">
      <header className="mb-12 max-w-3xl">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-4">
          side-by-side code
        </p>
        <h1 className="display-title text-5xl md:text-6xl mb-4">
          同一个任务,<br />
          <span className="display-subtitle text-[var(--color-text-muted)]">
            三种代码形状
          </span>
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] leading-relaxed">
          Feature matrix 永远比不过看代码本身。这里列出几个常见任务,每个用 2-3 个主流框架实现一次 —— 看哪种心智模型跟你当前问题最匹配。
        </p>
      </header>

      <CompareView />
    </div>
  );
}
