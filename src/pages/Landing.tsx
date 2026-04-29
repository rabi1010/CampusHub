import { Link } from "react-router-dom";
import {
  ArrowRight,
  LayoutDashboard,
  Users,
  BookOpen,
  Bell,
  BarChart3,
  Shield,
  CheckCircle2,
  Star,
  GraduationCap,
  UserCog,
  ChevronRight,
} from "lucide-react";

/* ── Static data (keep out of component for clean JSX) ── */

const STATS = [
  { value: "500+", label: "Students managed" },
  { value: "50+", label: "Teachers onboard" },
  { value: "20+", label: "Active courses" },
  { value: "99%", label: "Uptime guarantee" },
];

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Role-based dashboards",
    desc: "Separate, purpose-built views for admins, teachers, and students.",
    color: "jade",
  },
  {
    icon: Users,
    title: "Student & teacher management",
    desc: "Full CRUD with search, filter, and pagination for hundreds of records.",
    color: "ink",
  },
  {
    icon: BookOpen,
    title: "Course management",
    desc: "Create and assign courses to departments. Track enrollment live.",
    color: "gold",
  },
  {
    icon: Bell,
    title: "Notices & announcements",
    desc: "Post urgent or general notices. Targeted by role — everyone sees what matters.",
    color: "jade",
  },
  {
    icon: BarChart3,
    title: "Analytics overview",
    desc: "Attendance rates, GPA trends, course progress — all at a glance.",
    color: "ink",
  },
  {
    icon: Shield,
    title: "JWT-based security",
    desc: "Role-based access control. Secure endpoints, protected routes.",
    color: "gold",
  },
];

const ROLES = [
  {
    icon: UserCog,
    role: "Admin",
    color: "jade",
    perks: [
      "Full student & teacher CRUD",
      "Course and department management",
      "Post college-wide notices",
      "System settings & configuration",
      "Analytics and reporting",
    ],
  },
  {
    icon: GraduationCap,
    role: "Teacher",
    color: "ink",
    perks: [
      "View assigned students",
      "Mark and track attendance",
      "Upload and manage marks",
      "Post class notices",
      "Personal schedule overview",
    ],
  },
  {
    icon: BookOpen,
    role: "Student",
    color: "gold",
    perks: [
      "Personal dashboard & profile",
      "View enrolled courses",
      "Check attendance history",
      "Read notices and alerts",
      "Access marks and GPA",
    ],
  },
];

/* Color maps — avoids long ternary chains in JSX */
const ICON_COLOR: Record<string, string> = {
  jade: "bg-jade-500/10 text-jade-400 border-jade-500/20",
  ink: "bg-ink-500/20 text-ink-200 border-ink-400/20",
  gold: "bg-gold-500/10 text-gold-400 border-gold-500/20",
};

const BADGE_COLOR: Record<string, string> = {
  jade: "bg-jade-500/10 border-jade-500/20 text-jade-300",
  ink: "bg-ink-600/30 border-ink-400/20 text-ink-200",
  gold: "bg-gold-500/10 border-gold-500/20 text-gold-300",
};

/* ── Component ─────────────────────────────────────────── */

export default function Landing() {
  return (
    <div className="grid-texture">
      {/* ── 1. HERO ──────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center
                          justify-center overflow-hidden pt-24 pb-20"
      >
        {/* Decorative background orbs */}
        <div
          className="orb w-150 h-150 bg-jade-500
                        top-[-100px] left-[-200px]"
        />
        <div
          className="orb w-[500px] h-[500px] bg-ink-500
                        bottom-[-100px] right-[-150px] opacity-[0.12]"
        />
        <div
          className="orb w-[300px] h-[300px] bg-gold-500
                        top-[30%] right-[10%] opacity-[0.06]"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Eyebrow badge */}
          <div
            className="animate-fade-up inline-flex items-center gap-2
                          px-3 py-1.5 rounded-full text-xs font-mono
                          bg-jade-500/10 text-jade-400 border border-jade-500/20 mb-8"
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-jade-400
                             animate-pulse-slow"
            />
            Smart College Management System
          </div>

          {/* Main headline */}
          <h1
            className="animate-fade-up delay-100 font-display
                         text-5xl md:text-7xl text-ink-50
                         leading-[1.08] mb-6"
          >
            Empowering
            <br />
            <span className="gradient-text italic">Education,</span>
            <br />
            Simplifying Campus
          </h1>

          <p
            className="animate-fade-up delay-200 text-lg text-ink-300
                        max-w-xl mx-auto leading-relaxed mb-10"
          >
            CampusHub unifies student management, attendance, marks, and
            communication into one clean, fast, and secure platform.
          </p>

          {/* CTA buttons */}
          <div
            className="animate-fade-up delay-300 flex flex-col
                          sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login" className="btn-primary px-8 py-3.5 text-base">
              Get started free
              <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="btn-secondary px-8 py-3.5 text-base">
              Learn more
            </Link>
          </div>

          {/* Social proof */}
          <div
            className="animate-fade-up delay-400 flex items-center
                          justify-center gap-2 mt-8 text-sm text-ink-500"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className="fill-gold-400 text-gold-400"
                />
              ))}
            </div>
            <span>Built with React + Java Spring Boot PostgreSQL</span>
          </div>
        </div>
      </section>

      {/* ── 2. STATS BAR ─────────────────────────────── */}
      <section className="py-16 border-y border-white/[0.06]">
        <div
          className="max-w-5xl mx-auto px-6
                        grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className={`text-center animate-fade-up delay-${(i + 1) * 100}`}
            >
              <p
                className="font-display text-4xl md:text-5xl
                            gradient-text mb-1"
              >
                {value}
              </p>
              <p className="text-sm text-ink-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. FEATURES GRID ─────────────────────────── */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-label">Features</span>
          <h2
            className="font-display text-4xl md:text-5xl
                         text-ink-50 mt-4 mb-4"
          >
            Everything your campus needs
          </h2>
          <p className="text-ink-400 max-w-lg mx-auto">
            A complete toolkit for college administration — built for scale,
            designed for simplicity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
            <div
              key={title}
              className={`glass rounded-2xl p-6 hover:border-white/20
                          transition-all duration-300 hover:-translate-y-1
                          hover:shadow-card-lg
                          animate-fade-up delay-${((i % 3) + 1) * 100}
                          group cursor-default`}
            >
              <div
                className={`w-10 h-10 rounded-xl border
                               flex items-center justify-center mb-4
                               ${ICON_COLOR[color]}`}
              >
                <Icon size={18} />
              </div>
              <h3 className="font-medium text-ink-100 mb-2">{title}</h3>
              <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
              <div
                className="mt-4 flex items-center gap-1 text-xs
                              text-jade-500 opacity-0
                              group-hover:opacity-100 transition-opacity"
              >
                Learn more <ChevronRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. ROLES SECTION ─────────────────────────── */}
      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="section-label">Access levels</span>
            <h2
              className="font-display text-4xl md:text-5xl
                           text-ink-50 mt-4 mb-4"
            >
              Built for every role
            </h2>
            <p className="text-ink-400 max-w-lg mx-auto">
              Three distinct portals, each tailored to its users.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {ROLES.map(({ icon: Icon, role, color, perks }, i) => (
              <div
                key={role}
                className={`glass rounded-2xl p-7 hover:border-white/20
                            transition-all duration-300
                            animate-fade-up delay-${(i + 1) * 100}`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl border
                                 flex items-center justify-center mb-5
                                 ${ICON_COLOR[color]}`}
                >
                  <Icon size={22} />
                </div>

                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full
                                  text-xs font-mono border mb-3
                                  ${BADGE_COLOR[color]}`}
                >
                  {role}
                </span>

                <ul className="flex flex-col gap-2.5 mt-4">
                  {perks.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2.5
                                   text-sm text-ink-300"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-jade-500 mt-0.5 shrink-0"
                      />
                      {p}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/login"
                  className="mt-6 w-full btn-ghost justify-center text-sm
                             border border-white/[0.07] rounded-xl py-2.5"
                >
                  Sign in as {role}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FINAL CTA ─────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 relative overflow-hidden">
            <div
              className="orb w-80 h-80 bg-jade-500
                            -top-20 -left-20 opacity-10"
            />
            <div
              className="orb w-80 h-80 bg-ink-400
                            -bottom-20 -right-20 opacity-10"
            />
            <div className="relative z-10">
              <h2
                className="font-display text-4xl md:text-5xl
                             text-ink-50 mb-4"
              >
                Ready to modernise your campus?
              </h2>
              <p className="text-ink-400 mb-8 max-w-md mx-auto">
                Join hundreds of institutions already using CampusHub.
              </p>
              <Link to="/login" className="btn-primary px-10 py-4 text-base">
                Start now — it's free
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
