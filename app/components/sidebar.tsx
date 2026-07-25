"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/experiments", label: "Experiments" },
  { href: "/traces", label: "Traces" },
  { href: "/attacks", label: "Attacks" },
  { href: "/targets", label: "Targets" },
  { href: "/reports", label: "Reports" },
  { href: "/learn", label: "Learn" },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <nav className="w-64 min-h-screen bg-gray-900 text-gray-200 p-4 flex flex-col">
      <h1 className="text-lg font-bold mb-6 text-white">WhisperLab</h1>
      <ul className="space-y-2">
        {NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block px-3 py-2 rounded-md text-sm ${
                path === item.href
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}