import { NextResponse } from "next/server";
import crypto from "crypto";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      workspaceId,
      isMock = false,
    } = await req.json();

    if (!workspaceId) {
      return NextResponse.json({ success: false, error: "Workspace ID is required" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Handle Mock Sandbox Mode signature verification
    if (isMock || !keySecret || keySecret === "PLACEHOLDER_SECRET") {
      // Direct Firestore Provisioning for demo runs
      const wsRef = doc(db, "workspaces", workspaceId);
      await updateDoc(wsRef, {
        tier: "pro",
        subscriptionStatus: "active",
      });

      return NextResponse.json({
        success: true,
        message: "Demo Upgrade complete! (Sandbox Mode)",
      });
    }

    // Verify actual Razorpay Signature
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ success: false, error: "Signature verification failed" }, { status: 400 });
    }

    // Provision Pro Tier inside Firestore
    const wsRef = doc(db, "workspaces", workspaceId);
    await updateDoc(wsRef, {
      tier: "pro",
      subscriptionStatus: "active",
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Pro subscription successfully activated!",
    });
  } catch (err: any) {
    console.error("Razorpay verification API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
