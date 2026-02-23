import { NextResponse } from "next/server";
import { getConfirmedSubscribersByCategory } from "@/lib/db";
import { sendNotificationEmail } from "@/lib/email";
import { COLLECTION_TO_CATEGORY } from "@/lib/categories";

const COLLECTION_TO_ROUTE: Record<string, string> = {
  writing: "writing",
  trading: "trading-lab",
  automation: "automation",
  projects: "projects",
};

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.NOTIFY_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { collection, slug, title, summary } = await request.json();

    if (!collection || !slug || !title) {
      return NextResponse.json(
        { error: "collection, slug, and title are required." },
        { status: 400 }
      );
    }

    const category = COLLECTION_TO_CATEGORY[collection];
    if (!category) {
      return NextResponse.json(
        { error: `Unknown collection: ${collection}` },
        { status: 400 }
      );
    }

    const routePrefix = COLLECTION_TO_ROUTE[collection] || collection;
    const subscribers = await getConfirmedSubscribersByCategory(category);

    if (subscribers.length === 0) {
      return NextResponse.json({
        sent: 0,
        message: "No subscribers for this category.",
      });
    }

    const results = await Promise.allSettled(
      subscribers.map((sub) =>
        sendNotificationEmail(
          sub.email,
          sub.confirm_token,
          category,
          title,
          summary || "",
          slug,
          routePrefix
        )
      )
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({ sent, failed, total: subscribers.length });
  } catch (error) {
    console.error("Notify error:", error);
    return NextResponse.json(
      { error: "Failed to send notifications." },
      { status: 500 }
    );
  }
}
