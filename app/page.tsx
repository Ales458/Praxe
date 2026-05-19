"use client";

import { useEffect, useState } from "react";
export default function Home() {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string>("");
  
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(
          "/api/zakazky",
          {
            method: "GET",
            headers: {
              Authorization: "api:",
              Accept: "application/json",
            },
          }
        );
        const text = await response.text();
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${text}`);
        }

        setData(JSON.parse(text));
      } catch (err) {
        setError((err instanceof Error ? err.message : "An unknown error occurred"));
      }
    }

    loadData();
  }, []);

  return (
    <main style= {{ padding: 24 }}>
      <h1>Otestuji Api</h1>
      {error && (
        <>
          <h2> Chyba</h2>
          <pre>{error}</pre>
        </>
      )}

      {data !== null && (
        <>
          <h2> Data z API </h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
      )}
    </main>
  );
}