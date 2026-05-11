import { Link, useLocation } from "react-router-dom";
import { GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { NAV_BY_ROLE, type NavGroup } from "../../config/navigation";
import type { Role } from "../../features/auth/authSlice";
import { motion } from "framer-motion";
import clsx from "clsx";

interface SidebarProps {
  role: Role;
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ role, collapsed, onToggle }: SidebarProps) {
  const { pathname } = useLocation();
  const navGroups: NavGroup[] = NAV_BY_ROLE[role];

  const isActive = (to: string) => pathname === to;

  return (
    <aside
      className={clsx(
        "relative flex flex-col h-full bg-white transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-20 border-r border-slate-100 shadow-sm",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* ── Background Soft Decoration ──────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.03),transparent_50%)] pointer-events-none" />

      {/* ── Logo Section ─────────────────────────────────── */}
      <div
        className={clsx(
          "h-20 flex items-center px-6 border-b border-slate-50 relative z-10",
          collapsed && "justify-center px-0",
        )}
      >
        <Link to="/" className="flex items-center gap-3 group transition-all active:scale-95">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 shrink-0 group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
            <GraduationCap size={20} />
          </div>
          {!collapsed && (
            <span className="font-display text-xl font-bold text-slate-900 tracking-tight whitespace-nowrap">
              Campus<span className="text-brand-600">Hub</span>
            </span>
          )}
        </Link>
      </div>

      {/* ── Navigation ─────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide relative z-10">
        {navGroups.map(({ group, items }) => (
          <div key={group} className="space-y-2">
            {!collapsed && (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] px-4 mb-4">
                {group}
              </p>
            )}

            <ul className="space-y-1.5">
              {items.map(({ label, to, icon: Icon, badge }) => {
                const active = isActive(to);
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      title={collapsed ? label : undefined}
                      className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 group relative",
                        collapsed && "justify-center px-0",
                        active
                          ? "bg-brand-50 text-brand-700 shadow-sm shadow-brand-500/5"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      {/* Active line indicator */}
                      {active && !collapsed && (
                        <div className="absolute left-0 w-1 h-5 bg-brand-600 rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.4)] z-20" />
                      )}

                      <Icon
                        size={19}
                        className={clsx(
                          "shrink-0 transition-all duration-500 relative z-10",
                          active ? "text-brand-600 scale-110" : "text-slate-400 group-hover:scale-125 group-hover:text-slate-900 group-hover:rotate-3",
                        )}
                      />

                      {!collapsed && (
                        <motion.span 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="font-medium text-sm whitespace-nowrap flex-1 relative z-10"
                        >
                          {label}
                        </motion.span>
                      )}

                      {/* Badge indicator */}
                      {!collapsed && badge && badge > 0 && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold border border-brand-200 relative z-10"
                        >
                          {badge}
                        </motion.span>
                      )}

                      {/* Hover Tooltip when collapsed */}
                      {collapsed && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-500 translate-x-3 group-hover:translate-x-0 whitespace-nowrap z-[100] shadow-2xl">
                          {label}
                          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Footer / User State ─────────────────────────── */}
      <div className="p-4 border-t border-slate-50 relative z-10">
        <div className={clsx(
          "flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 transition-all duration-300 hover:bg-slate-100 hover:border-brand-200 group cursor-pointer",
          collapsed && "justify-center"
        )}>
          <div className={clsx(
            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg uppercase bg-brand-600 text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
          )}>
            {role[0]}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-900 truncate uppercase tracking-widest group-hover:text-brand-600 transition-colors">{role}</p>
              <p className="text-[10px] text-slate-500 font-medium truncate">Authorized Session</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onToggle}
        className="absolute -right-4 top-24 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-500 transition-all duration-300 shadow-xl hover:shadow-brand-500/10 group z-30"
      >
        {collapsed ? (
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        ) : (
          <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        )}
      </button>
    </aside>
  );
}
