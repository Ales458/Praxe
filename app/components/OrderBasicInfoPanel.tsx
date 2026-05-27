type OrderBasicInfoPanelProps = {
    selectedItem: any | null;
    getField: (item: any, fieldName: string) => any;
    getPartnerName: (item: any) => string;
    getCurrency: (item: any) => string;
};

export default function OrderBasicInfoPanel({
    selectedItem,
    getField,
    getPartnerName,
    getCurrency,
}: OrderBasicInfoPanelProps) {
    if (!selectedItem) {
        return null;
    }

    const doklad = getField(selectedItem, "DocumentIdentificationCalc");
    const firma = getPartnerName(selectedItem);
    const popis = getField(selectedItem, "Description") || "-";
    const netto = getField(selectedItem, "AmountNetC");
    const mena = getCurrency(selectedItem);

    return (
        <aside className="w-80 rounded border border-slate-300 bg-slate-50 text-sm shadow-sm">
            <div className="border-b border-slate-300 bg-slate-200 px-4 py-3">
                <h2 className="font-semibold">Zakázka {doklad}</h2>
            </div>

            <div className="p-4">
                <h3 className="mb-3 border-b border-slate-300 pb-2 font-semibold">
                    Základní údaje
                </h3>

                <div className="space-y-2">
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Firma:</span>
                        <span className="text-right font-medium">{firma}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Popis:</span>
                        <span className="text-right">{popis}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Částka:</span>
                        <span className="text-right font-medium">
                            {Number(netto).toLocaleString("cs-CZ")} {mena}
                        </span>
                    </div>

                    <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Měna:</span>
                        <span className="text-right">{mena}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}