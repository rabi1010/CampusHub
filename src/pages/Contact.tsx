import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  contactSchema,
  type ContactFormValues,
} from "../features/auth/authSchemas";
import { contactService } from "../services/authService";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "support@campushub.edu.np" },
  { icon: Phone, label: "Phone", value: "+977 9800 123456" },
  { icon: MapPin, label: "Address", value: "Kathmandu, Nepal" },
];

export default function Contact() {
  // ── TanStack Query mutation ───────────────────────────
  const sendMessage = useMutation({
    mutationFn: contactService.send,
    // onSuccess/onError handled via mutation state below
  });

  // ── React Hook Form + Zod ─────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormValues) => {
    sendMessage.mutate(data, {
      onSuccess: () => reset(),
    });
  };

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
            {/* Info cards */}
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
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="glass rounded-2xl p-8">
                {/* Success state */}
                {sendMessage.isSuccess ? (
                  <div
                    className="flex flex-col items-center py-12
                                  text-center gap-4"
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
                    <p className="text-sm text-ink-400">
                      We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => sendMessage.reset()}
                      className="btn-ghost text-jade-400 mt-2"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="flex flex-col gap-5"
                  >
                    {/* API error */}
                    {sendMessage.isError && (
                      <div
                        className="flex items-center gap-2 px-3 py-2.5
                                      rounded-lg bg-red-500/10
                                      border border-red-500/20
                                      text-red-400 text-sm"
                      >
                        <AlertCircle size={14} />
                        Failed to send. Please try again.
                      </div>
                    )}

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
                          className={`input-field ${
                            errors.name ? "input-error" : ""
                          }`}
                          {...register("name")}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-400 mt-1">
                            {errors.name.message}
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
                          className={`input-field ${
                            errors.email ? "input-error" : ""
                          }`}
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-400 mt-1">
                            {errors.email.message}
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
                        className={`input-field ${
                          errors.subject ? "input-error" : ""
                        }`}
                        {...register("subject")}
                      />
                      {errors.subject && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.subject.message}
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
                        placeholder="Tell us more..."
                        className={`input-field resize-none ${
                          errors.message ? "input-error" : ""
                        }`}
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={sendMessage.isPending}
                      className="btn-primary justify-center py-3.5 mt-1
                                 disabled:opacity-60 disabled:cursor-not-allowed
                                 disabled:transform-none"
                    >
                      {sendMessage.isPending ? (
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
