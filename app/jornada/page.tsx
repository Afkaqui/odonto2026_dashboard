"use client";
import { useEffect, useState } from "react";
import { getSession, type SessionResp } from "@/lib/api";
import { fmtTime, fmtDuration } from "@/lib/format";

export default function JornadaPage() {
  const [date, setDate] = useState<string>(""); // vacío = hoy
  const [data, setData] = useState<SessionResp | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load(d: string) {
    try {
      setData(await getSession(d || undefined));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }

  useEffect(() => {
    load(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">Jornada de atenciones</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-500">Fecha:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          <button onClick={() => load(date)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
            Ver
          </button>
          <button
            onClick={() => { setDate(""); load(""); }}
            className="px-3 py-1 bg-zinc-200 rounded text-sm"
          >
            Hoy
          </button>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded">Error: {error}</div>}

      <p className="text-sm text-zinc-500">
        {data ? `Jornada: ${data.date} · ${data.total} consulta(s)` : "Cargando..."}
      </p>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-zinc-100 text-zinc-600">
            <tr>
              <th className="text-left p-3">#</th>
              <th className="text-left p-3">Paciente</th>
              <th className="text-left p-3">Edad</th>
              <th className="text-left p-3">Médico</th>
              <th className="text-left p-3">Pulsera</th>
              <th className="text-left p-3">Inicio</th>
              <th className="text-left p-3">Fin</th>
              <th className="text-left p-3">Duración</th>
              <th className="text-left p-3">Registros</th>
            </tr>
          </thead>
          <tbody>
            {data?.consultas.length ? (
              data.consultas.map((c) => (
                <tr key={c.id} className="border-t border-zinc-100">
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.paciente_name ?? c.paciente_code ?? "—"}</td>
                  <td className="p-3">{c.paciente_edad ?? "—"}</td>
                  <td className="p-3">
                    {c.doctor_name ? `${c.doctor_name} ${c.doctor_lastname ?? ""}` : "—"}
                  </td>
                  <td className="p-3">{c.pulsera_code ?? "—"}</td>
                  <td className="p-3">{fmtTime(c.started_at)}</td>
                  <td className="p-3">{c.ended_at ? fmtTime(c.ended_at) : <span className="text-orange-600">en curso</span>}</td>
                  <td className="p-3">{fmtDuration(c.duration_seconds)}</td>
                  <td className="p-3 font-medium">{c.num_records}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-6 text-center text-zinc-400">
                  Sin consultas en esta jornada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
