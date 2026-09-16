export const runtime = "nodejs";

// Plug in whatever notification channel you want. If LEAD_WEBHOOK_URL
// is set (a Discord/Slack incoming webhook URL), it posts there.
// Otherwise it just logs — swap this for Resend/Nodemailer/a DB write
// whenever you're ready.
export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || typeof name !== "string" || typeof email !== "string") {
      return new Response(JSON.stringify({ ok: false, error: "Missing name or email" }), { status: 400 });
    }

    const webhook = process.env.LEAD_WEBHOOK_URL;
    const payloadText = `📩 New portfolio lead\nName: ${name}\nEmail: ${email}\nProject: ${message || "—"}`;

    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: payloadText }),
      }).catch(() => {});
    } else {
      console.log(payloadText);
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
}