import { defineConfig } from "vite";

/**
 * ============================================================
 * Vite Dev-Server – Proxy zum Produktions-API-Proxy
 * ============================================================
 *
 * DEV:
 *   Browser → localhost:5173/api/proxy
 *          → Vite Proxy
 *          → https://fun.dimla.info/api/proxy
 *
 * PROD:
 *   Browser → https://fun.dimla.info/api/proxy
 *          → Traefik → website-api-proxy
 *
 * Ergebnis:
 * - identischer Client-Code
 * - identische Request-URLs
 * - keine CORS-Probleme
 */
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://fun.dimla.info",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
