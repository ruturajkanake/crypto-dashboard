export interface Cryptocurrency {
  symbol: string;
  name: string;
}

export interface CryptoRate extends Cryptocurrency {
  usdRate: string;
  btcRate: string;
}

export const CRYPTOCURRENCIES: Cryptocurrency[] = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "ADA", name: "Cardano" },
  { symbol: "DOT", name: "Polkadot" },
  { symbol: "AVAX", name: "Avalanche" },
  { symbol: "MATIC", name: "Polygon" },
  { symbol: "LINK", name: "Chainlink" },
  { symbol: "UNI", name: "Uniswap" },
  { symbol: "ATOM", name: "Cosmos" },
  { symbol: "XRP", name: "Ripple" },
  { symbol: "DOGE", name: "Dogecoin" },
];

export const ORDER_STORAGE_KEY = "crypto-dashboard:order";
export const THEME_STORAGE_KEY = "crypto-dashboard:theme";
export const AUTO_REFRESH_STORAGE_KEY = "crypto-dashboard:auto-refresh";

export type Theme = "light" | "dark";

export function filterCryptos(rates: CryptoRate[], query: string): CryptoRate[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return rates;

  return rates.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(normalized) ||
      crypto.symbol.toLowerCase().includes(normalized)
  );
}

export function sortByOrder(rates: CryptoRate[], order: string[]): CryptoRate[] {
  const orderMap = new Map(order.map((symbol, index) => [symbol, index]));

  return [...rates].sort((a, b) => {
    const aIndex = orderMap.get(a.symbol);
    const bIndex = orderMap.get(b.symbol);

    if (aIndex === undefined && bIndex === undefined) {
      return a.symbol.localeCompare(b.symbol);
    }
    if (aIndex === undefined) return 1;
    if (bIndex === undefined) return -1;
    return aIndex - bIndex;
  });
}

export function mergeOrder(currentOrder: string[], symbols: string[]): string[] {
  const known = currentOrder.filter((symbol) => symbols.includes(symbol));
  const missing = symbols.filter((symbol) => !known.includes(symbol));
  return [...known, ...missing];
}

export function readStoredOrder(): string[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return null;
  }
}

export function writeStoredOrder(order: string[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
}

export function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  return value === "light" || value === "dark" ? value : null;
}

export function writeStoredTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}
