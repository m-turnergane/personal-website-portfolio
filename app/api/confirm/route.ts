import { NextResponse } from "next/server";
import { confirmSubscriber } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://muhammadgane.com";

  if (!token) {
    return NextResponse.redirect(siteUrl);
  }

  try {
    const subscriber = await confirmSubscriber(token);

    if (subscriber) {
      return NextResponse.redirect(`${siteUrl}?subscribed=true`);
    }

    return NextResponse.redirect(`${siteUrl}?subscribed=already`);
  } catch (error) {
    console.error("Confirm error:", error);
    return NextResponse.redirect(siteUrl);
  }
}
