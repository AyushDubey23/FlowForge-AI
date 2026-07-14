import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { workspaceId, amount = 1499 } = await req.json(); // ₹1499 INR default Pro Plan
    
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId === "PLACEHOLDER_KEY" || keySecret === "PLACEHOLDER_SECRET") {
      // Return a simulated mock order ID if Razorpay keys are not configured yet
      // This allows immediate visual/functional preview of checkout modal!
      return NextResponse.json({
        success: true,
        isMock: true,
        orderId: `order_mock_${Math.random().toString(36).substring(2, 12)}`,
        amount: amount * 100,
        currency: "INR",
      });
    }

    // Call real Razorpay REST API
    const authString = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify({
        amount: amount * 100, // Amount in paisa
        currency: "INR",
        receipt: `receipt_${workspaceId}_${Date.now()}`,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Razorpay Order creation failed: ${errText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      isMock: false,
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
    });
  } catch (err: any) {
    console.error("Razorpay order API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
