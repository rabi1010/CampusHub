import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "support@campushub.edu.np" },
  { icon: Phone, label: "Phone", value: "+977 9800 123456" },
  { icon: MapPin, label: "Address", value: "Kathmandu, Nepal" },
];

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY: FormState = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  /* Validate all fields, set error messages */
  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Invalid email address";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500)); // replace with real API call
    setLoading(false);
    setSubmitted(true);
    setForm(EMPTY);
  };

  /* Generic field change handler — avoids one handler per field */
  const set =
    (key: keyof FormState) =>
    (e: import("react").ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="grid-texture">
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div
          className="orb w-[500px] h-[500px] bg-ink-500
                        top-0 left-[-150px] opacity-[0.1]"
        />

        <div className="max-w-6xl mx-auto px-6">
          <span className="section-label">Get in touch</span>
          <h1
            className="font-display text-5xl md:text-6xl text-ink-50
                         mt-5 mb-4 leading-tight"
          >
            We'd love to
            <br />
            <span className="gradient-text italic">hear from you</span>
          </h1>
          <p className="text-ink-400 max-w-md leading-relaxed mb-12">
            Reach out for support, feature requests, or any enquiries.
          </p>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact info cards */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="glass rounded-2xl p-5 flex items-start gap-4"
                >
                  <div
                    className="w-9 h-9 rounded-lg bg-jade-500/10
                                  border border-jade-500/20
                                  flex items-center justify-center shrink-0"
                  >
                    <Icon size={15} className="text-jade-400" />
                  </div>
                  <div>
                    <p
                      className="text-xs font-mono text-ink-500
                                  uppercase tracking-wider mb-0.5"
                    >
                      {label}
                    </p>
                    <p className="text-sm text-ink-200">{value}</p>
                  </div>
                </div>
              ))}

              <div className="glass rounded-2xl p-6 mt-2">
                <p
                  className="text-xs font-mono text-ink-500
                              uppercase tracking-wider mb-3"
                >
                  Response time
                </p>
                <p className="text-sm text-ink-300 leading-relaxed">
                  We typically respond within{" "}
                  <span className="text-jade-400 font-medium">24 hours</span> on
                  weekdays.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="glass rounded-2xl p-8">
                {submitted ? (
                  /* Success state */
                  <div
                    className="flex flex-col items-center justify-center
                                  py-12 text-center gap-4"
                  >
                    <div
                      className="w-14 h-14 rounded-full bg-jade-500/15
                                    border border-jade-500/30
                                    flex items-center justify-center"
                    >
                      <CheckCircle2 size={24} className="text-jade-400" />
                    </div>
                    <h3 className="font-display text-2xl text-ink-50">
                      Message sent!
                    </h3>
                    <p className="text-sm text-ink-400 max-w-xs">
                      We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-ghost text-jade-400 mt-2"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  /* Form fields */
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-5"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label
                          className="block text-xs font-mono text-ink-400
                                          mb-1.5 uppercase tracking-wider"
                        >
                          Full name
                        </label>
                        <input
                          type="text"
                          placeholder="Aarav Sharma"
                          value={form.name}
                          onChange={set("name")}
                          className={`input-field ${
                            errors.name ? "border-red-500/50" : ""
                          }`}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-400 mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          className="block text-xs font-mono text-ink-400
                                          mb-1.5 uppercase tracking-wider"
                        >
                          Email address
                        </label>
                        <input
                          type="email"
                          placeholder="you@college.edu"
                          value={form.email}
                          onChange={set("email")}
                          className={`input-field ${
                            errors.email ? "border-red-500/50" : ""
                          }`}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-400 mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        className="block text-xs font-mono text-ink-400
                                        mb-1.5 uppercase tracking-wider"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="How can we help?"
                        value={form.subject}
                        onChange={set("subject")}
                        className={`input-field ${
                          errors.subject ? "border-red-500/50" : ""
                        }`}
                      />
                      {errors.subject && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        className="block text-xs font-mono text-ink-400
                                        mb-1.5 uppercase tracking-wider"
                      >
                        Message
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Tell us more about your enquiry..."
                        value={form.message}
                        onChange={set("message")}
                        className={`input-field resize-none ${
                          errors.message ? "border-red-500/50" : ""
                        }`}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary justify-center py-3.5 mt-1
                                 disabled:opacity-60 disabled:cursor-not-allowed
                                 disabled:transform-none"
                    >
                      {loading ? (
                        <>
                          <span
                            className="w-4 h-4 border-2 border-white/30
                                           border-t-white rounded-full
                                           animate-spin"
                          />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send message
                          <Send size={15} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
