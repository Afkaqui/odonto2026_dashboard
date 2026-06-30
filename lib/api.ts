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
  phase: string | null;
  status: string | null;
  source: string | null;
  consultation_id: string;
  paciente_code: string | null;
  doctor_name: string | null;
  doctor_lastname: string | null;
};

export type Summary = { ok: boolean; counts: Counts; ultimos_registros: RecordRow[] };

export type ConsultationRow = {
  id: string;
  paciente_code: string | null;
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
