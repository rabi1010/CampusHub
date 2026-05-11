import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import clsx from "clsx";

export default function DashboardLayout() {
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Redirect to login if somehow no user (extra safety net)
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[var(--bg-main)] overflow-hidden font-sans antialiased text-slate-900">
      {/* ── Mobile sidebar overlay ───────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40] lg:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar — desktop visible ────────── */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar
          role={user.role}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
      </div>

      {/* ── Sidebar — mobile drawer ──────────────────── */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-[50] lg:hidden flex",
          "transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar
          role={user.role}
          collapsed={false}
          onToggle={() => setMobileOpen(false)}
        />
      </div>

      {/* ── Main content area ────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar with shadow when scrolled if needed */}
        <Topbar onMobileMenuToggle={() => setMobileOpen((o) => !o)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            <Outlet />
          </div>
          
          {/* Subtle footer in dashboard */}
          <footer className="p-6 text-center text-slate-400 text-xs font-medium border-t border-slate-100 bg-white/50 backdrop-blur-sm mt-12 transition-colors hover:text-slate-600">
            <p className="cursor-default">
              © 2024 <span className="text-brand-500 font-bold hover:text-brand-600 cursor-pointer transition-colors link-underline">CampusHub Enterprise</span>. All rights reserved.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
