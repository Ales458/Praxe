"use client";

import { get } from "http";
import { useEffect, useState } from "react";
//import { PUT } from "./api/zakazky/route";

type SortColumn = "firma" | "doklad" | "castka" | "měna" | "popis";
type SortDirection = "asc" | "desc";

export default function Home() {

  const [items, setItems] = useState<any[]>([]);

  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  
  const [firmaFilter, setFirmaFilter] = useState("");
  const [dokladFilter, setDokladFilter] = useState("");
  const [castkaFilter, setCastkaFilter] = useState("");
  const [měnaFilter, setMěnaFilter] = useState("");
  const [popisFilter, setPopisFilter] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [newFirma, setNewFirma] = useState("");
  const [newDoklad, setNewDoklad] = useState("");
  const [newCastka, setNewCastka] = useState("");
  const [newMěna, setNewMěna] = useState("CZK");
  const [newPopis, setNewPopis] = useState("");

  const [sortColumn, setSortColumn] = useState<SortColumn>("firma");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");


  useEffect(() => {
    fetch("/api/zakazky", {method: "GET"})
      .then((res) => res.json())
      .then((json) => {
        setItems(json.data.items);
      });
  }, []);
  //fetch("/api/zakazky", {method: "PUT"});


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
      (firma.toLowerCase().includes(firmaFilter.toLowerCase())  &&
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

  const addZakázka = async () => {
    const response = await fetch("/api/zakazky/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tradingPartnerId: 20,
        doklad: newDoklad,
        castka: newCastka,
        měna: newMěna,
        popis: newPopis,
      }),
    });

    if (!response.ok) {
      console.error(await response.text());
      alert("Nepodařilo se vytvořit zakázku");
      return;
    }

    alert("Zakázka vytvořena");

    const refreshed = await fetch("/api/zakazky");
    const refreshedJson = await refreshed.json();

    setItems(refreshedJson.data.items);

    setNewFirma("");
    setNewDoklad("");
    setNewCastka("");
    setNewMěna("CZK");
    setNewPopis("");

    setShowForm(false);
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

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl rounded-lg bg-white shadow">
        <div className="border-b border-slate-200 px-6 py-4">
          <h1 className="text-2xl font-semibold">Zakázky</h1>
          <p className="text-sm text-slate-500">
            Výpis dat z K2 API
          </p>
      </div>

      <div className="border-b border-slate-200 px-6 py-4">
  <button
    type="button"
    onClick={() => setShowForm(!showForm)}
    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
  >
    Přidat zakázku
  </button>

  {showForm && (
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-5">
      <input
        value={newFirma}
        onChange={(e) => setNewFirma(e.target.value)}
        placeholder="Firma"
        className="rounded border border-slate-300 px-3 py-2"
      />

      <input
        value={newDoklad}
        onChange={(e) => setNewDoklad(e.target.value)}
        placeholder="Doklad"
        className="rounded border border-slate-300 px-3 py-2"
      />

      <input
        value={newCastka}
        onChange={(e) => setNewCastka(e.target.value)}
        placeholder="Částka"
        className="rounded border border-slate-300 px-3 py-2"
      />

      <input
        value={newMěna}
        onChange={(e) => setNewMěna(e.target.value)}
        placeholder="Měna"
        className="rounded border border-slate-300 px-3 py-2"
      />

      <input
        value={newPopis}
        onChange={(e) => setNewPopis(e.target.value)}
        placeholder="Popis"
        className="rounded border border-slate-300 px-3 py-2"
      />

      <button
        type="button"
        onClick={addZakázka}
        className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
      >
        Uložit zakázku
      </button>
    </div>
  )}
</div>

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
                 onClick ={() => handleSort("firma")} className="border border-slate-300 px-4 py-2 text-left cursor-pointer">
                  Firma {getSortArrow("firma")}
                </th>
                <th
                 onClick ={() => handleSort("doklad")} className="border border-slate-300 px-4 py-2 text-left cursor-pointer">
                  Doklad {getSortArrow("doklad")}
                </th>
                <th
                 onClick ={() => handleSort("castka")} className="border border-slate-300 px-4 py-2 text-right cursor-pointer">
                  Částka {getSortArrow("castka")}
                </th>
                  <th
                  onClick={() => handleSort("měna")} className="border border-slate-300 px-4 py-2 text-left cursor-pointer">
                    Měna {getSortArrow("měna")}
                    </th>
                  
                <th
                 onClick ={() => handleSort("popis")} className="border border-slate-300 px-4 py-2 text-left cursor-pointer">
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
                const castka = getField(item, "AmountNetC");
                const měna = getCurrency(item);
                const popis = getField(item, "Description") ?? "";
                return (
                  <tr
                    key={index}
                    className="odd:bg-white even:bg-slate-50 hover:bg-blue-50"
                  >
                    <td className="border border-slate-200 px-4 py-2">
                      {firma}
                    </td>
                    <td className="border border-slate-200 px-4 py-2 font-medium">
                      {doklad}
                    </td>
                    <td className="border border-slate-200 px-4 py-2 text-right">
                      {Number(castka).toLocaleString("cs-CZ")} Kč
                    </td>
                      <td className="border border-slate-200 px-4 py-2">
                      {měna}
                    </td>
                    <td className="border border-slate-200 px-4 py-2">
                      {popis}
                    </td>
                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200 px-6 py-3 text-sm text-slate-500">
          Počet záznamů: {sortedItems.length}/{items.length}
        </div>
      </div>
    </main>
  );
}





  

