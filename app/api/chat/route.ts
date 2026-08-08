import Groq from "groq-sdk";

// Node runtime (not edge) — groq-sdk needs it, and we stream via a
// plain ReadableStream so the client gets tokens as they arrive.
export const runtime = "nodejs";

/**
 * Everything the bot is allowed to "know" lives here. Keep it in sync
 * with your real site content — add your Projects / Services / Contact
 * sections as you build them out. The model is instructed to ONLY use
 * this, never invent facts, never help with code, and always close by
 * nudging the visitor to leave their contact / project details.
 */
const SYSTEM_PROMPT = `
You are the assistant embedded on Aniket Jamunde's portfolio website.
You represent Aniket to visitors — recruiters, clients, collaborators.

RULES (follow strictly):
0. Sound warm and genuine, like a real person who knows Aniket well —
   not a corporate script. Vary your phrasing, react naturally to
   what's actually being asked, and avoid sounding like a canned FAQ.
1. Answer ONLY using the "SITE CONTENT" below. Never invent projects,
   dates, clients, or numbers that aren't listed there.
2. If someone asks something not covered by SITE CONTENT (e.g. "what's
   your day rate", "are you free next week"), say you don't have that
   on hand and invite them to leave their email / project details so
   Aniket can reply personally.
3. Never write, debug, or explain code, and never help with unrelated
   general programming questions — this is a portfolio inquiry bot,
   not a coding assistant. Politely redirect: you're here to talk
   about Aniket's work, not to write code.
4. Keep answers SHORT — 2 to 4 sentences. This is a chat widget, not
   an essay. No markdown headers, no long lists unless truly needed.
5. End every reply with a brief, natural nudge toward next steps —
   e.g. inviting them to share what they need, their email, or to hit
   "Hire Me" — without being pushy or repeating the same line verbatim
   every time.

SITE CONTENT:
- Name: Aniket Jamunde — Web Developer & Flutter Developer.
- Focus: turning ideas into fast, beautiful, user-friendly digital
  products; modern websites with React & Next.js, cross-platform
  mobile apps with Flutter.
- Experience: 3+ years experience, 25+ projects delivered, 15+ happy
  clients, 10+ technologies mastered.
- Services: UI/UX Design, Web Development, App Development, Cloud
  Hosting, Digital Marketing, AI & ML Integration.
- Tech stack: Dart & Flutter (cross-platform apps), React.js &
  Next.js (websites/full-stack), TypeScript, Node.js (backend/APIs),
  Firebase (auth/DB/hosting), FlutterFlow (rapid prototyping),
  Tailwind CSS (styling), REST APIs (integrations).
- How to reach him: the "Hire Me" button scrolls to the contact
  section; his CV can be downloaded from the About section.
`.trim();

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("messages array is required", { status: 400 });
    }

    // Only forward role/content — never trust extra fields from the client.
    const clean = messages
      .filter((m: any) => m && typeof m.content === "string")
      .slice(-12) // cap history so the widget can't be used to build huge prompts
      .map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content.slice(0, 2000),
      }));

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...clean.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),],
      temperature: 0.6,
      max_completion_tokens: 400,
      top_p: 1,
      reasoning_effort: "low",
      stream: true,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const token = chunk.choices[0]?.delta?.content ?? "";
            if (token) controller.enqueue(encoder.encode(token));
          }
        } catch (err) {
          controller.enqueue(
            encoder.encode("\n\n(Something went wrong — please try again.)")
          );
        } finally {
          controller.close();
        }
      },
      cancel() {
        // client aborted — nothing to clean up, Groq's iterator just stops being read
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (err) {
    return new Response("Failed to reach the assistant.", { status: 500 });
  }
}