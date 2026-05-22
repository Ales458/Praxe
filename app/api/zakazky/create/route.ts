import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {

    
    const body = await request.json();
    
    const LoginResponse = await fetch(process.env.K2_BASE_URL + "/token/login", {
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


    const loginData = await LoginResponse.json();

    const token = loginData.accessToken;

    const k2Response = await fetch(
      "https://k2demo.abis.cz:55302/V25K2_API_DEMO/Data/TSalesOrderDM",
      {
        method: "POST",
        headers: {
          Authorization: `bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          className: "TSalesOrderDM",
          fieldValues: [
            {
              name: "TradingPartnerId",
              value: {
                className: "TTradingPartnerDM",
                fieldValues: [
                  {
                    name: "Id",
                    value: Number(body.tradingPartnerId),
                  },
                ],
              },
            },
            {
              name: "Description",
              value: body.popis,
            },
            {
              name: "AmountNetC",
              value: Number(body.castka),
            },
            {name: "ConfirmationCanceledIdCalc", value: "multiConfirmed_green"},
            
          ],
        }),
      }
    );

    const text = await k2Response.text();
    return NextResponse.json({
      k2Status: k2Response.status,
      k2Ok: k2Response.ok,
      k2Response: text,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "create route spadla",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}