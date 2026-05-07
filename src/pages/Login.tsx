import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  UserCog,
  BookOpen,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  loginSchema,
  type LoginFormValues,
} from "../features/auth/authSchemas";
import { useLogin } from "../features/auth/useLogin";

// ── Role definitions ────────────────────────────────────
const ROLES = [
  {
    id: "admin" as const,
    label: "Admin",
    icon: UserCog,
    desc: "Full system control",
    demo: "admin@campushub.edu",
  },
  {
    id: "teacher" as const,
    label: "Teacher",
    icon: BookOpen,
    desc: "Attendance, marks & notices",
    demo: "teacher@campushub.edu",
  },
  {
    id: "student" as const,
    label: "Student",
    icon: GraduationCap,
    desc: "View courses & progress",
    demo: "student@campushub.edu",
  },
];

export default function Login() {
  const location = useLocation();
  const [showPass, setShowPass] = useState(false);
  const login = useLogin();

  // Read success message passed from Register page via router state
  const successMessage = (location.state as { message?: string } | null)
    ?.message;

  // ── React Hook Form + Zod ───────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: "student" },
  });

  const selectedRole = watch("role");
  const selected = ROLES.find((r) => r.id === selectedRole)!;

  // Fill demo credentials for the currently selected role
  const fillDemo = () => {
    setValue("email", selected.demo);
    setValue("password", "demo123");
    clearErrors();
  };

  // Called only after Zod validation passes
  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data);
  };

  return (
    <div className="grid-texture min-h-screen flex items-center justify-center px-4 py-24">
      {/* Background orbs */}
      <div className="orb w-[600px] h-[600px] bg-jade-500 top-[-200px] right-[-200px] opacity-[0.08]" />
      <div className="orb w-[400px] h-[400px] bg-ink-500 bottom-[-100px] left-[-100px] opacity-[0.1]" />

      <div className="w-full max-w-md">
        {/* ── Logo + heading ──────────────────────────── */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div
              className="w-10 h-10 rounded-xl bg-jade-500/20 border border-jade-500/30
                         flex items-center justify-center
                         group-hover:bg-jade-500/30 transition-colors"
            >
              <GraduationCap size={18} className="text-jade-400" />
            </div>
            <span className="font-display text-xl text-ink-50">
              Campus<span className="text-jade-400">Hub</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl text-ink-50 mt-5 mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-ink-400">Sign in to your portal</p>
        </div>

        {/* ── Card ────────────────────────────────────── */}
        <div className="glass rounded-2xl p-8 animate-fade-up">
          {/* Role selector */}
          <div className="mb-6">
            <p className="text-xs font-mono text-ink-500 uppercase tracking-widest mb-3">
              Select your role
            </p>

            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setValue("role", id);
                    clearErrors("role");
                  }}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2
                              rounded-xl border text-xs font-medium
                              transition-all duration-200 ${
                                selectedRole === id
                                  ? "bg-jade-500/15 border-jade-500/40 text-jade-300"
                                  : "border-white/[0.07] text-ink-400 hover:border-white/20 hover:text-ink-200"
                              }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            <p className="text-xs text-ink-500 mt-2 text-center">
              {selected.desc}
            </p>
          </div>

          {/* Success message from Register page */}
          {successMessage && (
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl
                         bg-jade-500/10 border border-jade-500/20
                         text-jade-300 text-sm mb-4"
            >
              <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
              {successMessage}
            </div>
          )}

          {/* API error from TanStack Query */}
          {login.isError && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg
                         bg-red-500/10 border border-red-500/20
                         text-red-400 text-sm mb-4"
            >
              <AlertCircle size={14} />
              Invalid credentials. Please try again.
            </div>
          )}

          <div className="divider mb-6" />

          {/* ── Form ──────────────────────────────────── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4"
          >
            {/* Email */}
            <div>
              <label className="block text-xs font-mono text-ink-400 mb-1.5 uppercase tracking-wider">
                Email address
              </label>
              <input
                type="email"
                placeholder={selected.demo}
                autoComplete="email"
                className={`input-field ${errors.email ? "input-error" : ""}`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-ink-400 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-jade-500 hover:text-jade-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`input-field pr-10 ${
                    errors.password ? "input-error" : ""
                  }`}
                  {...register("password")}
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

              {errors.password && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={login.isPending}
              className="btn-primary justify-center py-3.5 mt-1
                         disabled:opacity-60 disabled:cursor-not-allowed
                         disabled:transform-none"
            >
              {login.isPending ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-white/30
                               border-t-white rounded-full animate-spin"
                  />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in as {selected.label}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="divider my-5" />

          {/* Demo credentials helper */}
          <button
            type="button"
            onClick={fillDemo}
            className="w-full py-2.5 rounded-xl border border-white/[0.07]
                       text-xs text-ink-400 hover:text-ink-200
                       hover:border-white/20 transition-all font-mono"
          >
            Fill demo credentials → {selected.label}
          </button>
        </div>

        {/* ── Footer links ─────────────────────────────── */}
        <p className="text-center text-sm text-ink-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-jade-400 hover:text-jade-300 transition-colors font-medium"
          >
            Register
          </Link>
          {" · "}
          <Link to="/" className="hover:text-jade-400 transition-colors">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
