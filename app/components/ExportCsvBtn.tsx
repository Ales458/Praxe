
"use client";

type ExportCsvBtnProps = {
  items: any[];
  getField: (item: any, fieldName: string) => any;
  getPartnerName: (item: any) => string;
  getCurrency: (item: any) => string;
};

export default function ExportCsvBtn({
  items,
  getField,
  getPartnerName,
  getCurrency,
}: ExportCsvBtnProps) {
  const exportToCsv = () => {
    const rows = items.map((item) => ({
      Firma: getPartnerName(item),
      Doklad: getField(item, "DocumentIdentificationCalc") ?? "",
      Popis: getField(item, "Description") ?? "",
      Castka: getField(item, "AmountNetC") ?? "",
      Mena: getCurrency(item),
    }));

    const header = ["Firma", "Doklad", "Popis", "Castka", "Mena"];

    const csv = [
      header.join(";"),
      ...rows.map((row) =>
        header
          .map((key) => {
            const value = row[key as keyof typeof row];
            return String(value);
          })
          .join(";")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "zakazky.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={exportToCsv}
      className="ml-3 rounded bg-slate-700 px-1 py-2 text-sm font-medium text-white hover:bg-slate-800"
    >
      Export do CSV
    </button>
  );
}