import { NextResponse } from "next/server";

export async function GET() {
    const baseUrl = process.env.K2_BASE_URL;
    const username = process.env.K2_USERNAME;
    const password = process.env.K2_PASSWORD;
    if (!baseUrl || !username || !password) {
        return NextResponse.json(
            { error: "Chybí něco v konfiguraci prostředí K2 nebo v env.local" },
            { status: 500 }
        );
    }
    
    const response = await fetch(`${baseUrl}/token/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
              accept: "application/json",
        },
        body: JSON.stringify({ username: username, password: password})
    });

    const text = await response.text();

    return new NextResponse(text, {
        status: response.status,
        headers: {
            "Content-Type": response.headers.get("Content-Type") ?? "application/json",
        },
    });
}