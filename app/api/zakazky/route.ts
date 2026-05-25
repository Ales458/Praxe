import { NextResponse } from "next/server";

export async function GET() {
  const loginResponse = await fetch(process.env.K2_BASE_URL + "/token/login", {
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

  const ordersResponse = await fetch(
    process.env.K2_BASE_URL + "/Data/TSalesOrderDM?fields=TradingPartnerId,DocumentIdentificationCalc,AmountNetC,Currency,Description,ConfirmedOrCanceledIdCalc&conditions=TradingPartnerId;GE;0&pageSize=1000",
    {
      method: "GET",
      headers: {
        Authorization: `bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  const text = await ordersResponse.text();

  return new NextResponse(text, {
    status: ordersResponse.status,
    headers: {
      "Content-Type": ordersResponse.headers.get("content-type") ?? "application/json",
    },
  });
}

//export async function PUT() {
  //return NextResponse.json({ message: "Not implemented" }, { status: 501 });    
//}