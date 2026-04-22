"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

export default function Nav() {
  const path = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefers ? "dark" : "light");
    setTheme(initial);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  const links = [
    { href: "/", label: "Frameworks" },
    { href: "/compare", label: "Compare" },
    { href: "/patterns", label: "Patterns" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="max-w-page mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <rect
              x="2"
              y="2"
              width="18"
              height="18"
              rx="4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M6 11 L11 6 M11 6 L16 11 M11 6 L11 16"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-display text-base tracking-tight">
            Harness<span className="italic">.wiki</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((l) => {
            const active =
              (l.href === "/" && path === "/") ||
              (l.href !== "/" && path.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  active
                    ? "text-[var(--color-text)] bg-[var(--color-surface)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <button
            onClick={toggle}
            className="ml-2 w-8 h-8 rounded-md hover:bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-text-muted)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
