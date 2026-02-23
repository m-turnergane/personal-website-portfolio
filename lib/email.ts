import { Resend } from "resend";
import { CATEGORY_LABELS } from "./categories";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.FROM_EMAIL || "Muhammad Gane <notifications@muhammadgane.com>";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://muhammadgane.com";

export async function sendConfirmationEmail(
  email: string,
  token: string,
  categories: string[]
) {
  const confirmUrl = `${SITE_URL}/api/confirm?token=${token}`;
  const labels = categories.map((c) => CATEGORY_LABELS[c] || c);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "One step left — confirm your subscription",
    html: confirmationEmailHtml(confirmUrl, labels),
  });
}

export async function sendNotificationEmail(
  email: string,
  unsubscribeToken: string,
  category: string,
  title: string,
  summary: string,
  slug: string,
  routePrefix: string
) {
  const postUrl = `${SITE_URL}/${routePrefix}/${slug}`;
  const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?token=${unsubscribeToken}`;
  const label = CATEGORY_LABELS[category] || category;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `${label} — ${title}`,
    html: notificationEmailHtml(title, summary, postUrl, unsubscribeUrl, label),
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
}

/* ─── Shared layout primitives ─── */

const SANS = `'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,sans-serif`;
const SERIF = `'Cormorant Garamond',Georgia,'Times New Roman',serif`;
const BG = `#0a0a0a`;
const CARD_BG = `#111111`;
const BORDER = `#222222`;

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
  <meta name="supported-color-schemes" content="dark light">
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');
    /* Force dark in email clients that respect this */
    :root { color-scheme: dark; }
    body { background-color: ${BG} !important; }
    /* Gmail Android dark mode override */
    [data-ogsc] .email-bg { background-color: ${BG} !important; }
    [data-ogsc] .email-card { background-color: ${CARD_BG} !important; }
    [data-ogsc] .text-primary { color: #fafafa !important; }
    [data-ogsc] .text-muted { color: #a1a1aa !important; }
    [data-ogsc] .text-dim { color: #52525b !important; }
  </style>
</head>
<body class="email-bg" style="margin:0;padding:0;background-color:${BG};-webkit-font-smoothing:antialiased;" bgcolor="${BG}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${BG}" style="background-color:${BG};">
    <tr>
      <td align="center" style="padding:44px 16px 56px;" bgcolor="${BG}">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          ${emailHeader()}
          ${content}
          ${emailFooter()}

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function emailHeader(): string {
  return `
          <!-- Header -->
          <tr>
            <td style="padding-bottom:28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:baseline;">
                          <a href="${SITE_URL}" style="text-decoration:none;">
                            <span class="text-primary" style="font-family:${SANS};font-size:15px;font-weight:700;letter-spacing:-0.02em;color:#fafafa;">Muhammad Gane</span>
                          </a>
                        </td>
                        <td width="16" style="vertical-align:baseline;">&nbsp;</td>
                        <td style="vertical-align:baseline;">
                          <span class="text-dim" style="font-family:${SERIF};font-size:13px;font-style:italic;color:#3f3f46;letter-spacing:0.01em;">Building tools that think</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:14px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td height="1" bgcolor="#1f1f1f" style="font-size:0;line-height:0;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
}

function emailFooter(): string {
  return `
          <!-- Footer -->
          <tr>
            <td style="padding-top:28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:14px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td height="1" bgcolor="#1a1a1a" style="font-size:0;line-height:0;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="font-family:${SANS};font-size:12px;color:#3f3f46;line-height:1.8;" class="text-dim">
                    <a href="${SITE_URL}" style="color:#3f3f46;text-decoration:none;">muhammadgane.com</a>
                    &nbsp;&middot;&nbsp;
                    <a href="${SITE_URL}/projects" style="color:#3f3f46;text-decoration:none;">Projects</a>
                    &nbsp;&middot;&nbsp;
                    <a href="${SITE_URL}/automation" style="color:#3f3f46;text-decoration:none;">Automation</a>
                    &nbsp;&middot;&nbsp;
                    <a href="${SITE_URL}/writing" style="color:#3f3f46;text-decoration:none;">Writing</a>
                    &nbsp;&middot;&nbsp;
                    <a href="${SITE_URL}/trading-lab" style="color:#3f3f46;text-decoration:none;">Trading Lab</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
}

function categoryLabel(label: string): string {
  return `<span style="display:inline-block;font-family:${SANS};font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#52525b;">${label}</span>`;
}

function primaryButton(href: string, label: string): string {
  return `
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-radius:6px;background:#1a1a1a;border:1px solid #2a2a2a;">
                          <a href="${href}" style="display:inline-block;font-family:${SANS};font-size:14px;font-weight:500;color:#e4e4e7;text-decoration:none;padding:11px 26px;border-radius:6px;letter-spacing:0.01em;">
                            ${label} &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>`;
}

/* ─── Confirmation email ─── */

function confirmationEmailHtml(
  confirmUrl: string,
  categories: string[]
): string {
  const pills = categories.map(categoryLabel).join(`<span style="color:#2a2a2a;margin:0 8px;">&middot;</span>`);

  return emailWrapper(`
          <!-- Body -->
          <tr>
            <td class="email-card" style="background-color:${CARD_BG};border:1px solid ${BORDER};border-radius:10px;padding:36px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

                <!-- Category labels -->
                <tr>
                  <td style="padding-bottom:24px;">${pills}</td>
                </tr>

                <!-- Heading -->
                <tr>
                  <td style="padding-bottom:14px;">
                    <h1 class="text-primary" style="margin:0;font-family:${SERIF};font-size:28px;font-weight:600;letter-spacing:-0.01em;color:#fafafa;line-height:1.25;">
                      One step left.
                    </h1>
                  </td>
                </tr>

                <!-- Body text -->
                <tr>
                  <td style="padding-bottom:32px;">
                    <p class="text-muted" style="margin:0;font-family:${SANS};font-size:15px;line-height:1.75;color:#a1a1aa;">
                      Confirm your email to start receiving updates whenever new work drops in the categories you chose.
                    </p>
                  </td>
                </tr>

                <!-- CTA -->
                <tr>
                  <td style="padding-bottom:32px;">
                    ${primaryButton(confirmUrl, "Confirm subscription")}
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td height="1" bgcolor="#1e1e1e" style="font-size:0;line-height:0;">&nbsp;</td></tr>
                    </table>
                  </td>
                </tr>

                <!-- Safety note -->
                <tr>
                  <td>
                    <p class="text-dim" style="margin:0;font-family:${SANS};font-size:12px;line-height:1.6;color:#52525b;">
                      If you didn't sign up for this, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>`);
}

/* ─── Notification email ─── */

function notificationEmailHtml(
  title: string,
  summary: string,
  postUrl: string,
  unsubscribeUrl: string,
  label: string
): string {
  return emailWrapper(`
          <!-- Body -->
          <tr>
            <td class="email-card" style="background-color:${CARD_BG};border:1px solid ${BORDER};border-radius:10px;padding:36px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

                <!-- Category label -->
                <tr>
                  <td style="padding-bottom:20px;">${categoryLabel(label)}</td>
                </tr>

                <!-- Title -->
                <tr>
                  <td style="padding-bottom:16px;">
                    <h1 class="text-primary" style="margin:0;font-family:${SERIF};font-size:28px;font-weight:600;letter-spacing:-0.01em;color:#fafafa;line-height:1.25;">
                      ${title}
                    </h1>
                  </td>
                </tr>

                <!-- Summary -->
                <tr>
                  <td style="padding-bottom:32px;">
                    <p class="text-muted" style="margin:0;font-family:${SANS};font-size:15px;line-height:1.75;color:#a1a1aa;">
                      ${summary}
                    </p>
                  </td>
                </tr>

                <!-- CTA -->
                <tr>
                  <td style="padding-bottom:32px;">
                    ${primaryButton(postUrl, "Read now")}
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td height="1" bgcolor="#1e1e1e" style="font-size:0;line-height:0;">&nbsp;</td></tr>
                    </table>
                  </td>
                </tr>

                <!-- Unsubscribe -->
                <tr>
                  <td>
                    <p class="text-dim" style="margin:0;font-family:${SANS};font-size:12px;line-height:1.6;color:#52525b;">
                      You're receiving this because you subscribed to <strong style="color:#3f3f46;font-weight:500;">${label}</strong> updates.
                      &nbsp;<a href="${unsubscribeUrl}" style="color:#52525b;text-decoration:underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>`);
}
