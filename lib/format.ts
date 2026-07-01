// Utilidades de presentación.

export function fmtDateTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("es-PE", { dateStyle: "short", timeStyle: "medium" });
}

export function fmtTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("es-PE");
}

export function fmtDuration(seconds: number | null): string {
  if (seconds == null) return "en curso";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

// Nivel de ansiedad (a1 menor .. a5 mayor) -> etiqueta legible.
export function anxLabel(status: string | null): string {
  const map: Record<string, string> = {
    a1: "Muy baja", a2: "Baja", a3: "Media", a4: "Alta", a5: "Muy alta",
  };
  if (!status) return "—";
  return `${status.toUpperCase()} · ${map[status] ?? status}`;
}

// Momento -> "#num · etiqueta"
export function momentoLabel(num: number | null, label: string | null): string {
  const n = num != null ? `#${num}` : "";
  const l = label ?? "";
  return [n, l].filter(Boolean).join(" · ") || "—";
}

// Color por estado de ansiedad (a1..a5). a1 = calmado ... a5 = muy ansioso.
export function statusColor(status: string | null): string {
  switch (status) {
    case "a1": return "bg-green-100 text-green-800";
    case "a2": return "bg-lime-100 text-lime-800";
    case "a3": return "bg-yellow-100 text-yellow-800";
    case "a4": return "bg-orange-100 text-orange-800";
    case "a5": return "bg-red-100 text-red-800";
    default: return "bg-zinc-100 text-zinc-600";
  }
}
