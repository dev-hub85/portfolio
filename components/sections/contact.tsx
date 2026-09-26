"use client";

import { useRef, useState } from "react";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import emailjs from "@emailjs/browser";
import { useChapterReveal } from "@/lib/reveal";

const EMAIL = "arehman652786@gmail.com";

type Status = { state: "idle" | "sending" | "success" | "error"; message: string };

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>({ state: "idle", message: "" });
  useChapterReveal(ref);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceID || !templateID || !publicKey) {
      console.error("EmailJS environment variables are missing.");
      setStatus({ state: "error", message: `The form is offline right now. Please email ${EMAIL} directly.` });
      return;
    }

    setStatus({ state: "sending", message: "Transmitting…" });
    try {
      await emailjs.send(serviceID, templateID, { ...form }, publicKey);
      setStatus({ state: "success", message: "Transmission received. I’ll reply soon." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Failed to send email:", error);
      setStatus({ state: "error", message: `Signal lost. Please try again or email ${EMAIL}.` });
    }
  };

  return (
    <section ref={ref} id="contact" className="chapter contact" data-stage="contact" aria-labelledby="contact-title">
      <div className="chapter__inner">
        <div className="chapter__copy">
          <p className="kicker" data-reveal>
            <b>VI</b> Transmission
          </p>
          <h2 id="contact-title" className="display" data-split>
            Have a project? <em>Let’s build it.</em>
          </h2>
          <p className="lede" data-reveal>
            Web apps, APIs, AI features and automation, or improving what you already run. Tell me about it.
          </p>

          <div className="socials" data-reveal>
            <a className="button button--red" href={`mailto:${EMAIL}`}>
              <Mail /> Email me
            </a>
            <a className="button" href="https://www.linkedin.com/in/abdul-rehman-3b9213319" target="_blank" rel="noopener noreferrer">
              <Linkedin /> LinkedIn
            </a>
            <a className="button" href="https://github.com/dev-hub85" target="_blank" rel="noopener noreferrer">
              <Github /> GitHub
            </a>
          </div>
          <p className="contact__plain" data-reveal>
            Or write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>

          <div className="console" data-reveal>
            <div className="console__top">
              <span className="label">Open channel</span>
              <span className="label">Pakistan ⇄ you</span>
            </div>
            <form className="contact-form" onSubmit={onSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="cf-name">Name</label>
                  <input id="cf-name" className="form-input" name="name" autoComplete="name" required value={form.name} onChange={onChange} />
                </div>
                <div className="form-field">
                  <label htmlFor="cf-email">Email</label>
                  <input
                    id="cf-email"
                    className="form-input"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={onChange}
                  />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="cf-subject">Subject</label>
                <input id="cf-subject" className="form-input" name="subject" required value={form.subject} onChange={onChange} />
              </div>
              <div className="form-field">
                <label htmlFor="cf-message">Message</label>
                <textarea id="cf-message" className="form-textarea" name="message" required rows={5} value={form.message} onChange={onChange} />
              </div>
              <button type="submit" className="button form-submit" disabled={status.state === "sending"}>
                <Send /> {status.state === "sending" ? "Transmitting…" : "Send transmission"}
              </button>
              <p className="form-status" data-state={status.state} role="status" aria-live="polite">
                {status.state === "idle" ? "" : status.message}
              </p>
              <a className="email-fallback" href={`mailto:${EMAIL}`}>
                Email directly
              </a>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
