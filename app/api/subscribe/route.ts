import { NextResponse } from "next/server";
import { createSubscriber, getSubscriberByEmail } from "@/lib/db";
import { sendConfirmationEmail } from "@/lib/email";
import { VALID_CATEGORY_IDS } from "@/lib/categories";

export async function POST(request: Request) {
  try {
    const { email, categories } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: "Select at least one category." },
        { status: 400 }
      );
    }

    const validCategories = categories.filter((c: string) =>
      VALID_CATEGORY_IDS.includes(c)
    );

    if (validCategories.length === 0) {
      return NextResponse.json(
        { error: "Invalid categories." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await getSubscriberByEmail(normalizedEmail);
    if (existing?.confirmed && !existing.unsubscribed_at) {
      return NextResponse.json({ message: "already_subscribed" });
    }

    const token = crypto.randomUUID();
    await createSubscriber(normalizedEmail, validCategories, token);
    await sendConfirmationEmail(normalizedEmail, token, validCategories);

    return NextResponse.json({ message: "confirmation_sent" });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
