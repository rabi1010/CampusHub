import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  Quote,
} from "lucide-react";
import { useState, useEffect } from "react";

/* ── Static data ────────────────────────────────────────── */

const STATS = [
  { value: "1,200+", label: "Students managed" },
  { value: "85+", label: "Expert Faculty" },
  { value: "45+", label: "Modern Courses" },
  { value: "99.9%", label: "System Uptime" },
];

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Intuitive Dashboards",
    desc: "Tailored experiences for Admin, Faculty, and Students to streamline daily tasks.",
    color: "brand",
  },
  {
    icon: Users,
    title: "Member Directory",
    desc: "Comprehensive management of student and staff records with advanced filtering.",
    color: "slate",
  },
  {
    icon: BookOpen,
    title: "Curriculum Control",
    desc: "Manage courses, departments, and enrollment tracking in real-time.",
    color: "brand",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    desc: "Keep the campus informed with targeted announcements and urgent alerts.",
    color: "slate",
  },
  {
    icon: BarChart3,
    title: "Academic Analytics",
    desc: "Visualize performance trends, attendance rates, and growth metrics instantly.",
    color: "brand",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "Bank-grade JWT authentication and granular role-based access control.",
    color: "slate",
  },
];

const CAMPUS_IMAGES = [
  {
    url: "https://plus.unsplash.com/premium_photo-1682126255537-d3d08524f263?w=800&auto=format&fit=crop&q=80",
    title: "Collaborative Learning",
    desc: "Our modern libraries foster a culture of research and teamwork.",
  },
  {
    url: "https://plus.unsplash.com/premium_photo-1723802534136-7fd64e10c0d7?w=800&auto=format&fit=crop&q=80",
    title: "State-of-the-art Infrastructure",
    desc: "Experience education in a campus designed for the future.",
  },
];

const TESTIMONIALS = [
  {
    text: "CampusHub has completely transformed how we manage our departments. The efficiency gain is remarkable.",
    author: "Dr. Sarah Jenkins",
    role: "Dean of Sciences",
  },
  {
    text: "As a student, having all my attendance and marks in one place is a game changer. The UI is so clean!",
    author: "James Wilson",
    role: "Final Year Student",
  },
];

/* ── Component ─────────────────────────────────────────── */

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAMPUS_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ── 1. HERO SECTION ──────────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-100 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-brand-50 rounded-full blur-[120px]" />
        </div>

        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                Empowering 100+ Institutions
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.1] mb-6">
                The Modern OS for Your <br />
                <span className="text-brand-600">Smart Campus</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-lg">
                Streamline academic operations, enhance student engagement, and
                unify campus management with our all-in-one digital ecosystem.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login" className="btn-primary px-8 py-4 text-base group">
                  Get Started Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/about" className="btn-secondary px-8 py-4 text-base">
                  View Demo
                </Link>
              </div>
              
              <div className="mt-10 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                  ))}
                </div>
                <p>Trusted by 10k+ users worldwide</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/3]">
                <img
                  src="https://plus.unsplash.com/premium_photo-1682126255537-d3d08524f263?w=1000&auto=format&fit=crop&q=85"
                  alt="Modern Campus Life"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
              </div>
              
              {/* Floating card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[240px]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Attendance Rate</p>
                    <p className="text-lg font-bold text-slate-900">98.4%</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[98%]" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. STATS SECTION ─────────────────────────────── */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-brand-600 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURES SECTION ──────────────────────────── */}
      <section id="features" className="py-24">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Everything you need to <br />
              <span className="text-brand-600">run a modern campus</span>
            </h2>
            <p className="text-lg text-slate-600">
              A comprehensive suite of tools designed to simplify administration 
              and empower every member of your academic community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="card-base p-8 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                  feature.color === 'brand' ? 'bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-900 group-hover:text-white'
                }`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm mb-6">
                  {feature.desc}
                </p>
                <Link to="/about" className="inline-flex items-center gap-2 text-brand-600 font-semibold text-sm hover:underline">
                  Learn more <ChevronRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. CAMPUS LIFE SLIDER ────────────────────────── */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Experience Excellence <br />
                <span className="text-brand-400">In Every Corner</span>
              </h2>
              <p className="text-slate-400 text-lg mb-10">
                Beyond technology, we provide an environment that inspires 
                growth, creativity, and lifelong learning.
              </p>
              
              <div className="space-y-6">
                {CAMPUS_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`block w-full text-left p-6 rounded-2xl border transition-all ${
                      currentSlide === i 
                        ? 'bg-white/10 border-white/20 translate-x-2' 
                        : 'border-transparent hover:bg-white/5'
                    }`}
                  >
                    <h4 className={`font-bold mb-1 ${currentSlide === i ? 'text-white' : 'text-slate-400'}`}>
                      {img.title}
                    </h4>
                    <p className="text-sm text-slate-500">{img.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              {CAMPUS_IMAGES.map((img, i) => (
                <motion.img
                  key={i}
                  src={img.url}
                  alt={img.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: currentSlide === i ? 1 : 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. TESTIMONIALS ─────────────────────────────── */}
      <section className="py-24">
        <div className="section-container">
          <div className="bg-brand-600 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Quote size={200} />
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-8">
                <div className="flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={20} fill="currentColor" />)}
                </div>
              </div>
              
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl lg:text-3xl font-display italic mb-10 leading-relaxed"
              >
                "{TESTIMONIALS[currentSlide % TESTIMONIALS.length].text}"
              </motion.div>
              
              <div>
                <p className="text-xl font-bold">{TESTIMONIALS[currentSlide % TESTIMONIALS.length].author}</p>
                <p className="text-brand-200 text-sm">{TESTIMONIALS[currentSlide % TESTIMONIALS.length].role}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CTA SECTION ──────────────────────────────── */}
      <section className="pb-24">
        <div className="section-container">
          <div className="card-base p-12 lg:p-20 text-center relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-brand-50 rounded-full blur-[100px] -z-10" />
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Ready to modernize <br /> your campus?
            </h2>
            <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto">
              Join leading institutions in providing a world-class digital 
              experience for students and faculty alike.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/login" className="btn-primary px-10 py-4 text-base">
                Get Started Free
              </Link>
              <Link to="/register" className="btn-secondary px-10 py-4 text-base">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
