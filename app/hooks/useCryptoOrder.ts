import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CRYPTOCURRENCIES,
  type CryptoRate,
  mergeOrder,
  readStoredOrder,
  sortByOrder,
  writeStoredOrder,
} from "~/lib/crypto";

interface UseCryptoOrderResult {
  orderedRates: CryptoRate[];
  setOrder: Dispatch<SetStateAction<string[]>>;
  handleDragEnd: (activeId: string, overId: string | null) => void;
}

export function useCryptoOrder(rates: CryptoRate[]): UseCryptoOrderResult {
  const defaultOrder = useMemo(
    () => CRYPTOCURRENCIES.map((crypto) => crypto.symbol),
    []
  );

  const [order, setOrder] = useState<string[]>(() => {
    const stored = readStoredOrder();
    return mergeOrder(stored ?? defaultOrder, defaultOrder);
  });

  useEffect(() => {
    writeStoredOrder(order);
  }, [order]);

  const orderedRates = useMemo(
    () => sortByOrder(rates, order),
    [rates, order]
  );

  const handleDragEnd = useCallback((activeId: string, overId: string | null) => {
    if (!overId || activeId === overId) return;

    setOrder((current) => {
      const oldIndex = current.indexOf(activeId);
      const newIndex = current.indexOf(overId);
      if (oldIndex === -1 || newIndex === -1) return current;

      const next = [...current];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      return next;
    });
  }, []);

  return { orderedRates, setOrder, handleDragEnd };
}
