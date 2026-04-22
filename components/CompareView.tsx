"use client";

import { useState } from "react";
import Link from "next/link";
import { compareTasks } from "@/data/compareTasks";
import { getFrameworkById } from "@/data/frameworks";
import CodeBlock from "@/components/CodeBlock";
import BrandLogo from "@/components/BrandLogo";
import { ArrowUpRight, Lightbulb } from "lucide-react";
import { cn } from "@/lib/cn";

export default function CompareView() {
  const [taskId, setTaskId] = useState(compareTasks[0].id);
  const task = compareTasks.find((t) => t.id === taskId)!;

  return (
    <div>
      {/* Task picker */}
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-4">
          选择任务
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {compareTasks.map((t) => (
            <button
              key={t.id}
              onClick={() => setTaskId(t.id)}
              className={cn(
                "text-left p-4 rounded-xl border transition-all",
                t.id === taskId
                  ? "border-[var(--color-text)] bg-[var(--color-surface)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
              )}
            >
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-faint)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="font-medium text-[15px] mb-1 leading-snug">
                {t.title}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                {t.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Task detail */}
      <div className="mb-8 p-5 md:p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-3">
          需求
        </p>
        <p className="text-[15px] leading-relaxed">{task.requirement}</p>
      </div>

      {/* Code side-by-side */}
      <div
        className={cn(
          "grid gap-5",
          task.samples.length === 3
            ? "grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2"
        )}
      >
        {task.samples.map((s) => {
          const f = getFrameworkById(s.framework);
          const lineCount = s.code.split("\n").length;
          return (
            <div
              key={s.framework}
              className="flex flex-col rounded-xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface)]"
            >
              <div
                className="px-4 py-3 border-b border-[var(--color-border)] flex items-start gap-3"
                style={{
                  borderTop: `3px solid ${f?.accentColor || "#888"}`,
                }}
              >
                <BrandLogo id={s.framework} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Link
                      href={`/frameworks/${s.framework}`}
                      className="font-display text-lg hover:underline"
                    >
                      {s.frameworkName}
                    </Link>
                  </div>
                  <p className="text-[11px] font-mono text-[var(--color-text-faint)]">
                    {lineCount} 行
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed italic">
                  {s.note}
                </p>
              </div>

              <div className="flex-1 min-h-0">
                <CodeBlock code={s.code} language="python" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Takeaway */}
      <div className="mt-10 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-start gap-3">
          <Lightbulb
            size={18}
            className="text-[var(--color-text-faint)] flex-shrink-0 mt-1"
          />
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-2">
              takeaway
            </p>
            <p className="text-[15px] leading-relaxed text-[var(--color-text)]">
              {task.takeaway}
            </p>
          </div>
        </div>
      </div>

      {/* Links to detail pages */}
      <div className="mt-8 flex flex-wrap gap-2">
        {task.samples.map((s) => {
          const f = getFrameworkById(s.framework);
          return (
            <Link
              key={s.framework}
              href={`/frameworks/${s.framework}`}
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-strong)] transition-colors"
              style={{ borderLeftColor: f?.accentColor, borderLeftWidth: 2 }}
            >
              深入 {s.frameworkName}
              <ArrowUpRight size={13} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
