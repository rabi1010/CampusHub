import logo from "@/assets/logo/logo.svg";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import clsx from "clsx";

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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-white/[0.07] py-3" : "py-4"
        }`}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group active:scale-95 transition-all">
          <img src={logo} alt="CampusHub" className="h-9 w-auto" />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={label}>
              <Link
                to={to}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 group ${pathname === to ? "text-brand-600" : "text-zinc-600 hover:text-zinc-900"
                  }`}
              >
                <span className="link-underline">{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-zinc-600 hover:text-brand-600 transition-colors link-underline">
            Sign in
          </Link>
          <Link to="/login" className="px-6 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2.5 rounded-xl bg-zinc-50 text-zinc-500 hover:text-brand-600 hover:bg-brand-50 transition-all border border-zinc-100"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-zinc-100
                        px-6 py-6 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top-4 duration-300"
        >
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className={clsx(
                "py-3 px-4 rounded-xl text-sm font-medium transition-all group",
                pathname === to ? "bg-brand-50 text-brand-600" : "text-zinc-600 hover:bg-zinc-50 hover:text-brand-600"
              )}
            >
              <span className="link-underline">{label}</span>
            </Link>
          ))}
          <div className="h-px bg-zinc-100 my-2" />
          <Link to="/login" className="flex items-center justify-center py-4 bg-brand-600 text-white font-medium rounded-2xl shadow-lg shadow-brand-500/10 active:scale-[0.98] transition-all">
            Sign in to CampusHub
          </Link>
        </div>
      )}
    </header>
  );
}
