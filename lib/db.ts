import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.POSTGRES_URL!, { fullResults: true });

export interface Subscriber {
  id: string;
  email: string;
  categories: string[];
  confirmed: boolean;
  confirm_token: string;
  created_at: Date;
  updated_at: Date;
  unsubscribed_at: Date | null;
}

export async function createSubscriber(
  email: string,
  categories: string[],
  confirmToken: string
): Promise<Subscriber> {
  const { rows } = await sql`
    INSERT INTO subscribers (email, categories, confirm_token)
    VALUES (${email}, ${categories as any}, ${confirmToken})
    ON CONFLICT (email) DO UPDATE SET
      categories = EXCLUDED.categories,
      confirm_token = EXCLUDED.confirm_token,
      confirmed = FALSE,
      unsubscribed_at = NULL,
      updated_at = NOW()
    RETURNING *
  `;
  return rows[0] as Subscriber;
}

export async function getSubscriberByEmail(
  email: string
): Promise<Subscriber | null> {
  const { rows } = await sql`
    SELECT * FROM subscribers WHERE email = ${email}
  `;
  return (rows[0] as Subscriber) || null;
}

export async function confirmSubscriber(
  token: string
): Promise<Subscriber | null> {
  const { rows } = await sql`
    UPDATE subscribers
    SET confirmed = TRUE, updated_at = NOW()
    WHERE confirm_token = ${token} AND confirmed = FALSE
    RETURNING *
  `;
  return (rows[0] as Subscriber) || null;
}

export async function unsubscribeByToken(
  token: string
): Promise<Subscriber | null> {
  const { rows } = await sql`
    UPDATE subscribers
    SET unsubscribed_at = NOW(), updated_at = NOW()
    WHERE confirm_token = ${token} AND unsubscribed_at IS NULL
    RETURNING *
  `;
  return (rows[0] as Subscriber) || null;
}

export async function getConfirmedSubscribersByCategory(
  category: string
): Promise<Subscriber[]> {
  const { rows } = await sql`
    SELECT * FROM subscribers
    WHERE confirmed = TRUE
      AND unsubscribed_at IS NULL
      AND ${category} = ANY(categories)
  `;
  return rows as Subscriber[];
}
