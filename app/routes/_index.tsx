import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigation, useRevalidator } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { CryptoGrid } from "~/components/CryptoGrid";
import { DashboardControls } from "~/components/DashboardControls";
import { ThemeToggle } from "~/components/ThemeToggle";
import { useCryptoOrder } from "~/hooks/useCryptoOrder";
import { useTheme } from "~/hooks/useTheme";
import { fetchCryptoRates } from "~/lib/coinbase.server";
import {
  AUTO_REFRESH_STORAGE_KEY,
  CRYPTOCURRENCIES,
  type CryptoRate,
  filterCryptos,
} from "~/lib/crypto";

export const meta: MetaFunction = () => {
  return [
    { title: "Crypto Dashboard" },
    {
      name: "description",
      content: "Live cryptocurrency exchange rates from Coinbase",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const forceError = url.searchParams.get("error") === "1";

  if (forceError) {
    throw new Response("Unable to load rates from Coinbase.", { status: 503 });
  }

  try {
    const symbols = CRYPTOCURRENCIES.map((crypto) => crypto.symbol);
    const ratesBySymbol = await fetchCryptoRates(symbols);

    const rates: CryptoRate[] = CRYPTOCURRENCIES.map((crypto) => {
      const rate = ratesBySymbol[crypto.symbol];
      return {
        ...crypto,
        usdRate: rate?.usdRate ?? "0",
        btcRate: rate?.btcRate ?? "0",
      };
    });

    return json({
      rates,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch exchange rates.";
    throw new Response(message, { status: 502 });
  }
}

const AUTO_REFRESH_INTERVAL_MS = 60_000;

export default function IndexRoute() {
  const { rates, fetchedAt } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const revalidator = useRevalidator();
  const { theme, toggleTheme } = useTheme();
  const { orderedRates, handleDragEnd } = useCryptoOrder(rates);
  const [filter, setFilter] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(AUTO_REFRESH_STORAGE_KEY);
    if (stored === "true") {
      setAutoRefresh(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      AUTO_REFRESH_STORAGE_KEY,
      autoRefresh ? "true" : "false"
    );
  }, [autoRefresh]);

  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = window.setInterval(() => {
      if (revalidator.state === "idle") {
        revalidator.revalidate();
      }
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [autoRefresh, revalidator]);

  const filteredRates = useMemo(
    () => filterCryptos(orderedRates, filter),
    [orderedRates, filter]
  );

  const isRefreshing =
    navigation.state === "loading" || revalidator.state === "loading";

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="page-header__eyebrow">Coinbase live rates</p>
          <h1>Crypto Dashboard</h1>
          <p className="page-header__subtitle">
            Track USD and BTC spot prices, filter the list, and drag cards to
            reorder.
          </p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <DashboardControls
        filter={filter}
        onFilterChange={setFilter}
        onRefresh={() => revalidator.revalidate()}
        isRefreshing={isRefreshing}
        autoRefresh={autoRefresh}
        onAutoRefreshChange={setAutoRefresh}
        fetchedAt={fetchedAt}
      />

      {isRefreshing && rates.length === 0 ? (
        <div className="loading-state" role="status" aria-live="polite">
          <div className="loading-state__spinner" aria-hidden="true" />
          <p>Loading exchange rates…</p>
        </div>
      ) : (
        <CryptoGrid
          cryptos={filteredRates}
          onReorder={handleDragEnd}
          isReorderEnabled={filter.trim().length === 0}
        />
      )}
    </main>
  );
}
