import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  LogOut,
  User,
  ChevronDown,
  Settings,
  Menu,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearCredentials } from "../../features/auth/authSlice";
import clsx from "clsx";

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

// ── Fake notifications (replace with real API later) ────
const MOCK_NOTIFICATIONS = [
  { id: 1, text: "New student registered", time: "2m ago", unread: true },
  { id: 2, text: "Attendance sheet updated", time: "1h ago", unread: true },
  { id: 3, text: "Exam schedule posted", time: "3h ago", unread: false },
];

export default function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/login");
  };

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  // Get initials from full name
  const initials =
    user?.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  return (
    <header
      className="relative z-50 h-16 flex items-center justify-between px-4 md:px-6
                 border-b border-white/[0.07] bg-ink-950/60 backdrop-blur-xl
                 shrink-0"
    >
      {/* ── Left — mobile menu + search ─────────────── */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-white/5
                     text-ink-400 transition-colors"
        >
          <Menu size={18} />
        </button>

        {/* Search bar */}
        <div className="relative hidden sm:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-52 lg:w-72 pl-9 pr-4 py-2 rounded-xl text-sm
                       bg-white/5 border border-white/8
                       text-ink-200 placeholder-ink-600
                       focus:outline-none focus:border-jade-500/40
                       focus:bg-white/8 transition-all duration-200"
          />
        </div>
      </div>

      {/* ── Right — notifications + profile ─────────── */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setNotifOpen((o) => !o);
              setProfileOpen(false);
            }}
            className="relative p-2.5 rounded-xl hover:bg-white/5
                       text-ink-400 hover:text-ink-100
                       transition-colors"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2
                           rounded-full bg-jade-500"
              />
            )}
          </button>

          {/* Notifications dropdown */}
          {notifOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-80
                         glass rounded-2xl shadow-card-lg
                         border border-white/8 z-50
                         animate-fade-up"
            >
              <div
                className="flex items-center justify-between
                              px-4 py-3 border-b border-white/7"
              >
                <p className="text-sm font-medium text-ink-100">
                  Notifications
                </p>
                <span
                  className="text-xs font-mono bg-jade-500/15
                             text-jade-400 px-2 py-0.5 rounded-full"
                >
                  {unreadCount} new
                </span>
              </div>

              <ul className="py-2 max-h-72 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <li
                    key={n.id}
                    className={clsx(
                      "flex items-start gap-3 px-4 py-3 text-sm",
                      "hover:bg-white/5 transition-colors cursor-pointer",
                      n.unread && "bg-jade-500/5",
                    )}
                  >
                    {n.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-jade-500 mt-1.5 shrink-0" />
                    )}
                    {!n.unread && (
                      <span className="w-1.5 h-1.5 mt-1.5 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-ink-200 leading-snug">{n.text}</p>
                      <p className="text-xs text-ink-500 mt-0.5">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="px-4 py-3 border-t border-white/[0.07]">
                <button className="text-xs text-jade-400 hover:text-jade-300 transition-colors">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setProfileOpen((o) => !o);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5
                       rounded-xl hover:bg-white/5
                       transition-colors group"
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-lg bg-jade-500/20
                         border border-jade-500/30
                         flex items-center justify-center
                         text-xs font-semibold text-jade-300"
            >
              {initials}
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-ink-100 leading-none">
                {user?.fullName ?? "User"}
              </p>
              <p className="text-[11px] text-ink-500 mt-0.5 capitalize">
                {user?.role}
              </p>
            </div>

            <ChevronDown
              size={14}
              className={clsx(
                "text-ink-500 transition-transform duration-200",
                profileOpen && "rotate-180",
              )}
            />
          </button>

          {/* Profile dropdown menu */}
          {profileOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-52
                         glass rounded-2xl shadow-card-lg
                         border border-white/8 z-50
                         animate-fade-up overflow-hidden"
            >
              {/* User info */}
              <div className="px-4 py-3 border-b border-white/7">
                <p className="text-sm font-medium text-ink-100">
                  {user?.fullName}
                </p>
                <p className="text-xs text-ink-500 mt-0.5 truncate">
                  {user?.email}
                </p>
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate(
                      user?.role === "admin"
                        ? "/admin/settings"
                        : user?.role === "teacher"
                          ? "/dashboard/teacher"
                          : "/student/profile",
                    );
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5
                             text-sm text-ink-300 hover:text-ink-100
                             hover:bg-white/5 transition-colors"
                >
                  <User size={14} />
                  My Profile
                </button>

                {user?.role === "admin" && (
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/admin/settings");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5
                               text-sm text-ink-300 hover:text-ink-100
                               hover:bg-white/5 transition-colors"
                  >
                    <Settings size={14} />
                    Settings
                  </button>
                )}
              </div>

              <div className="divider" />

              {/* Logout */}
              <div className="py-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5
                             text-sm text-red-400 hover:text-red-300
                             hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
