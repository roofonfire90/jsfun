import { fetchJson } from "./base/apiClient.js";
import { BTC_EP } from "../constants/api_endpoints.js";
import ErrorMessages from "../constants/exception_messages.js";

export const fetchBTCRawSeries = async (startDate, endDate) => {
  const raw = await fetchJson(
    BTC_EP(startDate.getTime(), endDate.getTime())
  );

  if (!raw || raw.length === 0) {
    throw new Error(ErrorMessages.BTC_DATA_LOAD_FAIL);
  }

  return raw.map(kline => ({
    timestamp: new Date(kline[0]),
    value: Number(kline[4]),
  }));
};
