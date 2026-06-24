const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const btcFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
});

export function formatUsdRate(value: string): string {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "—";

  if (numeric >= 1) {
    return usdFormatter.format(numeric);
  }

  return usdFormatter.format(numeric);
}

export function formatBtcRate(value: string, symbol: string): string {
  if (symbol === "BTC") return "1 BTC";

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "—";

  return `${btcFormatter.format(numeric)} BTC`;
}

export function formatUpdatedAt(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(isoDate));
}
