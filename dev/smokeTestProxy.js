// src/dev/smokeTestProxy.js
import { apiProxyRequest } from "../src/api/apiProxyClient.js";

export async function runProxySmokeTest() {
  const data = await apiProxyRequest({
    method: "GET",
    url: "https://query2.finance.yahoo.com/v7/finance/quote?symbols=AAPL",
  });

  console.log("Proxy OK:", data);
}
