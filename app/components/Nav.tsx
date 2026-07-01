"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Resumen" },
  { href: "/jornada", label: "Jornada" },
  { href: "/pacientes", label: "Pacientes" },
  { href: "/pulseras", label: "Pulseras" },
  { href: "/medicos", label: "Médicos" },
  { href: "/descargar", label: "Descargar app" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="bg-blue-700 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
        <span className="font-semibold text-base sm:text-lg whitespace-nowrap">🦷 Pulsera PPG · Panel</span>
        <nav className="flex flex-wrap gap-1 -mx-1 overflow-x-auto">
          {links.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${
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
