
"use client";

import { useState } from "react";

type AddZakazkaFormProps = {
    onCreated: () => void;

};
export default function AddZakazkaForm({
    onCreated,
}: AddZakazkaFormProps) {
    const [showForm, setShowForm] = useState(false);
    const [firma, setFirma] = useState("");
    const [doklad, setDoklad] = useState("");
    const [castka, setCastka] = useState("");
    const [mena, setMena] = useState("Kč");
    const [popis, setPopis] = useState("");
    const addZakazka = async () => {

        JSON.stringify({
            tradingPartnerId: 20,
            firma: "",
            doklad: "",
            castka: 123,
            mena: 123,
            popis,
        })

        const response = await fetch("/api/zakazky/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                tradingPartnerId: 20,
                firma: "",
                doklad: "",
                castka: 123,
                mena: 123,
                popis,
            }),
        });

        if (!response.ok) {
            console.log(await response.json());
            alert("Nepodařilo se vytvořit zakázku");
            return;
        }

        setFirma("");
        setDoklad("");
        setCastka("");
        setMena("");
        setPopis("");
        setShowForm(false);
        onCreated();
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setShowForm(true)}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
                Přidat zakázku
            </button>

            {showForm && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <h2 className="text-xl font-semibold">Nová zakázka</h2>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="rounded px-3 py-1 text-sm hover:bg-slate-100"
                            >
                                Zavřít
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                            <section>
                                <h3 className="mb-4 border-b border-slate-200 pb-2 font-semibold">
                                    Základní údaje
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Firma
                                        </label>
                                        <input
                                            value={firma}
                                            onChange={(e) => setFirma(e.target.value)}
                                            className="w-full rounded border border-slate-300 px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Doklad
                                        </label>
                                        <input
                                            value={doklad}
                                            onChange={(e) => setDoklad(e.target.value)}
                                            className="w-full rounded border border-slate-300 px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Popis
                                        </label>

                                        <input
                                            value={popis}
                                            onChange={(e) => setPopis(e.target.value)}
                                            className="w-full rounded border border-slate-300 px-3 py-2"
                                        />
                                    </div>
                                </div>
                            </section>
                            <section>
                                <h3 className="mb-4 border-b border-slate-200 pb-2 font-semibold">
                                    Ceny
                                </h3>
                                <div className="space-y-4">
                                    <div>

                                        <label className="mb-1 block text-sm font-medium">
                                            Částka
                                        </label>

                                        <input
                                            value={castka}
                                            onChange={(e) => setCastka(e.target.value)}
                                            className="w-full rounded border border-slate-300 px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Měna
                                        </label>
                                        <input
                                            value={mena}
                                            onChange={(e) => setMena(e.target.value)}
                                            className="w-full rounded border border-slate-300 px-3 py-2"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="rounded border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
                            >
                                Zrušit
                            </button>

                            <button
                                type="button"
                                onClick={addZakazka}
                                className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                            >
                                Uložit zakázku
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}