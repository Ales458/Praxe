"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/zakazky")
      .then((res) => res.json())
      .then((json) => {
        setItems(json.data.items);
      });
  }, []);

  const filteredItems = items.filter((item) => {
    const rid = item.fieldValues.find((f: any) => f.name === "RID")?.value || "";
    const doklad = item.fieldValues.find((f: any) => f.name === "DocumentIdentificationCalc")?.value || "";
    const castka = item.fieldValues.find((f: any) => f.name === "AmountNetC")?.value || "";
    
    return `${rid} ${doklad} ${castka}`.toLowerCase().includes(search.toLowerCase());

  });
  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl rounded-lg bg-white shadow">
        <div className="border-b border-slate-200 px-6 py-4">
          <h1 className="text-2xl font-semibold">Zakázky Čokoládovny</h1>
          <p className="text-sm text-slate-500">
            Výpis dat z K2 API
          </p>
      </div>

      <div className="px-6 py-4">
        <input
         type="text"
         placeholder="Hledat podle ID, dokladu nebo částky..."
         value={search}
         onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
      </div>

      <div className="overflow-x-auto">

          <table className="w-full border-collapse text-sm">

            <thead className="bg-slate-200">

              <tr>

                
                <th className="border border-slate-300 px-4 py-2 text-left">ID</th>
                <th className="border border-slate-300 px-4 py-2 text-left">Doklad</th>
                <th className="border border-slate-300 px-4 py-2 text-left">Částka</th>
              </tr>

            </thead>
            <tbody>
              {filteredItems.map((item, index) => {
                const id = item.fieldValues.find((f: any) => f.name === "RID")?.value;
                const doklad = item.fieldValues.find(
                  (f: any) => f.name === "DocumentIdentificationCalc"
                )?.value;
                const castka = item.fieldValues.find(
                  (f: any) => f.name === "AmountNetC"
                )?.value;
                return (
                  <tr
                    key={index}
                    className="odd:bg-white even:bg-slate-50 hover:bg-blue-50"
                  >
                    <td className="border border-slate-200 px-4 py-2">{id}</td>
                    <td className="border border-slate-200 px-4 py-2 font-medium">
                      {doklad}
                    </td>
                    <td className="border border-slate-200 px-4 py-2 text-right">
                      {Number(castka).toLocaleString("cs-CZ")} Kč
                    </td>
                    
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200 px-6 py-3 text-sm text-slate-500">
          Počet záznamů: {items.length}
        </div>
      </div>
    </main>
  );
}

  

