import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

const fraunces = { variable: "--font-display" };
const geist = { variable: "--font-sans" };
const geistMono = { variable: "--font-mono" };

export const metadata: Metadata = {
  title: "Harness Engineering Wiki",
  description:
    "An opinionated, interactive guide to AI agent harnesses. Frameworks, memory layers, and protocols for building reliable agents in 2026.",
  keywords: [
    "harness engineering",
    "AI agents",
    "LangGraph",
    "AutoGen",
    "CrewAI",
    "MCP",
    "LLM",
  ],
  authors: [{ name: "Harness Wiki" }],
  openGraph: {
    title: "Harness Engineering Wiki",
    description: "An opinionated, interactive guide to AI agent harnesses.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('theme');
                const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (stored === 'dark' || (!stored && prefers)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Nav />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-[var(--color-border)] mt-24">
          <div className="max-w-page mx-auto px-6 py-12 flex flex-wrap gap-8 justify-between text-sm">
            <div className="max-w-md">
              <p className="display-title text-2xl mb-2">Harness Wiki</p>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                An editorial guide to AI agent harness engineering. Opinionated,
                interactive, versioned against the ecosystem.
              </p>
            </div>
            <div className="flex gap-10 text-sm">
              <div>
                <p className="text-[var(--color-text-faint)] uppercase tracking-wider text-xs mb-3">
                  Learn
                </p>
                <ul className="space-y-2 text-[var(--color-text-muted)]">
                  <li>
                    <a href="/" className="link-underline">
                      Frameworks
                    </a>
                  </li>
                  <li>
                    <a href="/compare" className="link-underline">
                      Compare code
                    </a>
                  </li>
                  <li>
                    <a href="/patterns" className="link-underline">
                      Patterns
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-[var(--color-text-faint)] uppercase tracking-wider text-xs mb-3">
                  Source
                </p>
                <ul className="space-y-2 text-[var(--color-text-muted)]">
                  <li>
                    <a
                      href="https://github.com/ai-boost/awesome-harness-engineering"
                      target="_blank"
                      rel="noopener"
                      className="link-underline"
                    >
                      awesome-harness-engineering
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://openai.com/index/harness-engineering/"
                      target="_blank"
                      rel="noopener"
                      className="link-underline"
                    >
                      OpenAI: Harness Engineering
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.anthropic.com/research/building-effective-agents"
                      target="_blank"
                      rel="noopener"
                      className="link-underline"
                    >
                      Anthropic: Effective Agents
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="max-w-page mx-auto px-6 pb-8 text-xs text-[var(--color-text-faint)] flex justify-between">
            <span>&copy; {new Date().getFullYear()} Harness Wiki</span>
            <span className="font-mono">v0.1 · last updated Apr 2026</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
