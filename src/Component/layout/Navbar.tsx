import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Features", to: "/#features" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-white/[0.07] py-3" : "py-5"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg bg-jade-500/20 border border-jade-500/30
                          flex items-center justify-center
                          group-hover:bg-jade-500/30 transition-colors"
          >
            <GraduationCap size={16} className="text-jade-400" />
          </div>
          <span className="font-display text-lg text-ink-50">
            Campus<span className="text-jade-400">Hub</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={label}>
              <Link
                to={to}
                className={`nav-link px-3 py-1.5 rounded-lg ${
                  pathname === to ? "text-jade-400 bg-jade-500/10" : ""
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">
            Sign in
          </Link>
          <Link to="/login" className="btn-primary text-sm px-5 py-2">
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/5
                     text-ink-300 transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="md:hidden glass border-t border-white/[0.07]
                        px-6 py-4 flex flex-col gap-1"
        >
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="py-2.5 px-3 rounded-lg text-sm text-ink-200
                         hover:text-jade-400 hover:bg-jade-500/10
                         transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="divider my-2" />
          <Link to="/login" className="btn-primary justify-center mt-1">
            Sign in to CampusHub
          </Link>
        </div>
      )}
    </header>
  );
}
