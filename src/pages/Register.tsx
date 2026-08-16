import logo from "@/assets/logo/logo.svg";
import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import {
  GraduationCap,
  BookOpen,
  UserCog,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  Plus,
  Trash2,
} from "lucide-react"
import { Link } from "react-router-dom"
import { registerSchema, type RegisterFormData } from "@/features/auth/authSchemas"
import { useRegister } from "@/features/auth/useRegister"

// ── Role definitions ────────────────────────────────────
const REGISTER_ROLES = [
  {
    id: "STUDENT" as const,
    label: "Student",
    icon: GraduationCap,
    desc: "Access learning resources",
  },
  {
    id: "TEACHER" as const,
    label: "Teacher",
    icon: BookOpen,
    desc: "Manage academic progress",
  },
  {
    id: "PARENT" as const,
    label: "Parent",
    icon: UserCog,
    desc: "Monitor your child",
  },
]

export default function Register() {
  const [step, setStep] = useState(1)
  const [showPass, setShowPass] = useState(false)
  const { mutate: register, isPending, isError } = useRegister()

  const {
    register: field,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "STUDENT",
      childRollNumbers: [""],
    },
  })
console.log("Form errors:", errors)
  const selectedRole = watch("role")

  const { fields, append, remove } = useFieldArray({
    control,
    name: "childRollNumbers" as never,
  })

  const nextStep = async () => {
    if (step === 1) {
      const isValid = await trigger("role")
      if (isValid) setStep(2)
    }
  }

  const prevStep = () => setStep(1)

  const onSubmit = (data: RegisterFormData) => {
    console.log("Form submitted with:", data)
    register(data)
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* ── LEFT SIDE: FORM ─────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12 relative overflow-hidden">
        {/* Subtle background blur */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-50 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 opacity-60" />

        <div className="relative z-10 w-full max-w-md mx-auto">
          {/* Logo & Back */}
          <div className="flex items-center justify-between mb-12">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <img src={logo} alt="CampusHub" className="h-10 w-auto" />
            </Link>
            <Link
              to="/login"
              className="text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1 text-sm font-medium"
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
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-3xl font-display font-medium text-zinc-900 mb-2">
                    Join CampusHub
                  </h1>
                  <p className="text-zinc-500 mb-8">
                    Choose your role to begin registration.
                  </p>

                  {/* Role selector */}
                  <div className="space-y-3 mb-8">
                    {REGISTER_ROLES.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setValue("role", role.id)}
                        className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                          selectedRole === role.id
                            ? "border-brand-500 bg-brand-50 shadow-sm"
                            : "border-zinc-100 hover:border-zinc-200 bg-zinc-50"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            selectedRole === role.id
                              ? "bg-brand-600 text-white"
                              : "bg-white text-zinc-400"
                          }`}
                        >
                          <role.icon size={24} />
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              selectedRole === role.id
                                ? "text-zinc-900"
                                : "text-zinc-600"
                            }`}
                          >
                            {role.label}
                          </p>
                          <p className="text-xs text-zinc-400">{role.desc}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedRole === role.id
                              ? "border-brand-500 bg-brand-500"
                              : "border-zinc-200"
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
                    className="btn-primary w-full py-4 text-base font-medium shadow-brand-500/20 shadow-xl"
                  >
                    Continue Registration <ArrowRight size={18} className="ml-2" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-brand-600 mb-2"
                  >
                    <ArrowLeft size={14} /> Change Role
                  </button>

                  <h1 className="text-3xl font-display font-medium text-zinc-900 mb-2">
                    Create Account
                  </h1>
                  <p className="text-zinc-500 mb-6 uppercase text-[10px] font-mono tracking-widest bg-brand-50 px-2 py-1 inline-block rounded">
                    Registering as {selectedRole.toLowerCase()}
                  </p>

                  {isError && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-6 animate-fade-in">
                      <AlertCircle size={18} className="shrink-0" />
                      Registration failed. Please try again.
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className={`input-field ${errors.fullName ? "input-error" : ""}`}
                      {...field("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-rose-500 mt-1.5 font-medium flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-zinc-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className={`input-field ${errors.email ? "input-error" : ""}`}
                        {...field("email")}
                      />
                      {errors.email && (
                        <p className="text-xs text-rose-500 mt-1.5 font-medium flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-zinc-700 mb-2">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+977..."
                        className="input-field"
                        {...field("phone")}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="Minimum 6 characters"
                        className={`input-field pr-12 ${
                          errors.password ? "input-error" : ""
                        }`}
                        {...field("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
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

                  {/* Parent — child roll numbers */}
                  {selectedRole === "PARENT" && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">
                        Child's Roll Number(s)
                      </label>
                      <p className="text-xs text-zinc-400 mb-3">
                        Add the roll number of each child enrolled in the college
                      </p>
                      <div className="space-y-2">
                        {fields.map((f, index) => (
                          <div key={f.id} className="flex gap-2">
                            <input
                              {...field(`childRollNumbers.${index}` as any)}
                              className={`flex-1 input-field ${
                                errors.childRollNumbers
                                  ? "input-error"
                                  : ""
                              }`}
                              placeholder={`Roll number ${index + 1}`}
                            />
                            {fields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => append("")}
                        className="mt-3 inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium"
                      >
                        <Plus size={16} />
                        Add another child
                      </button>
                      {errors.childRollNumbers && (
                        <p className="text-xs text-rose-500 mt-2 font-medium flex items-center gap-1">
                          <AlertCircle size={12} />{" "}
                          {errors.childRollNumbers.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="btn-primary w-full py-4 text-base font-medium shadow-brand-500/20 shadow-xl disabled:opacity-70 mt-6"
                  >
                    {isPending ? "Creating account..." : "Create Account"}
                    {!isPending && <CheckCircle2 size={18} className="ml-2" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="mt-8 text-center text-zinc-500 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-600 font-medium hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT SIDE: IMAGE ────────────────────────────── */}
      <div className="hidden lg:flex flex-1 bg-zinc-900 relative items-center justify-center overflow-hidden">
        <img
          src="/modern_college_campus_building_1778485561678.png"
          alt="Campus Building"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 to-zinc-900/90" />

        <div className="relative z-10 max-w-lg p-12 text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-display font-medium mb-6">
              Welcome to CampusHub
            </h2>
            <p className="text-lg text-zinc-300">
              Join our digital-first academic community. Secure, fast, and
              designed to support every step of your educational journey.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
