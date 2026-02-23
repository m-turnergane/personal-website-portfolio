import { NextResponse } from "next/server";
import { unsubscribeByToken } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new NextResponse("Missing token.", { status: 400 });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://muhammadgane.com";

  try {
    const subscriber = await unsubscribeByToken(token);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subscriber ? "Unsubscribed" : "Already Unsubscribed"}</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="text-align:center;padding:48px 24px;">
    <h1 style="color:#fafafa;font-size:24px;font-weight:600;letter-spacing:-0.02em;margin:0 0 12px;">
      ${subscriber ? "You've been unsubscribed" : "Already unsubscribed"}
    </h1>
    <p style="color:#71717a;font-size:15px;line-height:1.6;margin:0 0 24px;">
      ${subscriber ? "You won't receive any more notifications." : "This link has already been used."}
    </p>
    <a href="${siteUrl}" style="display:inline-block;padding:10px 24px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#fafafa;text-decoration:none;border-radius:8px;font-size:14px;">
      Back to site
    </a>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return new NextResponse("Something went wrong.", { status: 500 });
  }
}
