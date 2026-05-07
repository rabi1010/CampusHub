import { Link, useLocation } from "react-router-dom";
import { GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { NAV_BY_ROLE, type NavGroup } from "../../config/navigation";
import type { Role } from "../../features/auth/authSlice";
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
        "relative flex flex-col h-full border-r border-white/[0.07]",
        "bg-ink-950/80 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* ── Logo ──────────────────────────────────────── */}
      <div
        className={clsx(
          "flex items-center gap-3 px-4 py-5 border-b border-white/[0.07]",
          collapsed && "justify-center px-0",
        )}
      >
        <div
          className="w-8 h-8 rounded-lg bg-jade-500/20 border border-jade-500/30
                     flex items-center justify-center shrink-0"
        >
          <GraduationCap size={16} className="text-jade-400" />
        </div>
        {!collapsed && (
          <span className="font-display text-base text-ink-50 whitespace-nowrap">
            Campus<span className="text-jade-400">Hub</span>
          </span>
        )}
      </div>

      {/* ── Navigation ────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-6">
        {navGroups.map(({ group, items }) => (
          <div key={group}>
            {/* Group label — hidden when collapsed */}
            {!collapsed && (
              <p
                className="text-[10px] font-mono font-medium text-ink-600
                           uppercase tracking-widest px-3 mb-2"
              >
                {group}
              </p>
            )}

            <ul className="flex flex-col gap-1">
              {items.map(({ label, to, icon: Icon, badge }) => {
                const active = isActive(to);
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      title={collapsed ? label : undefined}
                      className={clsx(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                        "text-sm transition-all duration-150 relative group",
                        collapsed && "justify-center px-0 py-3",
                        active
                          ? "bg-jade-500/15 text-jade-300 border border-jade-500/20"
                          : "text-ink-400 hover:text-ink-100 hover:bg-white/5",
                      )}
                    >
                      {/* Active indicator bar */}
                      {active && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2
                                     w-0.5 h-5 bg-jade-400 rounded-r-full"
                        />
                      )}

                      <Icon
                        size={16}
                        className={clsx(
                          "shrink-0 transition-colors",
                          active
                            ? "text-jade-400"
                            : "text-ink-500 group-hover:text-ink-300",
                        )}
                      />

                      {!collapsed && (
                        <span className="flex-1 whitespace-nowrap">
                          {label}
                        </span>
                      )}

                      {/* Badge */}
                      {!collapsed && badge && badge > 0 && (
                        <span
                          className="text-[10px] font-mono font-medium
                                     bg-jade-500/20 text-jade-400
                                     px-1.5 py-0.5 rounded-full"
                        >
                          {badge}
                        </span>
                      )}

                      {/* Tooltip when collapsed */}
                      {collapsed && (
                        <span
                          className="absolute left-full ml-3 px-2.5 py-1.5
                                     rounded-lg glass text-xs text-ink-100
                                     whitespace-nowrap opacity-0
                                     group-hover:opacity-100
                                     pointer-events-none transition-opacity
                                     z-50"
                        >
                          {label}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Role badge at bottom ───────────────────────── */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-white/[0.07]">
          <span
            className={clsx(
              "text-[10px] font-mono font-medium uppercase tracking-widest",
              "px-2 py-1 rounded-md",
              role === "admin"
                ? "bg-jade-500/10 text-jade-400"
                : role === "teacher"
                  ? "bg-ink-500/30 text-ink-300"
                  : "bg-gold-500/10 text-gold-400",
            )}
          >
            {role} portal
          </span>
        </div>
      )}

      {/* ── Collapse toggle ────────────────────────────── */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full
                   glass border border-white/[0.1]
                   flex items-center justify-center
                   text-ink-400 hover:text-ink-100
                   transition-colors z-10"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
