const VERSION = "v1.1.0";
const FOLDER_URL =
  "https://drive.google.com/drive/folders/1TOVzREP0nK8wxGKc0jnY55fGgax0CjkU";

const APKS = [
  {
    titulo: "Celulares actuales (recomendado)",
    archivo: "pulsera-ppg-v1.1.0-arm64.apk",
    tam: "18.3 MB",
    detalle: "Para la gran mayoría de celulares Android (arm64). Empieza por este.",
    url: "https://drive.google.com/file/d/1H9MaPfFTcspVm6aGKUAF3UBzc4AW2Ie7/view",
    destacado: true,
  },
  {
    titulo: "Celulares antiguos",
    archivo: "pulsera-ppg-v1.1.0-armv7.apk",
    tam: "15.7 MB",
    detalle: "Solo si el anterior dice “la app no es compatible” o no se instala (armv7).",
    url: "https://drive.google.com/file/d/1rMbrPs8z4_E-iY_2R08hBhD7L5DeG-0u/view",
    destacado: false,
  },
];

export default function DescargarPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-semibold">Descargar la app</h1>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          Pulsera PPG · {VERSION}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {APKS.map((a) => (
          <div
            key={a.archivo}
            className={`bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3 ${
              a.destacado ? "ring-2 ring-blue-600" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-3xl">{a.destacado ? "📲" : "📱"}</span>
              <div>
                <h2 className="font-semibold">{a.titulo}</h2>
                <p className="text-xs text-zinc-500">{a.tam}</p>
              </div>
            </div>
            <p className="text-sm text-zinc-600 flex-1">{a.detalle}</p>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-center font-medium px-4 py-2.5 rounded-xl transition ${
                a.destacado
                  ? "bg-blue-700 hover:bg-blue-800 text-white"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
              }`}
            >
              ⬇️ Descargar
            </a>
            <p className="text-[11px] text-zinc-400 break-all">{a.archivo}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        <p className="font-medium mb-1">Instrucciones</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Descarga el APK (en Drive, toca el ícono de descarga ⬇️ arriba a la derecha).</li>
          <li>En Android, permite “instalar apps de orígenes desconocidos”.</li>
          <li>Abre el APK e instálalo. Si ya tenías la app, se actualiza.</li>
          <li>Requiere Bluetooth para conectar la pulsera (o usa el modo simulado).</li>
        </ol>
      </div>

      <p className="text-center text-xs text-zinc-400">
        ¿No sabes cuál elegir? Usa el recomendado. Todas las versiones están en la{" "}
        <a href={FOLDER_URL} target="_blank" rel="noopener noreferrer" className="underline">
          carpeta de Drive
        </a>
        .
      </p>
    </div>
  );
}
