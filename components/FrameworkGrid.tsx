"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import BrandLogo from "./BrandLogo";
import {
  frameworks,
  categoryLabels,
  categoryDescriptions,
  type Category,
} from "@/data/frameworks";
import { cn } from "@/lib/cn";

type Filter = Category | "all";

export default function FrameworkGrid() {
  const [filter, setFilter] = useState<Filter>("all");

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "全部", count: frameworks.length },
    {
      id: "framework",
      label: categoryLabels.framework,
      count: frameworks.filter((f) => f.category === "framework").length,
    },
    {
      id: "memory",
      label: categoryLabels.memory,
      count: frameworks.filter((f) => f.category === "memory").length,
    },
    {
      id: "protocol",
      label: categoryLabels.protocol,
      count: frameworks.filter((f) => f.category === "protocol").length,
    },
  ];

  const activeDesc =
    filter === "all" ? null : categoryDescriptions[filter as Category];

  return (
    <section>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-sm border transition-all",
              filter === f.id
                ? "bg-[var(--color-text)] text-[var(--color-bg)] border-[var(--color-text)]"
                : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
            )}
          >
            <span>{f.label}</span>
            <span className="ml-2 text-xs opacity-60">{f.count}</span>
          </button>
        ))}
      </div>

      {activeDesc && (
        <p className="text-sm text-[var(--color-text-muted)] mb-5 italic display-subtitle">
          {activeDesc}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
        {frameworks
          .filter((f) => filter === "all" || f.category === filter)
          .map((f) => (
            <Link
              key={f.id}
              href={`/frameworks/${f.id}`}
              className="block group"
            >
              <article className="relative h-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 pt-6 transition-all hover:border-[var(--color-border-strong)] hover:-translate-y-0.5 overflow-hidden">
                {/* accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] transition-all group-hover:h-[5px]"
                  style={{ backgroundColor: f.accentColor }}
                />

                <div className="flex items-start gap-3 mb-3">
                  <BrandLogo id={f.id} size={40} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl leading-tight mb-0.5">
                      {f.name}
                    </h3>
                    <p className="text-xs text-[var(--color-text-faint)]">
                      {f.org} · {f.language}
                    </p>
                  </div>
                  <span
                    className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded border"
                    style={{
                      color: f.accentColor,
                      borderColor: f.accentColor + "40",
                    }}
                  >
                    {categoryLabels[f.category]}
                  </span>
                </div>

                <p className="display-subtitle text-[15px] text-[var(--color-text-muted)] mb-4 leading-snug">
                  {f.tagline}
                </p>

                <p className="text-sm leading-relaxed mb-4 text-[var(--color-text)]">
                  {f.oneSentence}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {f.preferences.slice(0, 3).map((p) => (
                    <span
                      key={p}
                      className="text-[11px] px-2 py-0.5 rounded bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                  <span className="text-xs font-mono text-[var(--color-text-faint)]">
                    {f.stars} · {f.firstRelease}
                  </span>
                  <span className="text-sm font-medium flex items-center gap-0.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors">
                    详情
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </article>
            </Link>
          ))}
      </div>
    </section>
  );
}
