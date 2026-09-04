import logo from "@/assets/logo/logo.svg";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  UserCog,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
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
    desc: "System Control",
    demo: "admin@campushub.edu",
  },
  {
    id: "teacher" as const,
    label: "Teacher",
    icon: BookOpen,
    desc: "Academic Portal",
    demo: "teacher@campushub.edu",
  },
  {
    id: "student" as const,
    label: "Student",
    icon: GraduationCap,
    desc: "Learning Portal",
    demo: "student@campushub.edu",
  },
  {
    id: "parent" as const,
    label: "Parent",
    icon: UserCog,
    desc: "Parent Portal",
    demo: "parent@campushub.edu",
  },
];

export default function Login() {
  const location = useLocation();
  const [showPass, setShowPass] = useState(false);
  const login = useLogin();

  const successMessage = (location.state as { message?: string } | null)
    ?.message;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: "admin" },
  });

  const selectedRole = watch("role");
  const selected = ROLES.find((r) => r.id === selectedRole)!;

  const fillDemo = () => {
    setValue("role", "admin");
    setValue("email", "admin@campushub.edu");
    setValue("password", "admin123");
    clearErrors();
  };

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* ── LEFT SIDE: FORM ─────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-24 py-10 relative overflow-hidden">
        {/* Subtle background blur */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-50 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 opacity-60" />

        <div className="relative z-10 w-full max-w-md mx-auto bg-white border border-zinc-100 rounded-3xl p-7 sm:p-9 shadow-card-lg">
          {/* Logo & Back */}
          <div className="flex items-center justify-between mb-12">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <img src={logo} alt="CampusHub" className="h-10 w-auto" />
            </Link>
            <Link
              to="/"
              className="text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <ChevronLeft size={16} /> Back to site
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="section-kicker">Secure access</p>
            <h1 className="text-3xl font-display font-medium text-zinc-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-zinc-500 mb-10">
              Select your portal and enter your credentials.
            </p>

            {/* Role selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {ROLES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setValue("role", id);
                    clearErrors("role");
                  }}
                  className={`flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 transition-all duration-200 ${
                    selectedRole === id
                      ? "bg-brand-50 border-brand-500 text-brand-700 shadow-sm"
                      : "border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-200 hover:text-zinc-600"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {/* API Status Messages */}
            {successMessage && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm mb-6 animate-fade-in">
                <CheckCircle2 size={18} className="shrink-0" />
                {successMessage}
              </div>
            )}
            {login.isError && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-6 animate-fade-in">
                <AlertCircle size={18} className="shrink-0" />
                Invalid credentials. Please verify your email and password.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Institutional Email
                </label>
                <input
                  type="email"
                  placeholder="name@campushub.edu"
                  className={`input-field ${errors.email ? "input-error" : ""}`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-rose-500 mt-1.5 font-medium flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-zinc-700">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-brand-600 font-medium hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    className={`input-field pr-12 ${errors.password ? "input-error" : ""}`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-500 mt-1.5 font-medium flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={login.isPending}
                className="btn-primary w-full py-4 text-base font-medium shadow-brand-500/20 shadow-xl disabled:opacity-70"
              >
                {login.isPending
                  ? "Signing you in..."
                  : `Enter ${selected.label} Portal`}
                {!login.isPending && <ArrowRight size={18} className="ml-2" />}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-zinc-100 text-center">
              <button
                type="button"
                onClick={fillDemo}
                className="text-sm font-medium text-zinc-400 hover:text-brand-600 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                Use seeded admin credentials{" "}
                <ArrowRight size={14} />
              </button>
            </div>

            <p className="mt-8 text-center text-zinc-500 text-sm">
              New to the platform?{" "}
              <Link
                to="/register"
                className="text-brand-600 font-medium hover:underline"
              >
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT SIDE: IMAGE ────────────────────────────── */}
      <div className="hidden lg:flex flex-1 bg-zinc-900 relative items-center justify-center overflow-hidden min-h-screen">
        <img
          src="https://plus.unsplash.com/premium_photo-1682126255537-d3d08524f263?w=1200&auto=format&fit=crop&q=80"
          alt="Campus Excellence"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-linear-to-br from-emerald-900/75 via-zinc-950/80 to-zinc-950" />

        <div className="relative z-10 max-w-lg p-12 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-1 bg-brand-500 mb-8" />
            <h2 className="text-4xl font-display font-medium mb-6 leading-tight">
              Unifying the{" "}
              <span className="text-brand-400 italic">Academic</span> Experience
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed">
              Experience the power of a centralized ecosystem designed to
              support students, empower faculty, and streamline administration.
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 p-12 w-full flex items-center justify-between opacity-50">
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white" />
            ))}
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-white">
            CampusHub Enterprise OS
          </p>
        </div>
      </div>
    </div>
  );
}
