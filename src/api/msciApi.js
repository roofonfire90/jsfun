import { fetchJson } from "./base/apiClient.js";
import { MSCI_EP } from "../constants/api_endpoints.js";
import ErrorMessages from "../constants/exception_messages.js";

/**
 * Lädt rohe MSCI-World-Indexdaten und mappt sie auf eine Zeitreihe.
 *
 * @returns {Array<{ timestamp: Date, value: number }>}
 */
export const fetchMSCIRawSeries = async () => {
    const raw = await fetchJson(MSCI_EP);

    if (!raw?.chart?.result?.length) {
        throw new Error(ErrorMessages.MSCI_DATA_LOAD_FAIL);
    }

    const result = raw.chart.result[0];
    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;

    // Mapping: Yahoo-Finance-Response => interne Zeitreihe
    return timestamps
        .map((ts, i) => ({
        timestamp: new Date(ts * 1000),
        value: closes[i],
        }))
        .filter(p => p.value !== null);
};
