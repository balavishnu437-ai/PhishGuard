import { useState } from "react";
import { Mail, MessageSquare, Send, ShieldQuestion, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageShell, Reveal } from "@/components/Reveal";
import { sendContact } from "@/lib/api";

const INFO = [
  { icon: Mail, title: "Email", text: "balavishnu437@gmail.com" },
  { icon: Clock, title: "Response time", text: "Usually within 24 hours" },
  { icon: ShieldQuestion, title: "False positives?", text: "Report a misjudged URL and we will retune the model" },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      await sendContact(form);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      toast.success("Message received — we'll get back to you soon.");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Could not send your message. Please try again.";
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <PageShell className="pt-32 sm:pt-36">
      <section className="section-pad" data-testid="contact-page">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">Contact</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Talk to the <span className="text-gradient">defense team</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
            Questions, feedback or a suspicious link to report — we read everything.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-5">
          <div className="flex flex-col gap-4 lg:col-span-2">
            {INFO.map((c, i) => (
              <Reveal key={c.title} delay={0.08 * i}>
                <div className="glass card-hover flex items-start gap-4 rounded-2xl p-6">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 shadow-glow-cyan">
                    <c.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{c.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{c.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="lg:col-span-3">
            <div className="glass glow-border rounded-2xl p-7 sm:p-8">
              {sent ? (
                <div data-testid="contact-success" className="flex flex-col items-center py-12 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 shadow-glow-emerald">
                    <CheckCircle2 className="h-7 w-7 text-emerald-300" />
                  </span>
                  <h2 className="mt-5 text-lg font-semibold">Message received</h2>
                  <p className="mt-2 max-w-sm text-sm text-slate-400">
                    Thanks for reaching out — the team will reply to your email shortly.
                  </p>
                  <button onClick={() => setSent(false)} data-testid="contact-send-another" className="btn-ghost mt-6">
                    <MessageSquare className="h-4 w-4" />
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5" data-testid="contact-form">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                        Name
                      </label>
                      <input
                        id="contact-name"
                        data-testid="contact-name"
                        value={form.name}
                        onChange={set("name")}
                        required
                        minLength={2}
                        placeholder="Ada Lovelace"
                        className="neon-field"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                        Email
                      </label>
                      <input
                        id="contact-email"
                        data-testid="contact-email"
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        required
                        placeholder="you@example.com"
                        className="neon-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      data-testid="contact-message"
                      value={form.message}
                      onChange={set("message")}
                      required
                      minLength={5}
                      rows={6}
                      placeholder="Tell us what's on your mind…"
                      className="neon-field resize-none"
                    />
                  </div>
                  <button type="submit" data-testid="contact-submit" disabled={sending} className="btn-primary w-full sm:w-auto disabled:opacity-60">
                    <Send className="h-4 w-4" />
                    {sending ? "Sending…" : "Send message"}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
};

export default Contact;
