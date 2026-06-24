interface CoinbaseSpotResponse {
  data: {
    amount: string;
    base: string;
    currency: string;
  };
}

async function fetchSpotPrice(from: string, to: string): Promise<string> {
  const response = await fetch(
    `https://api.coinbase.com/v2/prices/${from}-${to}/spot`,
    {
      headers: { Accept: "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${from}-${to}: ${response.statusText}`);
  }

  const payload = (await response.json()) as CoinbaseSpotResponse;
  return payload.data.amount;
}

export async function fetchCryptoRates(
  symbols: string[]
): Promise<Record<string, { usdRate: string; btcRate: string }>> {
  const entries = await Promise.all(
    symbols.map(async (symbol) => {
      if (symbol === "BTC") {
        const usdRate = await fetchSpotPrice("BTC", "USD");
        return [symbol, { usdRate, btcRate: "1" }] as const;
      }

      const [usdRate, btcRate] = await Promise.all([
        fetchSpotPrice(symbol, "USD"),
        fetchSpotPrice(symbol, "BTC"),
      ]);

      return [symbol, { usdRate, btcRate }] as const;
    })
  );

  return Object.fromEntries(entries);
}
