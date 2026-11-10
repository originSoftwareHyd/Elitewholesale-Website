"use client";

import { useActionState } from "react";
import { CheckCircle2, Send, TriangleAlert } from "lucide-react";
import { sendContactAction, type ContactFormState } from "./actions";

const initialState: ContactFormState = { status: "idle" };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactAction, initialState);

  if (state.status === "success") {
    return (
      <div className="mt-6 rounded-xl bg-success/10 p-6 text-center">
        <CheckCircle2 className="mx-auto size-10 text-success" />
        <h3 className="mt-3 text-lg font-bold">Message sent!</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Thanks for reaching out - we&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {state.status === "error" && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive sm:col-span-2">
          <TriangleAlert className="size-4 shrink-0" />
          {state.error}
        </div>
      )}
      <input name="name" type="text" required placeholder="Your Name" className="field" />
      <input name="email" type="email" required placeholder="Your Email" className="field" />
      <input name="subject" type="text" placeholder="Subject" className="field sm:col-span-2" />
      <textarea name="message" required rows={5} placeholder="Your Message" className="field sm:col-span-2" />
      <button type="submit" disabled={pending} className="btn btn-primary sm:col-span-2 sm:w-fit">
        <Send className="size-4" />
        {pending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
