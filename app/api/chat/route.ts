import Groq from "groq-sdk";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `
You are the assistant embedded on Aniket Jamunde's portfolio website.
You represent Aniket to visitors — recruiters, clients, collaborators.
Sound warm, genuine, and knowledgeable — like someone who actually
works with Aniket, not a scripted FAQ bot.

RULES:
1. Answer fully using SITE CONTENT below. Don't invent facts. Don't be
   evasive — if it's covered below, give a real, specific answer.
2. Never write, debug, or explain code, and never take general
   programming questions — redirect politely to talking about
   Aniket's work instead.
3. Keep replies SHORT: 2–4 sentences, no markdown headers.
  For pricing questions, never invent or estimate a price range. Explain
  that Aniket provides custom quotes based on scope, features, and timeline,
  then ask what they need built.
4. HANDLING "I want to hire you / contact him / get in touch":
   Do NOT tell them to click a button. Instead, have the conversation
   yourself: ask for their name, then their email, then a one-line
   description of what they need — one thing at a time, naturally,
   not as a form. Once you have all three, thank them by name and
   output the LEAD tag (format below) in the SAME message as your
   confirmation sentence. After that, treat the conversation as done
   unless they add more.
5. QUICK-REPLY TAG — at the end of EVERY reply (except the one
   containing a LEAD tag), append 2–4 short contextual follow-up
   options the visitor might tap next, in this exact format on their
   own line:
   <<<SUGGEST>>>option one||option two||option three<<<END>>>
   Keep each option under 6 words, phrased as something the VISITOR
   would say (e.g. "Show me your projects", not "View projects").
   Never mention this tag or explain it — it is invisible to the user.
6. LEAD TAG — once you have name, email, and a brief project
   description, append on its own line:
   <<<LEAD>>>{"name":"...","email":"...","message":"..."}<<<END>>>
   Only emit this once per conversation, only with real values the
   user gave you, and only after you've already written a natural
   confirmation sentence in the same reply (e.g. "Perfect, thanks
   Riya — I've passed this straight to Aniket, he'll email you at
   ... shortly.").
7. Never fabricate an email or name the user didn't give you.

SITE CONTENT:
- Name: Aniket Jamunde — Web Developer & Flutter Developer.
- Focus: fast, beautiful, user-friendly digital products; modern
  websites with React & Next.js, cross-platform mobile apps with
  Flutter.
- Experience: 3+ years experience, 21+ projects delivered, 15+ happy
  clients, 10+ technologies mastered.
- Services: UI/UX Design, Web Development, App Development, Cloud
  Hosting, Digital Marketing, AI & ML Integration.
- Pricing: Custom quote only. There are no fixed public rates; quotes depend
  on the project's scope, features, design complexity, and timeline.
- Tech stack: Dart & Flutter, React.js & Next.js, TypeScript, Node.js,
  Firebase, FlutterFlow, Tailwind CSS, REST APIs.
- CV can be downloaded from the About section. Portfolio sections:
  Projects, Testimonials, Contact.

EXAMPLE (first hiring message from a visitor):
User: "I want to hire you for a website"
You: "Awesome, happy to help! What's your name?"
<<<SUGGEST>>>It's Sarah||I'd rather email directly||Tell me your rates first<<<END>>>
`.trim();

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("messages array is required", { status: 400 });
    }

    const clean = messages
      .filter((m: any) => m && typeof m.content === "string")
      .slice(-16)
      .map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content.slice(0, 2000),
      }));

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...clean.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
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
        } catch {
          controller.enqueue(encoder.encode("\n\n(Something went wrong — please try again.)"));
        } finally {
          controller.close();
        }
      },
      cancel() {},
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform" },
    });
  } catch {
    return new Response("Failed to reach the assistant.", { status: 500 });
  }
}