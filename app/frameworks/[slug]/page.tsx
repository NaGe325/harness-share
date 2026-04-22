import { notFound } from "next/navigation";
import Link from "next/link";
import {
  frameworks,
  getFrameworkById,
  categoryLabels,
} from "@/data/frameworks";
import BrandLogo from "@/components/BrandLogo";
import CodeBlock from "@/components/CodeBlock";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  X,
  BookOpen,
  Package,
  Compass,
} from "lucide-react";

export function generateStaticParams() {
  return frameworks.map((f) => ({ slug: f.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const f = getFrameworkById(slug);
  if (!f) return {};
  return {
    title: `${f.name} · Harness Wiki`,
    description: f.oneSentence,
  };
}

export default async function FrameworkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const f = getFrameworkById(slug);
  if (!f) notFound();

  const otherFrameworks = frameworks
    .filter((x) => x.id !== f.id && x.category === f.category)
    .slice(0, 3);

  return (
    <div className="max-w-page mx-auto px-6 pb-16">
      {/* Breadcrumb */}
      <div className="pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <ArrowLeft size={14} /> 回到所有框架
        </Link>
      </div>

      {/* Hero */}
      <header className="pt-10 pb-10 border-b border-[var(--color-border)]">
        <div className="flex flex-wrap items-start gap-5 mb-6">
          <BrandLogo id={f.id} size={72} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span
                className="text-[10px] uppercase tracking-[0.2em] font-mono px-2 py-1 rounded border"
                style={{
                  color: f.accentColor,
                  borderColor: f.accentColor + "50",
                }}
              >
                {categoryLabels[f.category]}
              </span>
              <span className="text-xs text-[var(--color-text-faint)] font-mono">
                {f.stars} · since {f.firstRelease} · {f.language}
              </span>
            </div>
            <h1 className="display-title text-5xl md:text-6xl mb-1">
              {f.name}
            </h1>
            <p className="text-sm text-[var(--color-text-faint)] mb-3">
              by {f.org}
            </p>
            <p className="display-subtitle text-xl md:text-2xl text-[var(--color-text-muted)] max-w-3xl leading-snug">
              {f.tagline}
            </p>
          </div>
        </div>
        <p className="text-lg leading-relaxed max-w-reading">{f.oneSentence}</p>

        <div className="flex flex-wrap gap-3 mt-7">
          <a
            href={f.urls.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            GitHub <ArrowUpRight size={14} />
          </a>
          {f.urls.docs && (
            <a
              href={f.urls.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 h-10 rounded-full border border-[var(--color-border-strong)] text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
            >
              文档 <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </header>

      {/* Main content */}
      <article className="grid md:grid-cols-[1fr_280px] gap-10 md:gap-14 pt-12">
        <div className="space-y-12 min-w-0">
          {/* Description */}
          <section>
            <SectionLabel icon={BookOpen}>主要内容</SectionLabel>
            <p className="text-[15px] leading-[1.8] text-[var(--color-text)]">
              {f.description}
            </p>
          </section>

          {/* Focus */}
          <section>
            <SectionLabel icon={Compass}>核心关注点</SectionLabel>
            <p className="text-[15px] leading-[1.8] mb-4">{f.focus}</p>
            <div className="flex flex-wrap gap-1.5">
              {f.preferences.map((p) => (
                <span
                  key={p}
                  className="text-xs px-2.5 py-1 rounded bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-muted)] font-mono"
                >
                  {p}
                </span>
              ))}
            </div>
          </section>

          {/* Install & hello world */}
          <section>
            <SectionLabel icon={Package}>安装与 hello world</SectionLabel>
            <div className="mb-4 p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-sm">
              <span className="text-[var(--color-text-faint)]">$ </span>
              {f.installCmd}
            </div>
            <CodeBlock
              code={f.helloWorld}
              language="python"
              title="hello-world.py"
            />
          </section>

          {/* Key APIs */}
          <section>
            <SectionLabel>关键 API / 概念</SectionLabel>
            <div className="space-y-3">
              {f.keyApis.map((api) => (
                <div
                  key={api.name}
                  className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
                >
                  <code className="text-sm font-mono font-medium text-[var(--color-text)]">
                    {api.name}
                  </code>
                  <p className="mt-1.5 text-sm text-[var(--color-text-muted)] leading-relaxed">
                    {api.explain}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Use cases */}
          <section>
            <SectionLabel>适用场景</SectionLabel>
            <div className="space-y-4">
              {f.useCases.map((uc, i) => (
                <div key={uc.title} className="flex gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-display text-lg"
                    style={{
                      backgroundColor: f.accentColor + "18",
                      color: f.accentColor,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{uc.title}</h4>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                      {uc.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Anti-patterns */}
          <section>
            <SectionLabel>什么时候别用</SectionLabel>
            <ul className="space-y-2.5">
              {f.antiPatterns.map((ap) => (
                <li key={ap} className="flex gap-3 text-sm items-start">
                  <X
                    size={16}
                    className="text-[var(--color-text-faint)] mt-0.5 flex-shrink-0"
                  />
                  <span className="text-[var(--color-text-muted)] leading-relaxed">
                    {ap}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Versus */}
          <section>
            <SectionLabel>vs 相邻选项</SectionLabel>
            <div className="space-y-3">
              {f.versus.map((v) => (
                <div
                  key={v.other}
                  className="p-4 rounded-lg border border-[var(--color-border)] border-l-2"
                  style={{ borderLeftColor: f.accentColor }}
                >
                  <p className="font-medium text-sm mb-1">{v.other}</p>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    {v.diff}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="md:sticky md:top-20 md:self-start">
          <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-faint)] mb-4">
              at a glance
            </p>
            <dl className="space-y-3 text-sm">
              <StatRow k="GitHub 星数" v={f.stars} />
              <StatRow k="首次发布" v={f.firstRelease} />
              <StatRow k="语言" v={f.language} />
              <StatRow k="类别" v={categoryLabels[f.category]} />
              <StatRow k="Organization" v={f.org} />
            </dl>
          </div>

          {otherFrameworks.length > 0 && (
            <div className="mt-5 p-5 rounded-xl border border-[var(--color-border)]">
              <p className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-faint)] mb-3">
                同类其它
              </p>
              <ul className="space-y-2.5">
                {otherFrameworks.map((o) => (
                  <li key={o.id}>
                    <Link
                      href={`/frameworks/${o.id}`}
                      className="flex items-center gap-2.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors group"
                    >
                      <BrandLogo id={o.id} size={24} />
                      <span className="flex-1 truncate">{o.name}</span>
                      <ArrowUpRight
                        size={13}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </article>
    </div>
  );
}

function SectionLabel({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {Icon && (
        <Icon size={16} className="text-[var(--color-text-faint)]" />
      )}
      <h2 className="display-title text-2xl">{children}</h2>
    </div>
  );
}

function StatRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-[var(--color-text-faint)]">{k}</dt>
      <dd className="text-right text-[var(--color-text)] font-mono text-[13px]">
        {v}
      </dd>
    </div>
  );
}
