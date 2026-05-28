"use client";

type OrderNavigationProps = {
    items: any[];
    selectedIndex: number | null;
    setSelctedIndex: (index: number) => void;
};

export default function OrderNavigation({
    items,
    selectedIndex,
    setSelctedIndex,
}: OrderNavigationProps) {
    const buttonCLass = "rounded border border-slate-300 bg-white px-1 py-0.5 text-[11px] leading-4  hover:bg-slate-100"
    const goFirst = () => {
        if (items.length > 0) {
            setSelctedIndex(0);
        }
    };

    const goPrevious = () => {
        if (selectedIndex !== null && selectedIndex > 0) {
            setSelctedIndex(selectedIndex - 1);
        }
    };

    const goNext = () => {
        if (selectedIndex !== null && selectedIndex < items.length - 1) {
            setSelctedIndex(selectedIndex + 1);
        }
    };

    const goLast = () => {
        if (items.length > 0) {
            setSelctedIndex(items.length - 1);
        }
    };

    return (
        <div className="flex items-center gap-1">
            <button
                type="button"
                onClick={goFirst}
                className={buttonCLass}
            >
                ↑↑
            </button>

            <button
                type="button"
                onClick={goPrevious}
                className={buttonCLass}
            >
                ↑
            </button>

            <button
                type="button"
                onClick={goNext}
                className={buttonCLass}
            >
                ↓
            </button>

            <button
                type="button"
                onClick={goLast}
                className={buttonCLass}
            >
                ↓↓
            </button>
        </div>
    );
}

