"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Resumen" },
  { href: "/jornada", label: "Jornada" },
  { href: "/pulseras", label: "Pulseras" },
  { href: "/medicos", label: "Médicos" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="bg-blue-700 text-white">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
        <span className="font-semibold text-lg">🦷 Pulsera PPG · Panel</span>
        <nav className="flex gap-1">
          {links.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  active ? "bg-white text-blue-700 font-medium" : "hover:bg-blue-600"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
