import { Link } from "react-router-dom";
import {
  ArrowRight,
  Target,
  Zap,
  Heart,
  Globe,
  Code2,
  Database,
} from "lucide-react";

const VALUES = [
  {
    icon: Target,
    title: "Purpose-built",
    desc: "Every feature exists because a real campus needs it — no bloat.",
  },
  {
    icon: Zap,
    title: "Fast by design",
    desc: "Optimised queries, lazy loading, and client-side caching built in.",
  },
  {
    icon: Heart,
    title: "User-first",
    desc: "Tested with real students and teachers. Complexity lives in the backend.",
  },
  {
    icon: Globe,
    title: "Scale-ready",
    desc: "Monolith today, architected to split into microservices tomorrow.",
  },
];

const TEAM = [
  {
    initials: "RS",
    name: "Rabi Shankar Chy",
    role: "Full-stack developer",
    color: "bg-jade-500/20 text-jade-300",
  },
  {
    initials: "RS",
    name: "Rabi Shankar Chy",
    role: "UI / UX designer",
    color: "bg-ink-500/30 text-ink-200",
  },
  {
    initials: "RS",
    name: "Rabi Shankar Chy",
    role: "Backend engineer",
    color: "bg-gold-500/10 text-gold-300",
  },
];

const STACK = [
  {
    icon: Code2,
    label: "Frontend",
    items: ["React 18 + Vite", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    icon: Database,
    label: "Backend",
    items: ["Java Spring boot", "PostgreSQL", "Prisma ORM", "JWT Auth"],
  },
];

export default function About() {
  return (
    <div className="grid-texture">
      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div
          className="orb w-[500px] h-[500px] bg-jade-500
                        top-0 right-[-100px] opacity-[0.1]"
        />
        <div className="max-w-4xl mx-auto px-6">
          <span className="section-label">About CampusHub</span>
          <h1
            className="font-display text-5xl md:text-6xl text-ink-50
                         mt-5 mb-6 leading-tight"
          >
            Built by students,
            <br />
            <span className="gradient-text italic">for institutions</span>
          </h1>
          <p className="text-lg text-ink-300 max-w-2xl leading-relaxed">
            CampusHub started as a semester project and grew into a fully
            architected platform. We set out to replace outdated, fragmented
            college management tools with a single modern system that actually
            feels good to use.
          </p>
        </div>
      </section>

      {/* Mission quote */}
      <section className="py-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <div
            className="glass rounded-3xl p-10 md:p-16
                          relative overflow-hidden"
          >
            <div
              className="orb w-96 h-96 bg-jade-500
                            -bottom-32 -left-32 opacity-[0.08]"
            />
            <div className="relative z-10 max-w-2xl">
              <p className="section-label mb-6">Our mission</p>
              <blockquote
                className="font-display text-3xl md:text-4xl
                                     text-ink-50 leading-snug"
              >
                "To revolutionise how educational institutions operate by
                providing a secure, efficient, and{" "}
                <span className="gradient-text italic">user-friendly</span>{" "}
                management platform."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <span className="section-label">What we stand for</span>
        <h2 className="font-display text-4xl text-ink-50 mt-4 mb-12">
          Our values
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={`glass rounded-2xl p-6 hover:border-white/20
                             transition-all duration-300
                             animate-fade-up delay-${(i + 1) * 100}`}
            >
              <div
                className="w-9 h-9 rounded-lg bg-jade-500/10
                              border border-jade-500/20
                              flex items-center justify-center mb-4"
              >
                <Icon size={16} className="text-jade-400" />
              </div>
              <h3 className="font-medium text-ink-100 mb-2">{title}</h3>
              <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <span className="section-label">The people</span>
          <h2 className="font-display text-4xl text-ink-50 mt-4 mb-12">
            Who built this
          </h2>
          <div className="grid sm:grid-cols-3 gap-5 max-w-2xl">
            {TEAM.map(({ initials, name, role, color }) => (
              <div
                key={name}
                className="glass rounded-2xl p-6 text-center
                              hover:border-white/20 transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-full ${color}
                                 flex items-center justify-center
                                 text-lg font-semibold mx-auto mb-3`}
                >
                  {initials}
                </div>
                <p className="font-medium text-ink-100 text-sm">{name}</p>
                <p className="text-xs text-ink-500 mt-0.5">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <span className="section-label">Technology</span>
          <h2 className="font-display text-4xl text-ink-50 mt-4 mb-12">
            Built on solid foundations
          </h2>
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
            {STACK.map(({ icon: Icon, label, items }) => (
              <div key={label} className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Icon size={16} className="text-jade-400" />
                  <p className="text-sm font-mono font-medium text-ink-300">
                    {label}
                  </p>
                </div>
                <ul className="flex flex-col gap-2">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-ink-400
                                   flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-jade-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="font-display text-4xl text-ink-50 mb-4">
          Curious? Try it yourself.
        </h2>
        <p className="text-ink-400 mb-8">
          Sign in and explore the dashboards for each role.
        </p>
        <Link to="/login" className="btn-primary px-8 py-3.5 text-base">
          Go to login <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
