"use client";

type OrderNavigationProps = {
    items: any[];
    selectedItem: any | null;
    setSelectedItem: (item: any | null) => void;

};

export default function OrderNavigation({
    items,
    selectedItem,
    setSelectedItem,
}: OrderNavigationProps) {
    const selectedIndex = selectedItem ? items.indexOf(selectedItem) : -1;

    const goFirst = () => {
        if (items.length > 0) setSelectedItem(items[0]);
    };

    const goPrevious = () => {
        if (selectedIndex > 0) setSelectedItem(items[selectedIndex - 1]);
    };

    const goNext = () => {
        if (selectedIndex < items.length - 1) setSelectedItem(items[selectedIndex + 1]);
    };

    const goLast = () => {
        if (items.length > 0) setSelectedItem(items[items.length - 1]);
    };

    return (
        <div className="flex gap-2">
      <button
        type="button"
        onClick={goFirst}
        className="rounded border border-slate-300 bg-white px-1 py-1 hover:bg-slate-100"
        >
        ↑ První
      </button>
      <button
        type= "button"
        onClick={goPrevious}
        className="rounded border border-slate-300 bg-white px-1 py-1 hover:bg-slate-100"
      >
        ↑ Předchozí
      </button>
      <button
        type="button"
        onClick={goNext}
        className="rounded border border-slate-300 bg-white px-1 py-1 hover:bg-slate-100"
        >
        ↓ Další
      </button>
      <button
        type="button"
        onClick={goLast}
        className="rounded border border-slate-300 bg-white px-1 py-1 hover:bg-slate-100"
      >
        ↓ Poslední
      </button>
    </div>
    );
}