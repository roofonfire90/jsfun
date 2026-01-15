# DataVisualizer - Finanz- und Krypto-Datenvisualisierung

## 📋 Projektübersicht

**DataVisualizer** ist eine moderne Single-Page-Application (SPA) zur Visualisierung und Analyse von Finanzdaten, speziell Bitcoin (BTC) und MSCI World Index. Die Anwendung bietet interaktive Charts, aktuelle Krypto-News und einen Investment-Rechner mit deutscher und englischer Sprachunterstützung.

### Hauptfunktionen

- 📊 **Interaktive Datenvisualisierung** mit Highcharts
- 🔐 **Auth0-basierte Authentifizierung** mit Account-Freigabe
- 🌐 **Mehrsprachigkeit** (Deutsch/Englisch)
- 🎨 **Dark/Light Mode** mit Theme-Toggle
- 📰 **Echtzeit Krypto-News** mit Suche und Filterung
- 💰 **Investment-Kalkulator** für Gewinn/Verlust-Simulationen
- 🎠 **Hero-Carousel** mit automatischer Rotation
- 📱 **Responsive Design** für alle Bildschirmgrößen

---

## 🏗️ Architektur

### Tech Stack

- **Frontend Framework**: Vanilla JavaScript (ES6+)
- **Build Tool**: Vite 7.2.4
- **Charts**: Highcharts 12.4.0
- **Authentifizierung**: Auth0 SPA SDK
- **Styling**: Custom CSS mit CSS-Variablen
- **Deployment**: Docker + Nginx
- **API Proxy**: Eigener Proxy-Service für CORS-freie API-Anfragen

### Projektstruktur

```
alfa_js_data_visualization_page/
├── src/
│   ├── main.js                    # Einstiegspunkt
│   ├── api/                       # API-Clients
│   │   ├── apiProxyClient.js      # Zentraler Proxy-Client
│   │   ├── btcApi.js              # Bitcoin-Daten
│   │   ├── msciApi.js             # MSCI-World-Daten
│   │   └── newsApi.js             # News-Daten
│   ├── app/
│   │   ├── auth/
│   │   │   └── auth.js            # Auth0-Integration
│   │   └── toggles.js             # Theme & Language Toggle
│   ├── components/
│   │   ├── charts/                # Chart-Komponenten
│   │   │   ├── BTCChart.js
│   │   │   ├── MSCIChart.js
│   │   │   ├── ComparisonChart.js
│   │   │   └── ProfitLossChart.js
│   │   ├── hero/                  # Hero-Carousel
│   │   │   ├── HeroCarousel.js
│   │   │   ├── HeroDots.js
│   │   │   ├── HeroModal.js
│   │   │   └── HeroSlide.js
│   │   └── panels/                # Content-Panels
│   │       ├── financePanel.js
│   │       ├── newsPanel.js
│   │       └── tabs.js
│   ├── services/                  # Business Logic
│   │   ├── dataService.js         # Datenbeschaffung
│   │   ├── aggregationService.js  # Daten-Aggregation
│   │   ├── normalizationService.js # Index-Normalisierung
│   │   └── calculationService.js  # Investment-Berechnungen
│   ├── state/
│   │   └── store.js               # Zentraler State-Manager
│   ├── constants/
│   │   ├── api_endpoints.js       # API-Endpunkte
│   │   └── exception_messages.js  # Fehlermeldungen
│   └── styles/                    # CSS-Dateien
├── public/                        # Statische Assets
├── index.html                     # HTML-Template
├── vite.config.js                 # Vite-Konfiguration
├── Dockerfile                     # Container-Image
└── package.json                   # Dependencies
```

---

## 🚀 Installation & Setup

### Voraussetzungen

- Node.js 20 oder höher
- npm oder yarn
- Docker (optional, nur für Production)

### Lokale Entwicklung

1. **Repository klonen**
   ```bash
   cd alfa_js_data_visualization_page
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```
   Die Anwendung ist dann unter `http://localhost:5173` verfügbar.

4. **Build für Production**
   ```bash
   npm run build
   ```
   Erstellt optimierte Dateien im `dist/` Ordner.

5. **Preview des Production-Builds**
   ```bash
   npm run preview
   ```

---

## 🐳 Docker Deployment

### Docker Image bauen

```bash
docker build -t datavisualizer:latest .
```

### Container starten

```bash
docker run -p 80:80 datavisualizer:latest
```

Die Anwendung ist dann unter `http://localhost` erreichbar.

### Multi-Stage Build

Das Dockerfile nutzt einen Multi-Stage-Build für optimale Image-Größe:

1. **Build Stage**: Node.js 20 Alpine - Kompilierung mit Vite
2. **Runtime Stage**: Nginx Alpine - Serviert statische Dateien

---

## 🔐 Authentifizierung

### Auth0 Integration

Die Anwendung verwendet Auth0 für sichere Benutzerauthentifizierung:

- **Domain**: `jsfun.eu.auth0.com`
- **Client ID**: `rJ59QPQGJcEToOnMOqgaR3BSM91PRTq5`
- **Redirect URI**: `window.location.origin`
- **Cache**: LocalStorage mit Refresh Tokens

### Login-Flow

1. Beim ersten Besuch wird automatisch zur Auth0-Login-Seite weitergeleitet
2. Nach erfolgreicher Anmeldung wird der User zurück zur App geleitet
3. Bei nicht freigegebenen Accounts erscheint eine spezielle Fehlermeldung
4. Logout-Button in der Top-Bar ermöglicht Abmeldung

### Account-Freigabe

Falls ein Account noch nicht freigegeben wurde:
- Anzeige einer benutzerfreundlichen Fehlermeldung
- Option zum erneuten Login mit anderem Account
- Automatisches Löschen des Auth0-Caches

---

## 📊 Komponenten-Details

### 1. Finance Panel

**Datei**: `src/components/panels/financePanel.js`

#### Features
- Bitcoin-Preisverlauf (Rohdaten)
- MSCI World Index-Verlauf
- Vergleichschart (normalisiert auf Index 100)
- Investment-Rechner mit Slider
- Gewinn/Verlust-Visualisierung als Donut-Chart

#### Datenfluss
1. **Laden**: `loadBTCPriceSeries()` + `loadMSCIWorldSeries()`
2. **Alignment**: `alignSeriesByMSCIDates()` - Synchronisiert Zeitreihen
3. **Normalisierung**: `normalizeToIndex100()` - Für Vergleichbarkeit
4. **Rendering**: Highcharts-basierte Visualisierung

#### Investment-Kalkulator
- **Eingabe**: Investitionssumme via Slider (€500 - €50,000)
- **Berechnung**: Gewinn/Verlust für BTC vs. MSCI
- **Ausgabe**: Donut-Chart mit prozentualem Unterschied

### 2. News Panel

**Datei**: `src/components/panels/newsPanel.js`

#### Features
- Echtzeit Krypto-News von externen APIs
- Suchfunktion mit Live-Filter
- Sortierung nach Datum oder Quelle
- Lazy Loading mit Infinite Scroll
- Cache-Management für Performance

#### News-Store
**Datei**: `src/state/store.js`

Zentraler State für News-Verwaltung:
- Speichert geladene Artikel
- Verwaltet Suchbegriff und Sortierung
- Cached Daten im LocalStorage
- Observer-Pattern für reaktive Updates

### 3. Hero Carousel

**Datei**: `src/components/hero/HeroCarousel.js`

#### Features
- Automatische Rotation alle 6 Sekunden
- Pause bei Hover
- Dot-Navigation mit animiertem Progress
- Modal-Öffnung beim Klick auf Slides
- Infinite Loop

#### Slides
1. **Analyse**: Zugriff auf Finance-Panel
2. **News**: Zugriff auf News-Panel
3. **Über uns**: Zugriff auf About-Panel

### 4. Charts

Alle Charts nutzen **Highcharts** mit einheitlicher Konfiguration:

#### BTCChart.js
- Zeigt Bitcoin-Preis in USD
- Zeitreihe mit Datum/Wert-Paaren
- Responsive Verhalten
- Mehrsprachige Achsenbeschriftung

#### MSCIChart.js
- Zeigt MSCI World Index
- Ähnliche Konfiguration wie BTC-Chart
- Eigene Farbgebung

#### ComparisonChart.js
- Dual-Axis Chart für BTC + MSCI
- Normalisiert auf Index 100
- Ermöglicht direkten Performancevergleich

#### ProfitLossChart.js
- Donut-Chart für Investment-Ergebnisse
- Zeigt Gewinn/Verlust-Verteilung
- Interaktive Tooltips mit Euro-Beträgen

---

## 🎨 Theming & Styling

### Theme-System

**Datei**: `src/styles/theme.css`

Die Anwendung unterstützt zwei Themes:

#### Light Mode (Standard)
```css
--bg-primary: #ffffff
--text-primary: #1f2937
--accent: #3b82f6
```

#### Dark Mode
```css
--bg-primary: #1f2937
--text-primary: #f9fafb
--accent: #60a5fa
```

### Toggle-Funktionalität

**Datei**: `src/app/toggles.js`

- Theme-Toggle in der Top-Bar
- Speicherung der Präferenz im LocalStorage
- Automatisches Laden beim Neustart
- CSS-Klasse `.dark-mode` auf `<html>`

---

## 🌐 Internationalisierung (i18n)

### Unterstützte Sprachen

- 🇩🇪 Deutsch (Standard)
- 🇬🇧 Englisch

### Implementierung

**Datei**: `src/app/toggles.js`

Übersetzungen werden in einem zentralen Objekt gespeichert:

```javascript
const translations = {
  de: {
    "hero-analysis": "ANALYSE",
    "chart-btc-title": "Bitcoin Preis (USD)",
    // ...
  },
  en: {
    "hero-analysis": "ANALYSIS",
    "chart-btc-title": "Bitcoin Price (USD)",
    // ...
  }
};
```

### Sprachwechsel
- Toggle-Button in der Top-Bar
- Automatisches Re-Rendering aller Charts
- Persistierung im LocalStorage
- `data-i18n` Attribute im HTML

---

## 🔌 API-Integration

### Proxy-Architektur

**Problem**: Cross-Origin Resource Sharing (CORS)

**Lösung**: Eigener API-Proxy

#### Entwicklung
```javascript
// vite.config.js
proxy: {
  "/api": {
    target: "https://fun.dimla.info",
    changeOrigin: true
  }
}
```

Browser → `localhost:5173/api/proxy` → Vite Proxy → `https://fun.dimla.info/api/proxy`

#### Produktion
Browser → `https://fun.dimla.info/api/proxy` → Traefik → API-Proxy Service

### API-Endpunkte

**Datei**: `src/constants/api_endpoints.js`

- **Bitcoin**: `/api/proxy/btc`
- **MSCI World**: `/api/proxy/msci`
- **Crypto News**: `/api/proxy/news`

### Caching-Strategie

- **Memory Cache**: Verhindert doppelte Requests innerhalb einer Session
- **LocalStorage Cache**: Persistiert News-Daten zwischen Sessions
- **TTL**: News-Cache läuft nach 30 Minuten ab

---

## 📦 Services

### Data Service

**Datei**: `src/services/dataService.js`

Zentrale Stelle für Datenbeschaffung:
- Lädt BTC- und MSCI-Daten
- Implementiert Caching-Logik
- Fehlerbehandlung mit spezifischen Error-Messages

### Aggregation Service

**Datei**: `src/services/aggregationService.js`

Synchronisiert Zeitreihen:
- Filtert BTC-Daten nach MSCI-Daten (nur gemeinsame Daten)
- Erstellt konsistente Zeitreihen für Vergleiche

### Normalization Service

**Datei**: `src/services/normalizationService.js`

Normalisiert Daten auf Index 100:
- Erster Wert = 100
- Alle weiteren Werte relativ dazu
- Ermöglicht Performancevergleich unterschiedlicher Skalen

### Calculation Service

**Datei**: `src/services/calculationService.js`

Investment-Berechnungen:
- Berechnet hypothetische Returns
- Gewinn/Verlust-Simulation
- Dynamische Aktualisierung bei Slider-Änderung

---

## 🛠️ Error Handling

### Zentralisierte Fehlermeldungen

**Datei**: `src/constants/exception_messages.js`

```javascript
export default {
  BTC_DATA_LOAD_FAIL: "Bitcoin-Daten konnten nicht geladen werden.",
  MSCI_DATA_LOAD_FAIL: "MSCI-Daten konnten nicht geladen werden.",
  MISSING_BTC_CONTAINER: "BTC-Container nicht gefunden.",
  // ...
}
```

### Try-Catch-Blöcke

Alle kritischen Operationen sind abgesichert:
- API-Calls
- Chart-Rendering
- Data-Processing

### User-Feedback

- Loading-Spinner während Datenladung
- Fehlermeldungen in benutzerfreundlicher Sprache
- Graceful Degradation bei API-Ausfällen

---

## 🧪 Best Practices

### Code-Organisation

1. **Separation of Concerns**: Klare Trennung von API, Services, Components
2. **DRY Principle**: Wiederverwendbare Services und Utilities
3. **Single Responsibility**: Jede Datei hat eine klare Aufgabe
4. **Immutability**: Vermeidung von Side Effects

### Performance

1. **Lazy Loading**: News-Artikel werden stufenweise geladen
2. **Caching**: Mehrschichtiges Caching für API-Daten
3. **Debouncing**: Suchfunktion mit Verzögerung
4. **Code Splitting**: Vite splittet automatisch Chunks

### Sicherheit

1. **Auth0**: Professionelle Authentifizierung
2. **HTTPS**: Alle API-Calls verschlüsselt
3. **Content Security Policy**: In nginx.conf konfigurierbar
4. **No Credentials in Code**: Verwendung von Environment Variables

---

## 🔄 Deployment Pipeline

### Azure DevOps Integration

**Datei**: `azure-pipelines.yml`

Automatisierte CI/CD-Pipeline:
1. Docker Image Build
2. Push zu Container Registry
3. Deployment auf Azure Container Instances
4. Health Check

### Nginx-Konfiguration

**Datei**: `nginx.conf`

- SPA-Routing: Alle Requests → index.html
- Gzip-Kompression für Assets
- Cache-Headers für Performance
- Security Headers

---

## 📱 Responsive Design

### Breakpoints

- **Desktop**: > 1024px - Volle Funktionalität
- **Tablet**: 768px - 1024px - Optimiertes Layout
- **Mobile**: < 768px - Vereinfachte Navigation

### Mobile-First

- Touch-optimierte Buttons
- Swipe-Gesten für Carousel (geplant)
- Angepasste Chart-Größen

---

## 🐛 Debugging

### Browser DevTools

Logging ist aktiviert für:
- Auth-Status (`console.log("User:", user)`)
- API-Errors (`console.error`)
- State-Changes (in newsStore)

### Vite DevTools

- Hot Module Replacement (HMR)
- Source Maps für Debugging
- React DevTools kompatibel (falls später Framework gewechselt wird)

---

## 🔮 Zukünftige Erweiterungen

### Geplante Features

- [ ] Portfolio-Tracking mit mehreren Coins
- [ ] Export-Funktion für Charts (PNG/PDF)
- [ ] Push-Notifications für Preisalarme
- [ ] Vergleich mit weiteren Indizes (S&P 500, DAX)
- [ ] Historische Investment-Szenarien
- [ ] Social Sharing von Charts
- [ ] Watchlist-Funktion
- [ ] Mobile App (React Native)

### Technische Verbesserungen

- [ ] Migration zu TypeScript
- [ ] Unit Tests (Jest/Vitest)
- [ ] E2E Tests (Playwright)
- [ ] PWA-Funktionalität (Offline-Modus)
- [ ] Lighthouse Score Optimierung
- [ ] Accessibility (WCAG 2.1 AA)

---

## 👥 Mitwirkende

Dieses Projekt wurde im Rahmen der **Projektwoche 1** an der **Alfa Business Academy** entwickelt.

---

## 📄 Lizenz

Dieses Projekt ist für Bildungszwecke erstellt worden.

---

## 🆘 Support & Kontakt

Bei Fragen oder Problemen:
1. GitHub Issues erstellen
2. Dokumentation konsultieren
3. Code-Kommentare lesen

---

## 🙏 Danksagungen

- **Highcharts** für die exzellente Chart-Bibliothek
- **Auth0** für die sichere Authentifizierung
- **Vite** für das blitzschnelle Build-Tool
- **CoinGecko/CryptoCompare** für die API-Daten

---

**Version**: 0.0.0  
**Letztes Update**: Januar 2026  
**Status**: ✅ Production Ready
