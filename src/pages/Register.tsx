import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronLeft,
} from "lucide-react";
import {
  registerSchema,
  type RegisterFormValues,
} from "../features/auth/authSchemas";
import { useRegister } from "../features/auth/useRegister";

const ROLES = [
  {
    id: "teacher" as const,
    label: "Faculty Member",
    icon: BookOpen,
    desc: "Manage classes and academic progress",
    color: "slate",
  },
  {
    id: "student" as const,
    label: "Student",
    icon: GraduationCap,
    desc: "Access learning resources and tracking",
    color: "brand",
  },
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const registerMutation = useRegister();

  const {
    register: field,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "student" },
  });

  const selectedRole = watch("role");

  const nextStep = async () => {
    if (step === 1) {
      const isValid = await trigger("role");
      if (isValid) setStep(2);
    }
  };

  const prevStep = () => setStep(1);

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        navigate("/login", {
          state: { message: "Account created successfully! Please sign in." },
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* ── LEFT SIDE: FORM ─────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-50 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 opacity-60" />

        <div className="relative z-10 w-full max-w-md mx-auto">
          {/* Logo & Back */}
          <div className="flex items-center justify-between mb-12">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                <GraduationCap size={20} />
              </div>
              <span className="font-display text-xl font-bold text-slate-900">
                Campus<span className="text-brand-600">Hub</span>
              </span>
            </Link>
            <Link
              to="/login"
              className="text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <ChevronLeft size={16} /> Back to login
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
                    Join CampusHub
                  </h1>
                  <p className="text-slate-500 mb-8">
                    Choose your role to begin registration.
                  </p>

                  <div className="space-y-3 mb-8">
                    {ROLES.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setValue("role", role.id)}
                        className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                          selectedRole === role.id
                            ? "border-brand-500 bg-brand-50 shadow-sm"
                            : "border-slate-100 hover:border-slate-200 bg-slate-50"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            selectedRole === role.id
                              ? "bg-brand-600 text-white"
                              : "bg-white text-slate-400"
                          }`}
                        >
                          <role.icon size={24} />
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-bold ${selectedRole === role.id ? "text-slate-900" : "text-slate-600"}`}
                          >
                            {role.label}
                          </p>
                          <p className="text-xs text-slate-400">{role.desc}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedRole === role.id
                              ? "border-brand-500 bg-brand-500"
                              : "border-slate-200"
                          }`}
                        >
                          {selectedRole === role.id && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary w-full py-4 text-base font-bold shadow-brand-500/20 shadow-xl"
                  >
                    Continue Registration{" "}
                    <ArrowRight size={18} className="ml-2" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-600 mb-2"
                  >
                    <ArrowLeft size={14} /> Change Role
                  </button>
                  <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
                    Create Account
                  </h1>
                  <p className="text-slate-500 mb-6 uppercase text-[10px] font-mono tracking-widest bg-brand-50 px-2 py-1 inline-block rounded">
                    Registering as {selectedRole}
                  </p>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className={`input-field ${errors.fullName ? "input-error" : ""}`}
                      {...field("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-rose-500 mt-1.5 font-bold flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className={`input-field ${errors.email ? "input-error" : ""}`}
                        {...field("email")}
                      />
                      {errors.email && (
                        <p className="text-xs text-rose-500 mt-1.5 font-bold flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+977..."
                        className={`input-field ${errors.phone ? "input-error" : ""}`}
                        {...field("phone")}
                      />
                      {errors.phone && (
                        <p className="text-xs text-rose-500 mt-1.5 font-bold flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="Minimum 8 characters"
                        className={`input-field pr-12 ${errors.password ? "input-error" : ""}`}
                        {...field("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-rose-500 mt-1.5 font-bold flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.password.message}
                      </p>
                    )}
                  </div>

                  {registerMutation.isError && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs">
                      <AlertCircle size={14} /> Registration failed. Please try
                      again later.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="btn-primary w-full py-4 text-base font-bold shadow-brand-500/20 shadow-xl disabled:opacity-70"
                  >
                    {registerMutation.isPending
                      ? "Creating Account..."
                      : "Finalize Registration"}
                    {!registerMutation.isPending && (
                      <CheckCircle2 size={18} className="ml-2" />
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-600 font-bold hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT SIDE: IMAGE ────────────────────────────── */}
      <div className="hidden lg:flex flex-1 bg-slate-900 relative items-center justify-center overflow-hidden">
        <img
          src="/modern_college_campus_building_1778485561678.png"
          alt="Campus Building"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 to-slate-900/90" />

        <div className="relative z-10 max-w-lg p-12 text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-display font-bold mb-6">
              Built for Excellence
            </h2>
            <p className="text-lg text-slate-300">
              Join a digital-first academic community. Secure, fast, and
              designed to support every step of your educational journey.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
