"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import en from "./dictionaries/en.json";
import zhTW from "./dictionaries/zh-TW.json";

export const SUPPORTED_LOCALES = ["en", "zh-TW"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

const LOCALE_STORAGE_KEY = "whisperlab-locale";
const LOCALE_COOKIE_KEY = "wl_locale";

// Plain JSON dictionaries rather than next-intl: this app is built with the
// vinext + Cloudflare Workers RSC pipeline (see vite.config.ts), which does
// not run standard Next.js middleware, so next-intl's middleware-based
// locale negotiation/routing has no hook to attach to. A React Context
// provider that reads/writes a cookie + localStorage sidesteps that
// entirely and works with client components as-is.
const dictionaries: Record<Locale, Record<string, unknown>> = {
  en,
  "zh-TW": zhTW,
};

function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

function readCookieLocale(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${LOCALE_COOKIE_KEY}=([^;]*)`),
  );
  const value = match ? decodeURIComponent(match[1]) : null;
  return isLocale(value) ? value : null;
}

function writeCookieLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE_KEY}=${encodeURIComponent(
    locale,
  )}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

function readInitialLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = window.localStorage?.getItem(LOCALE_STORAGE_KEY);
  if (isLocale(stored)) return stored;
  const cookieLocale = readCookieLocale();
  if (cookieLocale) return cookieLocale;
  return DEFAULT_LOCALE;
}

function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      obj,
    );
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Read persisted locale on mount (client only, avoids SSR/CSR mismatch).
  useEffect(() => {
    setLocaleState(readInitialLocale());
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      window.localStorage?.setItem(LOCALE_STORAGE_KEY, next);
    }
    writeCookieLocale(next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}

export function useTranslations() {
  const { locale } = useLocale();
  const dict = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];

  return useCallback(
    (key: string, fallback?: string) => {
      const value = getPath(dict, key);
      if (typeof value === "string") return value;
      return fallback ?? key;
    },
    [dict],
  );
}
