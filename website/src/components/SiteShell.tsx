import Link from "next/link";
import type { ReactNode } from "react";

export function BrandMark() {
  return (
    <span className="brand" aria-label="MCPoppins home">
      <span className="brand-glyph" aria-hidden="true"><i /><i /><i /><i /></span>
      <span>MCPoppins</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand-link"><BrandMark /></Link>
        <nav className="desktop-nav" aria-label="Primary navigation"><Link href="/marketplace">Marketplace</Link><Link href="/channels/teams">Channels</Link><Link href="/trust">Trust</Link><Link href="/docs">Docs</Link><Link href="/pricing">Pricing</Link></nav>
        <Link href="/marketplace" className="button button-small button-dark">Explore <span>↗</span></Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer site-footer-minimal">
      <div className="shell footer-minimal">
        <BrandMark />
        <span>Trusted MCP kits for AI workspaces and communication channels.</span>
        <small>Static prototype · No credentials or external actions</small>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return <><SiteHeader /><main>{children}</main><SiteFooter /></>;
}

export function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

export function ArrowIcon() { return <span aria-hidden="true">↗</span>; }
