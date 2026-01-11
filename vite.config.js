import { defineConfig } from "vite";

/**
 * ============================================================
 * Vite Dev-Server – Proxy-Konfiguration
 * ============================================================
 *
 * Zweck:
 * - Umgehung von CORS-Beschränkungen im Entwicklungsmodus
 * - Simulation von Server-to-Server-Requests
 *
 * Wichtige Hinweise:
 * - Diese Proxies sind AUSSCHLIESSLICH für Development gedacht
 * - In Produktion müssen externe APIs über ein eigenes Backend
 *   oder einen dedizierten Proxy angebunden werden
 *
 * Hintergründe:
 * - Yahoo Finance blockiert direkte Browser-Requests (CORS)
 * - Binance ist für serverseitige Nutzung konzipiert und
 *   erlaubt keine sicheren Frontend-Calls
 */
export default defineConfig({
  server: {
    proxy: {
      // --------------------------------------------------------
      // Yahoo Finance (MSCI World Daten)
      // --------------------------------------------------------
      "/yahoo": {
        target: "https://query2.finance.yahoo.com",
        changeOrigin: true,
        secure: true,
        // Entfernt das lokale Prefix vor Weiterleitung
        rewrite: (path) => path.replace(/^\/yahoo/, ""),
      },

      // --------------------------------------------------------
      // Binance API (Bitcoin Preisdaten)
      // --------------------------------------------------------
      "/api/binance": {
        target: "https://api.binance.com",
        changeOrigin: true,
        secure: true,
        // Entfernt das lokale Prefix vor Weiterleitung
        rewrite: (path) => path.replace(/^\/api\/binance/, ""),
      },
    },
  },
});
