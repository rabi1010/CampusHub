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
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-ink-900 overflow-hidden">
      {/* ── Mobile sidebar overlay ───────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar — desktop always visible ────────── */}
      <div className="hidden md:flex shrink-0">
        <Sidebar
          role={user.role}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
      </div>

      {/* ── Sidebar — mobile drawer ──────────────────── */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-50 md:hidden flex",
          "transition-transform duration-300",
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
        {/* Topbar */}
        <Topbar onMobileMenuToggle={() => setMobileOpen((o) => !o)} />

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8
                     bg-ink-900"
        >
          {/* Page content wrapper with max width */}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
