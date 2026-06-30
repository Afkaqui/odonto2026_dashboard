import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Salida standalone para empaquetar en Docker (despliegue en el VPS).
  output: "standalone",
};

export default nextConfig;
