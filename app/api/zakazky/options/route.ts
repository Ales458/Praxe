import https from "https";

import { NextResponse } from "next/server";

function getField(item: any, fieldName: string) {
    return item.fieldValues?.find((f: any) => f.name === fieldName)?.value;
}

function getPartnerName(item: any) {
    const partner = getField(item, "TradingPartnerId");
    return (
        partner?.fieldValues?.find((f: any) => f.name === "Name")?.value ??
        partner?.fieldValues?.find((f: any) => f.name === "Abbr")?.value ??
        ""
    );
}
function getCurrency(item: any) {
    const currency = getField(item, "Currency");
    return (
        currency?.fieldValues?.find((f: any) => f.name === "Abbr")?.value ??
        currency?.fieldValues?.find((f: any) => f.name === "Name")?.value ??
        ""
    );

}

function getDoklad(item: any) {
    return getField(item, "DocumentIdentificationCalc") ?? "";
}

export async function GET() {
    try {
        const agent = new https.Agent({
            rejectUnauthorized: false,
        });

        const loginResponse = await fetch(`${process.env.K2_BASE_URL}/token/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },

            body: JSON.stringify({
                username: process.env.K2_USERNAME,
                password: process.env.K2_PASSWORD,
            }),
        });

        const loginData = await loginResponse.json();
        const token = loginData.accessToken;
        const response = await fetch(process.env.K2_BASE_URL_CREATE!, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `bearer ${token}`,
            },
            // @ts-ignore
            agent,
        });

        const data = await response.json();
        const items = data.data?.items ?? data.items ?? [];
        const firmy = Array.from(
            new Set(
                items
                    .map((item: any) => getPartnerName(item))
                    .filter((value: string) => value.trim() !== "")
            )
        );

        const meny = Array.from(
            new Set(
                items
                    .map((item: any) => getCurrency(item))
                    .filter((value: string) => value.trim() !== "")
            )
        );
        const doklady = Array.from(
            new Set(
                items
                    .map((item: any) => getDoklad(item))
                    .filter((value: string) => String(value).trim() !== "")
            )
        );
        return NextResponse.json({
            firmy,
            meny,
            doklady,
        });
    } catch (error) {

        return NextResponse.json(
            {
                error: "Nepodařilo se načíst options",
                detail: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}