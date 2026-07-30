"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SUPPORTED_LOCALES, useLocale, useTranslations, type Locale } from "@/lib/i18n";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  "zh-TW": "繁體中文",
};

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations();
  const { locale, setLocale } = useLocale();

  const navItems = [
    { href: "/", label: t("sidebar.nav.workbench"), glyph: "⌁" },
    { href: "/experiments", label: t("sidebar.nav.experiments"), glyph: "▤" },
    { href: "/traces", label: t("sidebar.nav.traces"), glyph: "∿" },
    { href: "/attacks", label: t("sidebar.nav.attacks"), glyph: "⌗" },
    { href: "/targets", label: t("sidebar.nav.targets"), glyph: "⬡" },
    { href: "/reports", label: t("sidebar.nav.reports"), glyph: "◫" },
    { href: "/learn", label: t("sidebar.nav.learn"), glyph: "📖" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          CW
        </div>
        <div>
          <strong>{t("sidebar.brandName")}</strong>
          <span>{t("sidebar.brandTagline")}</span>
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

      <div className="locale-switcher" style={{ padding: "0 1rem 0.75rem" }}>
        <label
          htmlFor="locale-switcher-select"
          style={{
            display: "block",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--muted)",
            marginBottom: "0.25rem",
          }}
        >
          {t("sidebar.localeSwitcherLabel")}
        </label>
        <select
          id="locale-switcher-select"
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          aria-label={t("sidebar.localeSwitcherLabel")}
          style={{
            width: "100%",
            background: "var(--panel, #111915)",
            color: "var(--ink, #e5e5e5)",
            border: "1px solid var(--line, #2a3a30)",
            borderRadius: "6px",
            padding: "0.35rem 0.5rem",
            fontSize: "12px",
            fontFamily: "inherit",
          }}
        >
          {SUPPORTED_LOCALES.map((l) => (
            <option key={l} value={l}>
              {LOCALE_LABELS[l]}
            </option>
          ))}
        </select>
      </div>

      <div className="local-lock">
        <span className="status-dot safe" />
        <div>
          <strong>{t("sidebar.localOnly")}</strong>
          <span>{t("sidebar.localOnlySubtitle")}</span>
        </div>
      </div>
      <p className="build-id">{t("sidebar.buildId")}</p>
    </aside>
  );
}
