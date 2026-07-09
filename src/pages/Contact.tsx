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
    <div className="bg-zinc-50 min-h-screen">
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div
          className="orb w-[600px] h-[600px] bg-brand-200
                        absolute top-[-200px] left-[-200px] opacity-20 blur-[100px] -z-10"
        />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-[10px] font-medium uppercase tracking-[0.2em] mb-4">Get in touch</span>
          <h1
            className="font-display text-5xl md:text-7xl text-zinc-900
                         mb-6 leading-[1.1] font-medium tracking-tight"
          >
            We'd love to
            <br />
            <span className="text-brand-600 italic">hear from you</span>
          </h1>
          <p className="text-zinc-600 max-w-md leading-relaxed mb-12 font-medium text-lg">
            Reach out for support, feature requests, or any enquiries.
          </p>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Info cards */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-white border border-zinc-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-10 h-10 rounded-xl bg-brand-50
                                  border border-brand-100
                                  flex items-center justify-center shrink-0"
                  >
                    <Icon size={16} className="text-brand-600" />
                  </div>
                  <div>
                    <p
                      className="text-[10px] font-medium text-zinc-400
                                  uppercase tracking-widest mb-1"
                    >
                      {label}
                    </p>
                    <p className="text-sm font-medium text-zinc-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-zinc-100 shadow-xl shadow-zinc-200/50 rounded-3xl p-8 lg:p-10">
                {/* Success state */}
                {sendMessage.isSuccess ? (
                  <div
                    className="flex flex-col items-center py-12
                                  text-center gap-4"
                  >
                    <div
                      className="w-16 h-16 rounded-full bg-green-50
                                    border border-green-100
                                    flex items-center justify-center shadow-inner"
                    >
                      <CheckCircle2 size={28} className="text-green-500" />
                    </div>
                    <h3 className="font-display text-2xl text-zinc-900 font-medium">
                      Message sent!
                    </h3>
                    <p className="text-sm text-zinc-500 font-medium">
                      We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => sendMessage.reset()}
                      className="text-brand-600 font-medium text-sm mt-4 hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="flex flex-col gap-6"
                  >
                    {/* API error */}
                    {sendMessage.isError && (
                      <div
                        className="flex items-center gap-2 px-4 py-3
                                      rounded-xl bg-red-50
                                      border border-red-100
                                      text-red-600 text-sm font-medium"
                      >
                        <AlertCircle size={16} />
                        Failed to send. Please try again.
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <label
                          className="block text-[10px] font-medium text-zinc-500
                                          uppercase tracking-widest"
                        >
                          Full name
                        </label>
                        <input
                          type="text"
                          placeholder="Aarav Sharma"
                          className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                          {...register("name")}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500 font-medium">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label
                          className="block text-[10px] font-medium text-zinc-500
                                          uppercase tracking-widest"
                        >
                          Email address
                        </label>
                        <input
                          type="email"
                          placeholder="you@college.edu"
                          className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500 font-medium">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <label
                        className="block text-[10px] font-medium text-zinc-500
                                        uppercase tracking-widest"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="How can we help?"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                        {...register("subject")}
                      />
                      {errors.subject && (
                        <p className="text-xs text-red-500 font-medium">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label
                        className="block text-[10px] font-medium text-zinc-500
                                        uppercase tracking-widest"
                      >
                        Message
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Tell us more..."
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none resize-none"
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-500 font-medium">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={sendMessage.isPending}
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 text-white font-medium rounded-2xl shadow-lg shadow-brand-500/25 hover:bg-brand-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                      {sendMessage.isPending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending Message…
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={18} />
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
