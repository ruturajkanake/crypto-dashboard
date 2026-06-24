import type { CryptoRate } from "~/lib/crypto";
import { formatBtcRate, formatUsdRate } from "~/lib/format";

interface CryptoCardProps {
  crypto: CryptoRate;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
}

export function CryptoCard({
  crypto,
  dragHandleProps,
  isDragging = false,
}: CryptoCardProps) {
  return (
    <article
      className={`crypto-card${isDragging ? " crypto-card--dragging" : ""}`}
      aria-label={`${crypto.name} (${crypto.symbol})`}
    >
      <header className="crypto-card__header">
        <div>
          <h2 className="crypto-card__name">{crypto.name}</h2>
          <p className="crypto-card__symbol">{crypto.symbol}</p>
        </div>
        <button
          type="button"
          className="crypto-card__drag-handle"
          aria-label={`Reorder ${crypto.name}`}
          disabled={!dragHandleProps}
          title={
            dragHandleProps
              ? "Drag to reorder"
              : "Clear the filter to reorder cards"
          }
          {...dragHandleProps}
        >
          ⠿
        </button>
      </header>

      <dl className="crypto-card__rates">
        <div>
          <dt>USD</dt>
          <dd>{formatUsdRate(crypto.usdRate)}</dd>
        </div>
        <div>
          <dt>BTC</dt>
          <dd>{formatBtcRate(crypto.btcRate, crypto.symbol)}</dd>
        </div>
      </dl>
    </article>
  );
}
