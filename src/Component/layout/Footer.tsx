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
    <footer className="border-t border-white/[0.07] bg-ink-950/80">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg bg-jade-500/20 border border-jade-500/30
                              flex items-center justify-center"
              >
                <GraduationCap size={16} className="text-jade-400" />
              </div>
              <span className="font-display text-lg text-ink-50">
                Campus<span className="text-jade-400">Hub</span>
              </span>
            </Link>

            <p className="text-sm text-ink-400 leading-relaxed max-w-xs">
              A modern college management platform built for administrators,
              teachers, and students.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg glass-light flex items-center justify-center
                             text-ink-400 hover:text-jade-400 hover:border-jade-500/30
                             transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <p
                className="text-xs font-mono font-medium text-ink-400
                            uppercase tracking-widest mb-4"
              >
                {title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {items.map(({ l, to }) => (
                  <li key={l}>
                    <Link
                      to={to}
                      className="text-sm text-ink-400 hover:text-jade-400
                                 transition-colors"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider mt-12 mb-6" />

        <div
          className="flex flex-col md:flex-row items-center
                        justify-between gap-4 text-xs text-ink-500"
        >
          <p>
            © {new Date().getFullYear()} CampusHub. Built with React + Node.js.
          </p>
          <p className="font-mono">v1.0.0-beta</p>
        </div>
      </div>
    </footer>
  );
}
