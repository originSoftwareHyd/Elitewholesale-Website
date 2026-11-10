"use server";

import { siteConfig } from "@/lib/site";
import { sendMail } from "@/lib/mailer";
import { renderEnquiryEmail, type EnquiryEmailItem } from "@/lib/email-templates";

export type SendEnquiryInput = {
  name: string;
  email: string;
  phone: string;
  notes: string;
  items: EnquiryEmailItem[];
};

export type SendEnquiryResult = { ok: true } | { ok: false; error: string };

export async function sendEnquiryAction(input: SendEnquiryInput): Promise<SendEnquiryResult> {
  const name = input.name.trim();
  const email = input.email.trim();

  if (!name || !email || input.items.length === 0) {
    return { ok: false, error: "Please fill in your name and email, and add at least one item." };
  }

  const { subject, html, text } = renderEnquiryEmail({
    name,
    email,
    phone: input.phone.trim(),
    notes: input.notes.trim(),
    items: input.items,
  });

  try {
    await sendMail({ to: siteConfig.email, subject, html, text, replyTo: email });
    return { ok: true };
  } catch (err) {
    console.error("[enquiry] failed to send email", err);
    return { ok: false, error: "Could not send your enquiry right now. Please try again or email us directly." };
  }
}
