/**
 * ============================================================
 * Zentrale Fehlernachrichten
 * ============================================================
 *
 * Zweck:
 * - Einheitliche, sprechende Fehlermeldungen
 * - Keine hartcodierten Strings in Services oder Components
 *
 * Konventionen:
 * - Keys sind SCREAMING_SNAKE_CASE
 * - Messages sind für Entwickler / Logs gedacht
 * - UI-spezifische Texte können später ausgelagert werden (i18n)
 */

const ErrorMessages = {
  // ----------------------------------------------------------
  // MSCI World Daten
  // ----------------------------------------------------------
  MSCI_DATA_LOAD_FAIL:
    "MSCI World Daten konnten nicht geladen werden",

  MSCI_SET_TIMEFRAME_FAIL:
    "MSCI World Zeitrahmen konnte nicht bestimmt werden",

  // ----------------------------------------------------------
  // Bitcoin Daten
  // ----------------------------------------------------------
  BTC_DATA_LOAD_FAIL:
    "Bitcoin Preisdaten konnten nicht geladen werden",

  // ----------------------------------------------------------
  // Datenaggregation / Zeitachsen-Symmetrie
  // ----------------------------------------------------------
  ALIGNED_SERIES_NO_DATA_POINTS:
    "Nach dem Zeitachsen-Abgleich sind keine gemeinsamen Datenpunkte vorhanden",

  ALIGNMENT_ERROR_NO_DATA_POINTS:
    "Beide Zeitreihen müssen mindestens einen Datenpunkt enthalten",

  ALIGNMENT_WARNING_POINT_COUNT_MISMATCH:
    "Warnung beim Datenabgleich: Anzahl der Datenpunkte unterscheidet sich",

  // ----------------------------------------------------------
  // DOM / Container
  // ----------------------------------------------------------
  MISSING_BTC_CONTAINER:
    "Container '#bitcoin-chart' wurde im DOM nicht gefunden",

  MISSING_MSCI_CONTAINER:
    "Container '#msci-chart' wurde im DOM nicht gefunden",

  MISSING_COMPARISON_CONTAINER:
    "Container '#comparison-chart' wurde im DOM nicht gefunden",
};

export default ErrorMessages;
