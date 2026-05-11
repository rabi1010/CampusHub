import { Link } from "react-router-dom";
import { GraduationCap, GitFork, ExternalLink, Mail } from "lucide-react";

const LINKS = {
  Product: [
    { l: "Features", to: "/#features" },
    { l: "About", to: "/about" },
    { l: "Contact", to: "/contact" },
  ],
  Platform: [
    { l: "Admin portal", to: "/login" },
    { l: "Teacher portal", to: "/login" },
    { l: "Student portal", to: "/login" },
  ],
  Legal: [
    { l: "Privacy policy", to: "#" },
    { l: "Terms of service", to: "#" },
  ],
};

const SOCIALS = [
  { Icon: GitFork, href: "#", label: "GitHub" },
  { Icon: ExternalLink, href: "#", label: "Website" },
  { Icon: Mail, href: "#", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-8">
          {/* Brand column */}
          <div className="col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2.5 group transition-all active:scale-95">
              <div
                className="w-9 h-9 rounded-lg bg-brand-600 shadow-lg shadow-brand-500/20
                              flex items-center justify-center
                              group-hover:rotate-6 transition-all duration-300"
              >
                <GraduationCap size={18} className="text-white" />
              </div>
              <span className="font-display text-xl font-bold text-slate-900">
                Campus<span className="text-brand-600">Hub</span>
              </span>
            </Link>

            <p className="text-sm text-slate-500 leading-relaxed max-w-xs font-medium">
              A premium college management ecosystem designed to empower administrators,
              faculty, and students with high-performance digital tools.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center
                             text-slate-400 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50/50
                             hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title} className="space-y-6">
              <p
                className="text-[10px] font-bold text-slate-400
                            uppercase tracking-[0.2em]"
              >
                {title}
              </p>
              <ul className="flex flex-col gap-4">
                {items.map(({ l, to }) => (
                  <li key={l}>
                    <Link
                      to={to}
                      className="text-sm font-medium text-slate-600 hover:text-brand-600
                                 transition-all duration-300 group inline-block"
                    >
                      <span className="link-underline">{l}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-slate-100 mt-20 mb-8" />

        <div
          className="flex flex-col md:flex-row items-center
                        justify-between gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest"
        >
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} <span className="text-slate-900">CampusHub Enterprise</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-900 cursor-pointer transition-colors">v1.0.0 Stable</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <span className="hover:text-slate-900 cursor-pointer transition-colors">System Status: Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
