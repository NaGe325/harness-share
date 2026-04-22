import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-page mx-auto px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-6">
        404
      </p>
      <h1 className="display-title text-6xl md:text-8xl mb-5">
        lost in the<br />
        <span className="display-subtitle text-[var(--color-text-muted)]">
          agent loop
        </span>
      </h1>
      <p className="text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
        你要找的 harness 还没被收录,或者链接有误。
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 px-5 h-11 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] text-sm font-medium hover:opacity-90 transition-opacity"
      >
        回到首页
      </Link>
    </div>
  );
}
