import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CryptoCard } from "~/components/CryptoCard";
import type { CryptoRate } from "~/lib/crypto";

interface SortableCryptoCardProps {
  crypto: CryptoRate;
  isReorderEnabled: boolean;
}

function SortableCryptoCard({ crypto, isReorderEnabled }: SortableCryptoCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: crypto.symbol, disabled: !isReorderEnabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="crypto-grid__item">
      <CryptoCard
        crypto={crypto}
        isDragging={isDragging}
        dragHandleProps={
          isReorderEnabled ? { ...attributes, ...listeners } : undefined
        }
      />
    </div>
  );
}

interface CryptoGridProps {
  cryptos: CryptoRate[];
  onReorder: (activeId: string, overId: string | null) => void;
  isReorderEnabled?: boolean;
}

export function CryptoGrid({
  cryptos,
  onReorder,
  isReorderEnabled = true,
}: CryptoGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isReorderEnabled) return;
    const { active, over } = event;
    onReorder(String(active.id), over ? String(over.id) : null);
  };

  if (cryptos.length === 0) {
    return (
      <div className="empty-state" role="status">
        <p>No cryptocurrencies match your filter.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={cryptos.map((crypto) => crypto.symbol)}
        strategy={rectSortingStrategy}
      >
        <div className="crypto-grid">
          {cryptos.map((crypto) => (
            <SortableCryptoCard
              key={crypto.symbol}
              crypto={crypto}
              isReorderEnabled={isReorderEnabled}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
