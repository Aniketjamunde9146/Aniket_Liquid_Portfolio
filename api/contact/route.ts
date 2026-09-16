import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  from_name: string;
  from_phone: string;
  from_email: string;
  service_type: string;
  message: string;
}

function validate(body: Partial<ContactPayload>): string | null {
  if (!body.from_name?.trim()) return "Name is required.";
  if (!body.from_email?.trim() || !EMAIL_RE.test(body.from_email)) return "A valid email is required.";
  if (!body.from_phone?.trim()) return "Phone is required.";
  if (!body.service_type?.trim()) return "Service type is required.";
  if (!body.message?.trim()) return "Message is required.";
  if (body.from_name.trim().length > 120) return "Name is too long.";
  if (body.from_email.trim().length > 254) return "Email is too long.";
  if (body.from_phone.trim().length > 40) return "Phone number is too long.";
  if (body.service_type.trim().length > 120) return "Service type is too long.";
  if (body.message.length > 5000) return "Message is too long.";
  return null;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const contact = body as Partial<ContactPayload>;
  const validationError = validate(contact);
  if (validationError) {
    return NextResponse.json({ success: false, error: validationError }, { status: 400 });
  }

  // Uses your existing SSR server client (anon key). Since this runs with
  // the anon role, the insert is only allowed because of the "anyone can
  // insert" RLS policy in contacts-table.sql -- there is deliberately no
  // select/update/delete policy, so submitted leads can't be read back
  // through this same key.
  const supabase = await createClient();

  const { error } = await supabase.from("contacts").insert({
    name: contact.from_name!.trim(),
    phone: contact.from_phone!.trim(),
    email: contact.from_email!.trim().toLowerCase(),
    service_type: contact.service_type!.trim(),
    message: contact.message!.trim(),
  });

  if (error) {
    console.error("Supabase insert error:", error.message);
    return NextResponse.json(
      { success: false, error: "Could not save your message. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
