"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  code: string;
  language?: string;
  title?: string;
  maxHeight?: number;
};

/**
 * Minimal Python / TS syntax highlighter.
 * Pure CSS classes — works in light and dark, no external deps.
 */
function highlight(code: string): string {
  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const KEYWORDS = new Set([
    "def","class","from","import","return","if","else","elif","for","while",
    "try","except","finally","with","as","pass","break","continue","async","await",
    "in","not","and","or","is","None","True","False","lambda","yield","raise",
    "const","let","var","function","export","default","interface","type","extends",
    "null","true","false","new","await","async","of","import","from","export",
  ]);
  const BUILTINS = new Set([
    "list","dict","set","tuple","int","str","float","bool","print","len","range",
    "Array","Object","String","Number","Boolean","console","JSON",
  ]);

  const lines = code.split("\n");
  return lines
    .map((line) => {
      let out = "";
      let i = 0;
      const n = line.length;
      while (i < n) {
        const ch = line[i];

        // Comments
        if (ch === "#" || (ch === "/" && line[i + 1] === "/")) {
          out += `<span class="tk-cm">${escape(line.slice(i))}</span>`;
          break;
        }

        // Triple-string detection (simplified — inline only for now)
        if ((ch === '"' || ch === "'") && line.slice(i, i + 3) === ch.repeat(3)) {
          const rest = line.slice(i);
          out += `<span class="tk-st">${escape(rest)}</span>`;
          break;
        }

        // Strings
        if (ch === '"' || ch === "'" || ch === "`") {
          const q = ch;
          let j = i + 1;
          while (j < n && line[j] !== q) {
            if (line[j] === "\\" && j + 1 < n) j++;
            j++;
          }
          out += `<span class="tk-st">${escape(line.slice(i, j + 1))}</span>`;
          i = j + 1;
          continue;
        }

        // Numbers
        if (/[0-9]/.test(ch) && (i === 0 || /[^a-zA-Z_]/.test(line[i - 1]))) {
          let j = i;
          while (j < n && /[0-9.]/.test(line[j])) j++;
          out += `<span class="tk-nm">${escape(line.slice(i, j))}</span>`;
          i = j;
          continue;
        }

        // Identifiers
        if (/[a-zA-Z_]/.test(ch)) {
          let j = i;
          while (j < n && /[a-zA-Z0-9_]/.test(line[j])) j++;
          const word = line.slice(i, j);
          if (KEYWORDS.has(word)) {
            out += `<span class="tk-kw">${escape(word)}</span>`;
          } else if (BUILTINS.has(word)) {
            out += `<span class="tk-bi">${escape(word)}</span>`;
          } else if (line[j] === "(") {
            out += `<span class="tk-fn">${escape(word)}</span>`;
          } else {
            out += escape(word);
          }
          i = j;
          continue;
        }

        // Decorators
        if (ch === "@") {
          let j = i + 1;
          while (j < n && /[a-zA-Z0-9_.]/.test(line[j])) j++;
          out += `<span class="tk-dc">${escape(line.slice(i, j))}</span>`;
          i = j;
          continue;
        }

        out += escape(ch);
        i++;
      }
      return out || "&nbsp;";
    })
    .join("\n");
}

export default function CodeBlock({
  code,
  language = "python",
  title,
  maxHeight,
}: Props) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden group">
      {(title || language) && (
        <div className="flex items-center justify-between px-4 h-9 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <span className="text-xs font-mono text-[var(--color-text-faint)]">
            {title || language}
          </span>
          <button
            onClick={copy}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] flex items-center gap-1.5 transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "copied" : "copy"}
          </button>
        </div>
      )}
      <div
        className="overflow-auto"
        style={maxHeight ? { maxHeight: `${maxHeight}px` } : undefined}
      >
        <pre className="p-4 text-[13px] font-mono leading-[1.7]">
          <code
            className="code-hl"
            dangerouslySetInnerHTML={{ __html: highlight(code) }}
          />
        </pre>
      </div>
      <style jsx global>{`
        .code-hl .tk-kw { color: #c94d7a; }
        .code-hl .tk-st { color: #5a8f4e; }
        .code-hl .tk-nm { color: #a8703e; }
        .code-hl .tk-cm { color: #8a8168; font-style: italic; }
        .code-hl .tk-fn { color: #2e6fb5; }
        .code-hl .tk-bi { color: #c66b2c; }
        .code-hl .tk-dc { color: #8c5fb8; }
        .dark .code-hl .tk-kw { color: #f291b5; }
        .dark .code-hl .tk-st { color: #a0d089; }
        .dark .code-hl .tk-nm { color: #e0a86c; }
        .dark .code-hl .tk-cm { color: #7a7866; }
        .dark .code-hl .tk-fn { color: #6bb0f0; }
        .dark .code-hl .tk-bi { color: #e89858; }
        .dark .code-hl .tk-dc { color: #c39af0; }
      `}</style>
    </div>
  );
}
