"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function Nav({
  isAdmin,
  userImage,
}: {
  isAdmin: boolean;
  userImage?: string | null;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/categories", label: "Categories" },
    { href: "/progress", label: "Progress" },
  ];
  if (isAdmin) links.push({ href: "/admin", label: "Admin" });

  return (
    <header className="sticky top-0 z-20 bg-paper/90 backdrop-blur border-b border-line">
      <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link href="/home" className="font-jp text-lg font-semibold text-ink">
          かな
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(l.href)
                  ? "bg-ink text-white"
                  : "text-muted hover:text-ink hover:bg-line/60"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="ml-2 px-3 py-1.5 rounded-lg text-sm font-medium text-muted hover:text-ink hover:bg-line/60 transition-colors"
          >
            Sign out
          </button>
          {userImage && (
            <Image
              src={userImage}
              alt="Profile"
              width={30}
              height={30}
              className="rounded-full ml-1"
            />
          )}
        </nav>

        <button
          className="sm:hidden text-ink"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-line px-5 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                pathname.startsWith(l.href)
                  ? "bg-ink text-white"
                  : "text-muted hover:bg-line/60"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-left px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-line/60"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
