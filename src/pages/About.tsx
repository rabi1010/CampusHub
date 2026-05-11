import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Target,
  Zap,
  Heart,
  Globe,
  Code2,
  Database,
  ShieldCheck,
  Cpu,
} from "lucide-react";

const VALUES = [
  {
    icon: Target,
    title: "Mission-Driven",
    desc: "We build tools that solve real academic challenges, prioritizing functionality and user success.",
  },
  {
    icon: Zap,
    title: "High Performance",
    desc: "Optimized architectures ensure the system remains lightning-fast, even with thousands of records.",
  },
  {
    icon: Heart,
    title: "User-Centric",
    desc: "Designed with empathy for students and faculty, ensuring a steep learning curve and high adoption.",
  },
  {
    icon: Globe,
    title: "Future-Ready",
    desc: "Scalable infrastructure built to grow alongside your institution, from small colleges to large universities.",
  },
];

const TEAM = [
  {
    initials: "RS",
    name: "Rabi Shankar Chy",
    role: "Architect & Lead Dev",
    color: "bg-brand-50 text-brand-700",
  },
  {
    initials: "JD",
    name: "Jane Doe",
    role: "UX Strategy",
    color: "bg-slate-100 text-slate-700",
  },
  {
    initials: "AS",
    name: "Alex Smith",
    role: "System Engineer",
    color: "bg-slate-100 text-slate-700",
  },
];

const STACK = [
  {
    icon: Code2,
    label: "Frontend Ecosystem",
    items: ["React 19 + Vite", "TypeScript", "Tailwind CSS 4", "Framer Motion"],
  },
  {
    icon: Database,
    label: "Backend & Data",
    items: ["Java Spring Boot", "PostgreSQL", "JPA / Hibernate", "JWT Security"],
  },
];

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-50/30 -skew-x-12 translate-x-1/4 -z-10" />
        
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold mb-6">
              Our Journey
            </span>
            <h1 className="text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight mb-6">
              Revolutionizing Campus <br />
              <span className="text-brand-600 italic">Management</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
              CampusHub was born from a simple observation: educational institutions deserve better 
              software. We've combined deep academic insights with modern engineering to create a 
              platform that actually works.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MISSION QUOTE ────────────────────────────────── */}
      <section className="py-24">
        <div className="section-container">
          <div className="card-base p-12 lg:p-20 relative overflow-hidden bg-slate-900 text-white">
            <div className="absolute bottom-0 right-0 p-12 opacity-5">
              <ShieldCheck size={240} />
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative z-10 max-w-3xl"
            >
              <div className="w-12 h-1 bg-brand-500 mb-8" />
              <h2 className="text-3xl lg:text-4xl font-display font-medium leading-snug mb-8">
                "Our mission is to empower educational institutions with secure, 
                intelligent, and <span className="text-brand-400">human-centric</span> technology 
                that simplifies administration and amplifies learning."
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
                  <Cpu size={20} />
                </div>
                <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">
                  Est. 2024 • Academic Excellence
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES GRID ─────────────────────────────────── */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="section-container">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">What we stand for</h2>
              <p className="text-slate-600 max-w-md">The principles that guide our product development and engineering decisions every day.</p>
            </div>
            <Link to="/register" className="btn-primary">Join our community</Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:border-brand-100 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-brand-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <value.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM SECTION ────────────────────────────────── */}
      <section className="py-24">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">The minds behind CampusHub</h2>
            <p className="text-slate-600">A dedicated team of educators, designers, and engineers.</p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {TEAM.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="card-base p-8 text-center"
              >
                <div className={`w-20 h-20 rounded-2xl ${member.color} flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-inner`}>
                  {member.initials}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h4>
                <p className="text-sm text-slate-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ──────────────────────────────────── */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Engineered for <br /><span className="text-brand-400">Scale and Speed</span></h2>
              <p className="text-slate-400 text-lg mb-10">We use the most reliable and modern technology stack to ensure your data is secure and the performance is unmatched.</p>
              
              <div className="grid sm:grid-cols-2 gap-8">
                {STACK.map((group, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-brand-400">
                        <group.icon size={18} />
                      </div>
                      <p className="font-bold text-slate-200">{group.label}</p>
                    </div>
                    <ul className="space-y-2">
                      {group.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-2 text-slate-400 text-sm">
                          <span className="w-1 h-1 rounded-full bg-brand-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500/20 blur-[100px] rounded-full" />
              <div className="relative card-base bg-white/5 border-white/10 backdrop-blur-xl p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="px-3 py-1 rounded-md bg-white/10 text-[10px] font-mono text-slate-300">Terminal</div>
                </div>
                <div className="space-y-3 font-mono text-sm">
                  <p className="text-emerald-400">➜ <span className="text-white">campushub-os</span> <span className="text-slate-500">git:(main)</span> <span className="text-green-400">npm run deploy</span></p>
                  <p className="text-slate-400">Optimizing production build...</p>
                  <p className="text-slate-400">Initializing PostgreSQL connection...</p>
                  <p className="text-slate-400">Spring Boot context started in 2.45s</p>
                  <p className="text-green-400 font-bold">✓ Deployment successful. Campus is live.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────── */}
      <section className="py-32 text-center">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to see it in action?</h2>
            <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto">Join the institutions that are choosing the future of education management today.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login" className="btn-primary px-10 py-4 text-base">
                Explore Portal <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

