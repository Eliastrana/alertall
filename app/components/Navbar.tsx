// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Hjem" },
  { href: "/steps", label: "Fremgang" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 ">
      <div className="pointer-events-none absolute inset-0" />
      <nav className="relative mx-auto flex max-w-5xl items-center justify-center px-6 py-4">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-card/90 px-2 py-2 shadow-soft">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-tint text-foreground"
                    : "text-muted hover:bg-tint hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
