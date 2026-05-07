import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
} from "lucide-react";
import {
  registerSchema,
  type RegisterFormValues,
} from "../features/auth/authSchemas";
import { useRegister } from "../features/auth/useRegister";

// ── Role options (admin cannot self-register) ───────────
const ROLE_OPTIONS = [
  {
    id: "student" as const,
    label: "Student",
    icon: GraduationCap,
    desc: "Access courses, marks, and notices",
  },
  {
    id: "teacher" as const,
    label: "Teacher",
    icon: BookOpen,
    desc: "Manage attendance, marks, and classes",
  },
];

// ── Password strength indicator ─────────────────────────
function getPasswordStrength(password: string): {
  score: number; // 0–4
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Very weak", color: "bg-red-500" },
    { label: "Weak", color: "bg-orange-500" },
    { label: "Fair", color: "bg-yellow-500" },
    { label: "Strong", color: "bg-jade-500" },
    { label: "Very strong", color: "bg-jade-400" },
  ];
  return { score, ...levels[Math.min(score, 4)] };
}

// ── Reusable field error message ────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
      <AlertCircle size={11} />
      {message}
    </p>
  );
}

// ── Reusable field label ────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-xs font-mono text-ink-400
                      mb-1.5 uppercase tracking-wider"
    >
      {children}
    </label>
  );
}

// ── Main component ──────────────────────────────────────
export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const register = useRegister();

  const {
    register: field, // renamed to avoid clash with useRegister()
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "student" },
  });

  const selectedRole = watch("role");
  const passwordVal = watch("password") ?? "";
  const strength = getPasswordStrength(passwordVal);

  const onSubmit = (data: RegisterFormValues) => {
    // Strip confirmPassword before sending to API
    const { confirmPassword, ...payload } = data;
    register.mutate(payload);
  };

  return (
    <div
      className="grid-texture min-h-screen flex items-center
                    justify-center px-4 py-24"
    >
      {/* BG orbs */}
      <div
        className="orb w-[500px] h-[500px] bg-jade-500
                      top-[-100px] right-[-150px] opacity-[0.08]"
      />
      <div
        className="orb w-[400px] h-[400px] bg-ink-500
                      bottom-[-100px] left-[-100px] opacity-[0.1]"
      />

      <div className="w-full max-w-lg">
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div
              className="w-10 h-10 rounded-xl bg-jade-500/20
                            border border-jade-500/30 flex items-center
                            justify-center group-hover:bg-jade-500/30
                            transition-colors"
            >
              <GraduationCap size={18} className="text-jade-400" />
            </div>
            <span className="font-display text-xl text-ink-50">
              Campus<span className="text-jade-400">Hub</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl text-ink-50 mt-5 mb-1">
            Create an account
          </h1>
          <p className="text-sm text-ink-400">
            Register and wait for admin approval to access your portal
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 animate-fade-up">
          {/* ── API error banner ──────────────────────── */}
          {register.isError && (
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl
                            bg-red-500/10 border border-red-500/20
                            text-red-400 text-sm mb-6"
            >
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>
                Registration failed. This email may already be registered.
                Please try again or{" "}
                <Link
                  to="/login"
                  className="underline hover:text-red-300 transition-colors"
                >
                  sign in
                </Link>
                .
              </span>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-5"
          >
            {/* ── Role selection ────────────────────── */}
            <div>
              <FieldLabel>I am registering as</FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                {ROLE_OPTIONS.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setValue("role", id);
                      clearErrors("role");
                    }}
                    className={`flex flex-col items-start gap-2 p-4
                                rounded-xl border text-left
                                transition-all duration-200 ${
                                  selectedRole === id
                                    ? "bg-jade-500/15 border-jade-500/40"
                                    : "border-white/[0.07] hover:border-white/20"
                                }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center
                                     justify-center ${
                                       selectedRole === id
                                         ? "bg-jade-500/20 text-jade-400"
                                         : "bg-white/5 text-ink-400"
                                     }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          selectedRole === id ? "text-jade-300" : "text-ink-200"
                        }`}
                      >
                        {label}
                      </p>
                      <p className="text-xs text-ink-500 mt-0.5 leading-snug">
                        {desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <FieldError message={errors.role?.message} />
            </div>

            <div className="divider" />

            {/* ── Full name ─────────────────────────── */}
            <div>
              <FieldLabel>Full name</FieldLabel>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2
                                 text-ink-500 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Aarav Sharma"
                  className={`input-field pl-10 ${
                    errors.fullName ? "input-error" : ""
                  }`}
                  {...field("fullName")}
                />
              </div>
              <FieldError message={errors.fullName?.message} />
            </div>

            {/* ── Email + Phone (2-col) ─────────────── */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Email address</FieldLabel>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2
                                   text-ink-500 pointer-events-none"
                  />
                  <input
                    type="email"
                    placeholder="you@college.edu"
                    className={`input-field pl-10 ${
                      errors.email ? "input-error" : ""
                    }`}
                    {...field("email")}
                  />
                </div>
                <FieldError message={errors.email?.message} />
              </div>

              <div>
                <FieldLabel>Phone number</FieldLabel>
                <div className="relative">
                  <Phone
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2
                                    text-ink-500 pointer-events-none"
                  />
                  <input
                    type="tel"
                    placeholder="+977 9800 000000"
                    className={`input-field pl-10 ${
                      errors.phone ? "input-error" : ""
                    }`}
                    {...field("phone")}
                  />
                </div>
                <FieldError message={errors.phone?.message} />
              </div>
            </div>

            {/* ── Password ──────────────────────────── */}
            <div>
              <FieldLabel>Password</FieldLabel>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2
                                 text-ink-500 pointer-events-none"
                />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  autoComplete="new-password"
                  className={`input-field pl-10 pr-10 ${
                    errors.password ? "input-error" : ""
                  }`}
                  {...field("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-ink-500 hover:text-ink-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength bar */}
              {passwordVal && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all
                                    duration-300 ${
                                      strength.score >= i
                                        ? strength.color
                                        : "bg-white/10"
                                    }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-ink-500">
                    Strength:{" "}
                    <span
                      className={`font-medium ${
                        strength.score >= 3
                          ? "text-jade-400"
                          : strength.score >= 2
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {strength.label}
                    </span>
                  </p>
                </div>
              )}

              <FieldError message={errors.password?.message} />
            </div>

            {/* ── Confirm password ──────────────────── */}
            <div>
              <FieldLabel>Confirm password</FieldLabel>
              <div className="relative">
                <ShieldCheck
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2
                                        text-ink-500 pointer-events-none"
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className={`input-field pl-10 pr-10 ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                  {...field("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-ink-500 hover:text-ink-300 transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FieldError message={errors.confirmPassword?.message} />
            </div>

            {/* ── Approval notice ───────────────────── */}
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl
                            bg-jade-500/5 border border-jade-500/20"
            >
              <CheckCircle2
                size={15}
                className="text-jade-500 mt-0.5 shrink-0"
              />
              <p className="text-xs text-ink-400 leading-relaxed">
                After registering, your account will be{" "}
                <span className="text-jade-400 font-medium">
                  reviewed by an admin
                </span>{" "}
                before you can log in. You'll be notified once approved.
              </p>
            </div>

            {/* ── Submit ────────────────────────────── */}
            <button
              type="submit"
              disabled={register.isPending}
              className="btn-primary justify-center py-3.5
                         disabled:opacity-60 disabled:cursor-not-allowed
                         disabled:transform-none"
            >
              {register.isPending ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-white/30
                                   border-t-white rounded-full animate-spin"
                  />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sign in link */}
        <p className="text-center text-sm text-ink-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-jade-400 hover:text-jade-300 transition-colors
                           font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
