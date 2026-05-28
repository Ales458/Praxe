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
        console.log(JSON.stringify({
            tradingPartnerId: 20,
            firma,
            doklad,
            castka,
            mena,
            popis,
        }));
        const response = await fetch("/api/zakazky/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                tradingPartnerId: 20,
                firma,
                doklad,
                castka,
                mena,
                popis,
            }),
        });
        if (!response.ok) {
            console.error(await response.text());
            alert("Nepodařilo se vytvořit zakázku");
            return;
        }

        setFirma("");
        setDoklad("");
        setCastka("");
        setMena("Kč");
        setPopis("");
        setShowForm(false);
        onCreated();
    };

    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
                Přidat zakázku
            </button>

            {showForm && (

                <div className="flex items-center gap-2">

                    <input
                        value={firma}
                        onChange={(e) => setFirma(e.target.value)}
                        placeholder="Firma"
                        className="rounded border border-slate-300 px-1 py-1 text-sm"
                    />

                    <input

                        value={doklad}
                        onChange={(e) => setDoklad(e.target.value)}
                        placeholder="Doklad"
                        className="rounded border border-slate-300 px-2 py-1 text-sm"
                    />

                    <input
                        value={castka}
                        onChange={(e) => setCastka(e.target.value)}
                        placeholder="Částka"
                        className="rounded border border-slate-300 px-2 py-1 text-sm"
                    />

                    <input
                        value={mena}
                        onChange={(e) => setMena(e.target.value)}
                        placeholder="Měna"
                        className="rounded border border-slate-300 px-2 py-1 text-sm"
                    />

                    <input
                        value={popis}
                        onChange={(e) => setPopis(e.target.value)}
                        placeholder="Popis"
                        className="rounded border border-slate-300 px-2 py-1 text-sm"
                    />

                    <button
                        type="button"
                        onClick={addZakazka}
                        className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                    >

                        Uložit

                    </button>
                </div>
            )}
        </div>
    );
}
