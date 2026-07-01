"use client";
import { useEffect, useState, useCallback } from "react";
import {
  getPatients, getPatientDetail, updatePatient, deletePatient,
  getConsultation, updateRecord, deleteRecord,
  type Patient, type ConsultationRow, type RecordRow,
} from "@/lib/api";
import { fmtDateTime, fmtDuration, anxLabel, momentoLabel, statusColor } from "@/lib/format";

const ANX = ["a1", "a2", "a3", "a4", "a5"];

export default function PacientesPage() {
  const [q, setQ] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sel, setSel] = useState<Patient | null>(null);        // paciente expandido
  const [cons, setCons] = useState<ConsultationRow[]>([]);
  const [editP, setEditP] = useState<Patient | null>(null);    // modal editar paciente
  const [editR, setEditR] = useState<RecordRow | null>(null);  // modal editar record

  const load = useCallback(async (query = "") => {
    try { setPatients((await getPatients(query || undefined)).patients); setError(null); }
    catch (e) { setError(e instanceof Error ? e.message : "Error"); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function abrir(p: Patient) {
    if (sel?.id === p.id) { setSel(null); setCons([]); return; }
    setSel(p);
    try { setCons((await getPatientDetail(p.id)).consultations); } catch { setCons([]); }
  }

  async function borrarPaciente(p: Patient) {
    if (!confirm(`¿Eliminar al paciente ${p.name ?? p.code}?`)) return;
    try { await deletePatient(p.id); await load(q); if (sel?.id === p.id) setSel(null); }
    catch (e) { alert(e instanceof Error ? e.message : e); }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Pacientes ({patients.length})</h1>
        <div className="flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(q)}
            placeholder="Buscar por nombre o código"
            className="border rounded px-3 py-1.5 text-sm w-48 sm:w-64" />
          <button onClick={() => load(q)} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">Buscar</button>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded">Error: {error}</div>}

      <div className="space-y-3">
        {patients.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm">
            <div className="flex flex-wrap items-center gap-3 p-4">
              <button onClick={() => abrir(p)} className="flex-1 text-left min-w-0">
                <div className="font-medium truncate">{p.name ?? p.code ?? "—"}</div>
                <div className="text-xs text-zinc-500">
                  Código: {p.code ?? "—"} · Edad: {p.age ?? "?"} · {p.gender ?? "?"} · {p.consultas ?? 0} consulta(s)
                </div>
              </button>
              <button onClick={() => setEditP(p)} className="text-blue-600 hover:bg-blue-50 rounded px-2 py-1 text-sm">✏️ Editar</button>
              <button onClick={() => borrarPaciente(p)} className="text-red-600 hover:bg-red-50 rounded px-2 py-1 text-sm">🗑</button>
              <button onClick={() => abrir(p)} className="text-zinc-600 text-sm">{sel?.id === p.id ? "▲" : "▼"}</button>
            </div>

            {sel?.id === p.id && (
              <div className="border-t border-zinc-100 p-4 space-y-3 bg-zinc-50">
                {cons.length === 0 && <p className="text-sm text-zinc-400">Sin consultas.</p>}
                {cons.map((c) => (
                  <ConsultaBlock key={c.id} c={c} onEditR={setEditR} onChanged={() => abrir({ ...p })} />
                ))}
              </div>
            )}
          </div>
        ))}
        {patients.length === 0 && <p className="text-zinc-400">No hay pacientes.</p>}
      </div>

      {editP && <EditarPacienteModal p={editP} onClose={() => setEditP(null)} onSaved={() => { setEditP(null); load(q); }} />}
      {editR && <EditarRecordModal r={editR} onClose={() => setEditR(null)} onSaved={() => { setEditR(null); if (sel) abrir({ ...sel }); }} />}
    </div>
  );
}

function ConsultaBlock({ c, onEditR }: { c: ConsultationRow; onEditR: (r: RecordRow) => void; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [recs, setRecs] = useState<RecordRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  async function toggle() {
    setOpen(!open);
    if (!loaded) {
      try { setRecs((await getConsultation(c.id)).records); setLoaded(true); } catch { /* */ }
    }
  }
  async function borrar(r: RecordRow) {
    if (!confirm(`¿Eliminar momento #${r.phase_num ?? ""}?`)) return;
    try { await deleteRecord(r.id); setRecs(recs.filter((x) => x.id !== r.id)); } catch (e) { alert(e); }
  }

  return (
    <div className="bg-white rounded-lg border border-zinc-200">
      <button onClick={toggle} className="w-full text-left p-3 text-sm flex flex-wrap justify-between gap-2">
        <span>Consulta #{c.id} · {fmtDateTime(c.started_at)}</span>
        <span className="text-zinc-500">
          {c.doctor_name ? `Dr(a). ${c.doctor_name}` : ""} · {fmtDuration(c.duration_seconds)} · {c.num_records} momento(s) {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-zinc-100 text-zinc-600">
              <tr><th className="text-left p-2">Hora</th><th className="text-left p-2">Momento</th>
                <th className="text-left p-2">PPG</th><th className="text-left p-2">Ansiedad</th><th className="p-2"></th></tr>
            </thead>
            <tbody>
              {recs.map((r) => (
                <tr key={r.id} className="border-t border-zinc-100">
                  <td className="p-2 whitespace-nowrap">{fmtDateTime(r.captured_at)}</td>
                  <td className="p-2">{momentoLabel(r.phase_num, r.phase_label)}</td>
                  <td className="p-2">{r.ppg ?? "—"}</td>
                  <td className="p-2"><span className={`px-2 py-0.5 rounded-full ${statusColor(r.status)}`}>{anxLabel(r.status)}</span></td>
                  <td className="p-2 whitespace-nowrap">
                    <button onClick={() => onEditR(r)} className="text-blue-600 px-1">✏️</button>
                    <button onClick={() => borrar(r)} className="text-red-600 px-1">🗑</button>
                  </td>
                </tr>
              ))}
              {recs.length === 0 && <tr><td colSpan={5} className="p-3 text-center text-zinc-400">Sin momentos.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EditarPacienteModal({ p, onClose, onSaved }: { p: Patient; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(p.name ?? "");
  const [code, setCode] = useState(p.code ?? "");
  const [age, setAge] = useState(p.age?.toString() ?? "");
  const [gender, setGender] = useState(p.gender ?? "M");
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    try {
      await updatePatient(p.id, { name, code, age: age ? Number(age) : null, gender });
      onSaved();
    } catch (e) { setErr(e instanceof Error ? e.message : "Error"); }
  }
  return (
    <Modal title="Editar paciente" onClose={onClose}>
      <Field label="Nombre"><input className="inp" value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <Field label="Código"><input className="inp" value={code} onChange={(e) => setCode(e.target.value)} /></Field>
      <Field label="Edad"><input className="inp" value={age} onChange={(e) => setAge(e.target.value)} inputMode="numeric" /></Field>
      <Field label="Género">
        <select className="inp" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="M">Masculino</option><option value="F">Femenino</option><option value="O">Otro</option>
        </select>
      </Field>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <ModalActions onClose={onClose} onSave={save} />
    </Modal>
  );
}

function EditarRecordModal({ r, onClose, onSaved }: { r: RecordRow; onClose: () => void; onSaved: () => void }) {
  const [status, setStatus] = useState(r.status ?? "a3");
  const [label, setLabel] = useState(r.phase_label ?? "");
  const [err, setErr] = useState<string | null>(null);
  async function save() {
    try { await updateRecord(r.id, { status, phase_label: label }); onSaved(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Error"); }
  }
  return (
    <Modal title={`Editar momento #${r.phase_num ?? ""}`} onClose={onClose}>
      <Field label="Nombre del momento"><input className="inp" value={label} onChange={(e) => setLabel(e.target.value)} /></Field>
      <Field label="Nivel de ansiedad">
        <select className="inp" value={status} onChange={(e) => setStatus(e.target.value)}>
          {ANX.map((a) => <option key={a} value={a}>{anxLabel(a)}</option>)}
        </select>
      </Field>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <ModalActions onClose={onClose} onSave={save} />
    </Modal>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-5 w-full max-w-sm space-y-3" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-semibold text-lg">{title}</h3>
        {children}
        <style>{`.inp{width:100%;border:1px solid #ccc;border-radius:8px;padding:8px}`}</style>
      </div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm"><span className="text-zinc-500">{label}</span>{children}</label>;
}
function ModalActions({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button onClick={onClose} className="px-3 py-1.5 rounded bg-zinc-200 text-sm">Cancelar</button>
      <button onClick={onSave} className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm">Guardar</button>
    </div>
  );
}
