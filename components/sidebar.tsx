"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Workbench", glyph: "⌁" },
  { href: "/experiments", label: "Experiments", glyph: "▤" },
  { href: "/traces", label: "Traces", glyph: "∿" },
  { href: "/attacks", label: "Attacks", glyph: "⌗" },
  { href: "/targets", label: "Targets", glyph: "⬡" },
  { href: "/reports", label: "Reports", glyph: "◫" },
  { href: "/learn", label: "Learn", glyph: "📖" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          CW
        </div>
        <div>
          <strong>WhisperLab</strong>
          <span>local control plane</span>
        </div>
      </div>

      <nav aria-label="Primary navigation">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? "nav-item active" : "nav-item"}
            >
              <span aria-hidden="true">{item.glyph}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-spacer" />
      <div className="local-lock">
        <span className="status-dot safe" />
        <div>
          <strong>Local only</strong>
          <span>127.0.0.1 · no cloud USB</span>
        </div>
      </div>
      <p className="build-id">WHISPERLAB v0.1.0</p>
    </aside>
  );
}
