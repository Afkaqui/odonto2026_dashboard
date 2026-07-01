"use client";
import { useEffect, useState } from "react";
import { getSummary, deleteRecord, type Summary } from "@/lib/api";
import { fmtDateTime, statusColor, anxLabel, momentoLabel } from "@/lib/format";
import StatCard from "./components/StatCard";

export default function ResumenPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updated, setUpdated] = useState<Date | null>(null);

  async function load() {
    try {
      setData(await getSummary());
      setError(null);
      setUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 10000); // refresco cada 10s (supervisión en vivo)
    return () => clearInterval(t);
  }, []);

  async function borrar(id: string) {
    if (!confirm(`¿Eliminar el registro #${id}? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteRecord(id);
      await load();
    } catch (e) {
      alert("No se pudo eliminar: " + (e instanceof Error ? e.message : e));
    }
  }

  const c = data?.counts;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Resumen general</h1>
        <div className="text-xs text-zinc-500">
          {updated ? `Actualizado ${updated.toLocaleTimeString("es-PE")}` : "Cargando..."}
          <button onClick={load} className="ml-3 px-2 py-1 bg-blue-600 text-white rounded">
            Refrescar
          </button>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded">Error: {error}</div>}

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Médicos" value={c?.doctores ?? "—"} accent="blue" />
        <StatCard label="Pacientes" value={c?.pacientes ?? "—"} accent="purple" />
        <StatCard label="Pulseras" value={c?.pulseras ?? "—"} accent="green" />
        <StatCard label="Registros (total)" value={c?.registros_total ?? "—"} accent="zinc" />
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Consultas hoy" value={c?.consultas_hoy ?? "—"} accent="blue" />
        <StatCard label="Registros hoy" value={c?.registros_hoy ?? "—"} accent="red" />
        <StatCard label="Consultas (total)" value={c?.consultas_total ?? "—"} accent="zinc" />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Últimos registros</h2>
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-zinc-100 text-zinc-600">
              <tr>
                <th className="text-left p-3">Hora</th>
                <th className="text-left p-3">Paciente</th>
                <th className="text-left p-3">Médico</th>
                <th className="text-left p-3">PPG</th>
                <th className="text-left p-3">Momento</th>
                <th className="text-left p-3">Estado</th>
                <th className="text-left p-3">Fuente</th>
                <th className="text-left p-3">Consulta</th>
                <th className="text-left p-3"></th>
              </tr>
            </thead>
            <tbody>
              {data?.ultimos_registros.length ? (
                data.ultimos_registros.map((r) => (
                  <tr key={r.id} className="border-t border-zinc-100">
                    <td className="p-3 whitespace-nowrap">{fmtDateTime(r.captured_at)}</td>
                    <td className="p-3">{r.paciente_name ?? r.paciente_code ?? "—"}</td>
                    <td className="p-3">
                      {r.doctor_name ? `${r.doctor_name} ${r.doctor_lastname ?? ""}` : "—"}
                    </td>
                    <td className="p-3 font-medium">{r.ppg ?? "—"}</td>
                    <td className="p-3">{momentoLabel(r.phase_num, r.phase_label)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor(r.status)}`}>
                        {anxLabel(r.status)}
                      </span>
                    </td>
                    <td className="p-3">{r.source ?? "—"}</td>
                    <td className="p-3">#{r.consultation_id}</td>
                    <td className="p-3">
                      <button
                        onClick={() => borrar(r.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded px-2 py-1"
                        title="Eliminar registro"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-zinc-400">
                    Sin registros todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
