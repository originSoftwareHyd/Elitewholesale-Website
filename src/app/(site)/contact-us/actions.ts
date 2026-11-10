"use server";

import { siteConfig } from "@/lib/site";
import { sendMail } from "@/lib/mailer";
import { renderContactEmail } from "@/lib/email-templates";

export type ContactFormState = { status: "idle" | "success" | "error"; error?: string };

export async function sendContactAction(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", error: "Please fill in your name, email, and message." };
  }

  const { subject: emailSubject, html, text } = renderContactEmail({ name, email, subject, message });

  try {
    await sendMail({ to: siteConfig.email, subject: emailSubject, html, text, replyTo: email });
    return { status: "success" };
  } catch (err) {
    console.error("[contact-us] failed to send email", err);
    return {
      status: "error",
      error: "Could not send your message right now. Please try again or email us directly.",
    };
  }
}
