export default function DescargarPage() {
  const driveUrl =
    "https://drive.google.com/drive/folders/1TOVzREP0nK8wxGKc0jnY55fGgax0CjkU";
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Descargar la app</h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 text-center space-y-5">
        <div className="text-6xl">📲</div>
        <div>
          <h2 className="text-lg font-semibold">Pulsera PPG (Android)</h2>
          <p className="text-sm text-zinc-500 mt-1">
            App para registrar las atenciones con la pulsera. Instala el APK desde
            la carpeta de Google Drive.
          </p>
        </div>

        <a
          href={driveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-xl transition"
        >
          ⬇️ Ir a la descarga (Google Drive)
        </a>

        <p className="text-xs text-zinc-400 break-all">{driveUrl}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        <p className="font-medium mb-1">Instrucciones</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Abre el enlace y descarga el archivo <code>app-release.apk</code>.</li>
          <li>En Android, permite “instalar apps de orígenes desconocidos”.</li>
          <li>Abre el APK e instálalo.</li>
          <li>Requiere Bluetooth para conectar la pulsera (o usa el modo simulado).</li>
        </ol>
      </div>
    </div>
  );
}
