"use client";
import { useEffect, useState } from "react";
import { getBracelets, type Bracelet } from "@/lib/api";
import { fmtDateTime } from "@/lib/format";

export default function PulserasPage() {
  const [items, setItems] = useState<Bracelet[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBracelets()
      .then((d) => setItems(d.bracelets))
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Pulseras registradas ({items.length})</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded">Error: {error}</div>}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-zinc-100 text-zinc-600">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Código</th>
              <th className="text-left p-3">Tipo</th>
              <th className="text-left p-3">Registrada</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((b) => (
                <tr key={b.id} className="border-t border-zinc-100">
                  <td className="p-3">{b.id}</td>
                  <td className="p-3 font-medium">{b.code ?? "—"}</td>
                  <td className="p-3">{b.type ?? "—"}</td>
                  <td className="p-3">{fmtDateTime(b.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-zinc-400">
                  No hay pulseras registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
