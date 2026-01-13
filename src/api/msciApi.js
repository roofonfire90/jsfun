import { fetchJson } from "./base/apiClient.js";
import { MSCI_EP } from "../constants/api_endpoints.js";
import ErrorMessages from "../constants/exception_messages.js";

export const fetchMSCIRawSeries = async () => {
  const raw = await fetchJson(MSCI_EP);

  if (!raw?.chart?.result?.length) {
    throw new Error(ErrorMessages.MSCI_DATA_LOAD_FAIL);
  }

  const result = raw.chart.result[0];
  const timestamps = result.timestamp;
  const closes = result.indicators.quote[0].close;

  return timestamps
    .map((ts, i) => ({
      timestamp: new Date(ts * 1000),
      value: closes[i],
    }))
    .filter(p => p.value !== null);
};
