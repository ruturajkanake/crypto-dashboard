import { describe, expect, it } from "vitest";
import {
  filterCryptos,
  mergeOrder,
  sortByOrder,
  type CryptoRate,
} from "~/lib/crypto";

const sampleRates: CryptoRate[] = [
  { symbol: "BTC", name: "Bitcoin", usdRate: "90000", btcRate: "1" },
  { symbol: "ETH", name: "Ethereum", usdRate: "3000", btcRate: "0.03" },
  { symbol: "SOL", name: "Solana", usdRate: "150", btcRate: "0.0016" },
];

describe("filterCryptos", () => {
  it("returns all rates when the query is empty", () => {
    expect(filterCryptos(sampleRates, "")).toEqual(sampleRates);
  });

  it("filters by symbol case-insensitively", () => {
    expect(filterCryptos(sampleRates, "eth")).toEqual([sampleRates[1]]);
  });

  it("filters by partial name", () => {
    expect(filterCryptos(sampleRates, "sol")).toEqual([sampleRates[2]]);
  });
});

describe("sortByOrder", () => {
  it("orders rates according to the saved symbol list", () => {
    const ordered = sortByOrder(sampleRates, ["SOL", "BTC", "ETH"]);
    expect(ordered.map((rate) => rate.symbol)).toEqual(["SOL", "BTC", "ETH"]);
  });
});

describe("mergeOrder", () => {
  it("keeps known symbols and appends new ones", () => {
    expect(mergeOrder(["ETH", "BTC"], ["BTC", "ETH", "SOL"])).toEqual([
      "ETH",
      "BTC",
      "SOL",
    ]);
  });
});
