"use client";

import { useEffect, useState } from "react";
import ExportCsvBtn from "./components/ExportCsvBtn";
import ConfirmedLock from "./components/ConfirmedLock";
import OrderNavigation from "./components/OrderNavigation";
import AddZakazkaForm from "./components/AddZakazkaForm";
import OrderBasicInfoPanel from "./components/OrderBasicInfoPanel";


type SortColumn = "firma" | "doklad" | "castka" | "měna" | "popis";
type SortDirection = "asc" | "desc";

export default function Home() {

  const [items, setItems] = useState<any[]>([]);

  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const [selectedindex, setSelectedIndex] = useState<number | null>(null);

  const [firmaFilter, setFirmaFilter] = useState("");
  const [dokladFilter, setDokladFilter] = useState("");
  const [castkaFilter, setCastkaFilter] = useState("");
  const [měnaFilter, setMěnaFilter] = useState("");
  const [popisFilter, setPopisFilter] = useState("");


  const [sortColumn, setSortColumn] = useState<SortColumn>("firma");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");


  useEffect(() => {
    fetch("/api/zakazky")
      .then((res) => res.json())
      .then((json) => {
        const loadedItems = json.data.items;

        setItems(loadedItems);
        setSelectedItem(loadedItems[0] ?? null);
      });

  }, []);

  const getField = (item: any, fieldName: string) => {
    return item.fieldValues.find((f: any) => f.name === fieldName)?.value;
  };

  const getPartnerName = (item: any) => {
    const partnerObj = getField(item, "TradingPartnerId");
    return (
      partnerObj?.fieldValues?.find((f: any) => f.name === "Name")?.value ??
      partnerObj?.fieldValues?.find((f: any) => f.name === "Abbr")?.value ??
      ""
    );
  };

  const getCurrency = (item: any) => {
    const currency = getField(item, "Currency");

    return (
      currency?.fieldValues?.find((f: any) => f.name === "Abbr")?.value ??
      currency?.fieldValues?.find((f: any) => f.name === "Name")?.value ??
      ""
    );
  };

  const filteredItems = items.filter((item) => {
    const firma = getPartnerName(item);
    const doklad = getField(item, "DocumentIdentificationCalc") ?? "";
    const castka = getField(item, "AmountNetC") ?? "";
    const měna = getCurrency(item);
    const popis = getField(item, "Description") ?? "";

    return (
      (firma.toLowerCase().includes(firmaFilter.toLowerCase()) &&
        String(doklad).toLowerCase().includes(dokladFilter.toLowerCase()) &&
        String(castka).toLowerCase().includes(castkaFilter.toLowerCase()) &&
        String(měna).toLowerCase().includes(měnaFilter.toLowerCase()) &&
        String(popis).toLowerCase().includes(popisFilter.toLowerCase())
      ));
  });


  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };



  const getSortArrow = (column: SortColumn) => {
    if (sortColumn !== column) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const sortedItems = [...filteredItems].sort((a, b) => {
    const firmaA = getPartnerName(a);
    const firmaB = getPartnerName(b);
    const dokladA = String(getField(a, "DocumentIdentificationCalc") ?? "");
    const dokladB = String(getField(b, "DocumentIdentificationCalc") ?? "");
    const castkaA = Number(getField(a, "AmountNetC") ?? 0);
    const castkaB = Number(getField(b, "AmountNetC") ?? 0);
    const měnaA = getCurrency(a);
    const měnaB = getCurrency(b);
    const popisA = String(getField(a, "Description") ?? "");
    const popisB = String(getField(b, "Description") ?? "");
    let result = 0;

    if (sortColumn === "firma") {
      result = firmaA.localeCompare(firmaB, "cs");
    }
    if (sortColumn === "doklad") {
      result = dokladA.localeCompare(dokladB, "cs", { numeric: true });
    }
    if (sortColumn === "castka") {
      result = castkaA - castkaB;
    }
    if (sortColumn === "měna") {
      result = měnaA.localeCompare(měnaB, "cs");
    }
    if (sortColumn === "popis") {
      result = popisA.localeCompare(popisB, "cs");
    }
    return sortDirection === "asc" ? result : -result;
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (sortedItems.length === 0) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();

        setSelectedIndex((current) => {
          if (current === null) return 0;
          return Math.min(current + 1, sortedItems.length - 1);
        });
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();

        setSelectedIndex((current) => {
          if (current === null) return 0;
          return Math.max(current - 1, 0);
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sortedItems.length]);

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl rounded-lg bg-white shadow">
        <div className="border-b border-slate-200 px-6 py-4">
          <h1 className="text-2xl font-semibold">Zakázky</h1>

        </div>

        <div className="flex items-center gap-3">

          <OrderNavigation
            items={sortedItems}
            selectedIndex={selectedindex}
            setSelctedIndex={setSelectedIndex}
          />


          <AddZakazkaForm
            onCreated={async () => {
              const refreshed = await fetch("/api/zakazky");
              const refreshedJson = await refreshed.json();

              setItems(refreshedJson.data.items);
            }}
          />


          <ExportCsvBtn
            items={sortedItems}
            getField={getField}
            getPartnerName={getPartnerName}
            getCurrency={getCurrency}
          />

        </div>
        <div className="flex">
          <div className="relative max-h-[70vh] overflow-auto px-6 bg-white">
            <table className="w-full border-separate border-spacing-0 text-sm">

              <thead className="sticky top-0 z-50 bg-white">
                <tr className="bg-white">
                  <th className="border border-slate-300 px-2 py-2">
                    <input
                      value={firmaFilter}
                      onChange={(e) => setFirmaFilter(e.target.value)}
                      placeholder="Filtrovat firmu"
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm outline-none focus:border-blue-500"
                    />
                  </th>
                  <th className="border border-slate-300 px-2 py-2">
                    <input
                      value={dokladFilter}
                      onChange={(e) => setDokladFilter(e.target.value)}
                      placeholder="Filtrovat doklad"
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm outline-none focus:border-blue-500"
                    />
                  </th>

                  <th className="border border-slate-300 px-2 py-2">
                    <input
                      value={castkaFilter}
                      onChange={(e) => setCastkaFilter(e.target.value)}
                      placeholder="Filtrovat částku"
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm outline-none focus:border-blue-500"
                    />
                  </th>


                  <th className="border border-slate-300 px-2 py-2">
                    <input
                      value={měnaFilter}
                      onChange={(e) => setMěnaFilter(e.target.value)}
                      placeholder="Filtrovat měnu"
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm outline-none focus:border-blue-500"
                    />
                  </th>



                  <th className="border border-slate-300 px-2 py-2">
                    <input
                      value={popisFilter}
                      onChange={(e) => setPopisFilter(e.target.value)}
                      placeholder="Filtrovat popis"
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm outline-none focus:border-blue-500"
                    />
                  </th>

                </tr>
                <tr className="bg-slate-200">
                  <th
                    onClick={() => handleSort("firma")} className="border border-slate-300 px-4 py-2 text-left cursor-pointer">
                    Firma {getSortArrow("firma")}
                  </th>
                  <th
                    onClick={() => handleSort("doklad")} className="border border-slate-300 px-4 py-2 text-left cursor-pointer">
                    Doklad {getSortArrow("doklad")}
                  </th>
                  <th
                    onClick={() => handleSort("castka")} className="border border-slate-300 px-4 py-2 text-right cursor-pointer">
                    Částka {getSortArrow("castka")}
                  </th>
                  <th
                    onClick={() => handleSort("měna")} className="border border-slate-300 px-4 py-2 text-left cursor-pointer">
                    Měna {getSortArrow("měna")}
                  </th>

                  <th
                    onClick={() => handleSort("popis")} className="border border-slate-300 px-4 py-2 text-left cursor-pointer">
                    Popis {getSortArrow("popis")}
                  </th>
                </tr>

              </thead>

              <tbody>

                {sortedItems.map((item, index) => {
                  const firma = getPartnerName(item);
                  const doklad = getField(
                    item,
                    "DocumentIdentificationCalc"
                  );
                  const confirmed = getField(item, "ConfirmedOrCanceledIdCalc");
                  const castka = getField(item, "AmountNetC");
                  const měna = getCurrency(item);
                  const popis = getField(item, "Description") ?? "";
                  return (
                    <tr
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={`cursor-pointer ${selectedindex === index
                        ? "bg-blue-200"
                        : index % 2 === 0
                          ? "bg-white"
                          : "bg-slate-50"
                        } hover:bg-blue-100`}
                    >
                      <td>{firma}</td>

                      <td>
                        <ConfirmedLock value={confirmed} />
                        {doklad}
                      </td>

                      <td>{Number(castka).toLocaleString("cs-CZ")}</td>

                      <td>{měna}</td>

                      <td>{popis}</td>
                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>
          <OrderBasicInfoPanel
            selectedItem={selectedindex !== null ? sortedItems[selectedindex] : null}
            getField={getField}
            getPartnerName={getPartnerName}
            getCurrency={getCurrency}
          />
        </div>


        <div className="border-t border-slate-200 px-6 py-3 text-sm text-slate-500">
          Počet záznamů: {sortedItems.length}/{items.length}
        </div>
      </div>
    </main>
  );
}







