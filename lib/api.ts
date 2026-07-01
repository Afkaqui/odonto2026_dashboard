// Cliente del API de la pulsera (entorno laboratorio: key embebida en cliente).
const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://pulsera.lucyscan.com";
const KEY = process.env.NEXT_PUBLIC_API_KEY ?? "";

async function get<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    headers: { "X-API-Key": KEY },
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json() as Promise<T>;
}

async function del(path: string): Promise<void> {
  const r = await fetch(`${BASE}${path}`, {
    method: "DELETE",
    headers: { "X-API-Key": KEY },
    cache: "no-store",
  });
  if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.error || `HTTP ${r.status}`); }
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: { "X-API-Key": KEY, "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
  return j as T;
}

// ---- Tipos ----
export type Counts = {
  doctores: string;
  pacientes: string;
  pulseras: string;
  consultas_total: string;
  consultas_hoy: string;
  registros_hoy: string;
  registros_total: string;
};

export type RecordRow = {
  id: string;
  captured_at: string;
  ppg: number | null;
  phase_num: number | null;
  phase_label: string | null;
  status: string | null;
  source: string | null;
  consultation_id: string;
  paciente_code: string | null;
  paciente_name: string | null;
  doctor_name: string | null;
  doctor_lastname: string | null;
};

export type Summary = { ok: boolean; counts: Counts; ultimos_registros: RecordRow[] };

export type ConsultationRow = {
  id: string;
  paciente_code: string | null;
  paciente_name: string | null;
  paciente_edad: number | null;
  doctor_name: string | null;
  doctor_lastname: string | null;
  pulsera_code: string | null;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  num_records: string;
};

export type SessionResp = { ok: boolean; date: string; total: number; consultas: ConsultationRow[] };

export type Patient = {
  id: string; code: string | null; name: string | null;
  age: number | null; gender: string | null; consultas?: string; created_at: string;
};

export type Bracelet = { id: string; code: string | null; type: string | null; created_at: string };
export type Doctor = { id: string; name: string; lastname: string; username: string; created_at: string };

// ---- Llamadas ----
export const getSummary = () => get<Summary>("/api/dashboard/summary");
export const getSession = (date?: string) =>
  get<SessionResp>(`/api/dashboard/session${date ? `?date=${date}` : ""}`);
export const getBracelets = () => get<{ bracelets: Bracelet[] }>("/api/bracelets");
export const getDoctors = () => get<{ doctors: Doctor[] }>("/api/doctors");
export const getConsultation = (id: string) =>
  get<{ consultation: ConsultationRow; records: RecordRow[] }>(`/api/consultations/${id}`);
export const deleteRecord = (id: string) => del(`/api/records/${id}`);
export const updateRecord = (id: string, body: { status?: string; phase_label?: string; phase_num?: number }) =>
  patch(`/api/records/${id}`, body);

// Gestión de pacientes
export const getPatients = (q?: string) =>
  get<{ patients: Patient[] }>(`/api/patients${q ? `?q=${encodeURIComponent(q)}` : ""}`);
export const getPatientDetail = (id: string) =>
  get<{ patient: Patient; consultations: ConsultationRow[] }>(`/api/patients/${id}`);
export const updatePatient = (id: string, body: Partial<Patient>) =>
  patch(`/api/patients/${id}`, body);
export const deletePatient = (id: string) => del(`/api/patients/${id}`);
