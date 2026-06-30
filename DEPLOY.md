# Despliegue del Dashboard — panel.lucyscan.com

Dashboard Next.js 16 que consume el API de la pulsera. Entorno de laboratorio:
la API key viaja al cliente (NEXT_PUBLIC_*).

## Local (desarrollo)
```bash
npm install
npm run dev        # http://localhost:3000  (usa .env.local)
```

## Producción en el VPS (subdominio propio)

### 0) DNS (lo haces tú en Cloudflare) — REQUERIDO
```
Tipo A   panel.lucyscan.com   →   161.132.54.226   (proxy naranja)
```
Sin este record, el subdominio no resuelve.

### 1) Subir el código al VPS
```bash
# desde local (PowerShell/git-bash), empaquetar sin node_modules/.next:
tar --exclude=node_modules --exclude=.next -czf panel.tar.gz .
pscp -pw <pass> panel.tar.gz kaqui@161.132.54.226:/home/kaqui/panel_dashboard/
ssh kaqui@161.132.54.226
cd ~/panel_dashboard && tar -xzf panel.tar.gz && rm panel.tar.gz
```

### 2) Crear .env (para que docker-compose pase los build args)
```bash
cat > ~/panel_dashboard/.env <<'EOF'
NEXT_PUBLIC_API_BASE=https://pulsera.lucyscan.com
NEXT_PUBLIC_API_KEY=87adb62feefa69cfb622b7b4dc28c61afb2b607598739047
EOF
```
> Usa la MISMA API_KEY que el backend (`~/pulsera_backend/.env`).

### 3) Construir y levantar (puerto host 3050)
```bash
cd ~/panel_dashboard
docker compose up -d --build
curl -I http://localhost:3050      # -> 200
```
> ⚠️ Bug docker-snap al re-desplegar: si `up` falla con
> `cannot stop container ... permission denied`, usar el workaround:
> `docker update --restart=no panel_dashboard` →
> `sudo kill -9 $(docker inspect --format '{{.State.Pid}}' panel_dashboard)` →
> `sudo docker rm panel_dashboard` → `docker compose up -d` →
> `docker rename <hash>_panel_dashboard panel_dashboard` →
> `docker update --restart=always panel_dashboard`.

### 4) Subdominio HTTPS
```bash
sudo kaqui-sites add panel panel.lucyscan.com 3050 origin
curl -I https://panel.lucyscan.com
```

## Notas
- Las NEXT_PUBLIC_* se incrustan en el build: si cambias la API key, hay que
  reconstruir la imagen (`docker compose build`).
- El dashboard refresca el resumen cada 10 s para supervisión en vivo.
