import https from "https";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

  try {
    const agent = new https.Agent({
      rejectUnauthorized: false
    })
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
    console.log("sem tady");
    const loginData = await loginResponse.json();
    const token = loginData.accessToken;
    const body = await request.json();
    const response = await fetch(process.env.K2_BASE_URL_CREATE!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
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
            name: "Currency",
            value: {
              className: "TCurrencyDM",
              fieldValues: [
                {
                  name: "RID",
                  value: 539027531,
                },
                {
                  name: "Abbr",
                  value: "Kč",
                },
              ],
            },
          },
          {
            name: "Description",
            value: body.popis,
          },
          {
            name: "ShippingMethodId",
            value: {
              className: "TShippingMethodDM",
              fieldValues: [
                {
                  name: "Id",
                  value: 159,
                },
              ],
            },
          },
          {
            name: "CostCentreId",
            value: {
              className: "TCostCentreCollectionDocumentDM",
              fieldValues: [
                {
                  name: "Id",
                  value: 131,
                },
              ],
            },
          },
          {
            name: "BusinessYearId",
            value: {
              className: "TBusinessYearDM",
              fieldValues: [
                {
                  name: "Id",
                  value: 126,
                },
              ],
            },
          },
          {
            name: "TransportMethodRID",
            value: {
              className: "TTransportMethodDM",
              fieldValues: [
                {
                  name: "RID",
                  value: 34,
                },
              ],
            },
          },
          {
            name: "ContractCodeRID",
            value: {
              className: "TContractCodeDocumentDM",
              fieldValues: [
                {
                  name: "RID",
                  value: 1,
                },
              ],
            },
          },
          {
            name: "OrderForm",
            value: {
              className: "FormOfOrder",
              fieldValues: [
                {
                  name: "Id",
                  value: 26,
                },
              ],
            },
          },
        ],
      }),
    })
    const text = await response.text();
    if (!response.ok) {
      return NextResponse.json(
        {
          error: "K2 create zakázky selhal",
          status: response.status,
          response: text,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({
      ok: true,
      response: text,
    });
  } catch (error) {

    return NextResponse.json(
      {
        error: "Serverová chyba",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


