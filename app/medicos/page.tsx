"use client";
import { useEffect, useState } from "react";
import { getDoctors, type Doctor } from "@/lib/api";
import { fmtDateTime } from "@/lib/format";

export default function MedicosPage() {
  const [items, setItems] = useState<Doctor[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDoctors()
      .then((d) => setItems(d.doctors))
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Médicos registrados ({items.length})</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded">Error: {error}</div>}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-zinc-100 text-zinc-600">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Usuario</th>
              <th className="text-left p-3">Registrado</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((d) => (
                <tr key={d.id} className="border-t border-zinc-100">
                  <td className="p-3">{d.id}</td>
                  <td className="p-3 font-medium">{d.name} {d.lastname}</td>
                  <td className="p-3">{d.username}</td>
                  <td className="p-3">{fmtDateTime(d.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-zinc-400">
                  No hay médicos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
