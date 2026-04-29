import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  UserCog,
  BookOpen,
  AlertCircle,
} from "lucide-react";

type Role = "admin" | "teacher" | "student";

const ROLES = [
  {
    id: "admin" as Role,
    label: "Admin",
    icon: UserCog,
    desc: "Manage the entire system",
    demo: "admin@campushub.edu",
  },
  {
    id: "teacher" as Role,
    label: "Teacher",
    icon: BookOpen,
    desc: "Attendance, marks & notices",
    demo: "teacher@campushub.edu",
  },
  {
    id: "student" as Role,
    label: "Student",
    icon: GraduationCap,
    desc: "View courses & progress",
    demo: "student@campushub.edu",
  },
];

/* After login, redirect each role to their dashboard */
const REDIRECTS: Record<Role, string> = {
  admin: "/dashboard/admin",
  teacher: "/dashboard/teacher",
  student: "/dashboard/student",
};

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const selected = ROLES.find((r) => r.id === role)!;

  const validate = (): boolean => {
    const e: { email?: string; password?: string } = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400)); // replace with real API call
    setLoading(false);
    navigate(REDIRECTS[role]);
  };

  const fillDemo = () => {
    setEmail(selected.demo);
    setPassword("demo123");
    setErrors({});
  };

  return (
    <div
      className="grid-texture min-h-screen flex items-center
                    justify-center px-4 pt-20"
    >
      {/* BG orbs */}
      <div
        className="orb w-[600px] h-[600px] bg-jade-500
                      top-[-200px] right-[-200px] opacity-[0.08]"
      />
      <div
        className="orb w-[400px] h-[400px] bg-ink-500
                      bottom-[-100px] left-[-100px] opacity-[0.1]"
      />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div
              className="w-10 h-10 rounded-xl bg-jade-500/20
                            border border-jade-500/30
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

        {/* Card */}
        <div className="glass rounded-2xl p-8 animate-fade-up">
          {/* Role picker */}
          <div className="mb-6">
            <p
              className="text-xs font-mono text-ink-500 uppercase
                          tracking-widest mb-3"
            >
              Select your role
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setRole(id);
                    setErrors({});
                  }}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2
                              rounded-xl border text-xs font-medium
                              transition-all duration-200 ${
                                role === id
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

          <div className="divider mb-6" />

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
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
                placeholder={selected.demo}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input-field ${
                  errors.email ? "border-red-500/50" : ""
                }`}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-xs font-mono text-ink-400
                                  uppercase tracking-wider"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-jade-500
                                   hover:text-jade-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`input-field pr-10 ${
                    errors.password ? "border-red-500/50" : ""
                  }`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-ink-500 hover:text-ink-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
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

          {/* Demo fill helper */}
          <div className="divider my-5" />
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

        <p className="text-center text-sm text-ink-500 mt-6">
          <Link to="/" className="hover:text-jade-400 transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
