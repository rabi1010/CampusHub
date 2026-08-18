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
import { authService } from "../../services/authService";
import clsx from "clsx";

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

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

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      dispatch(clearCredentials());
      navigate("/login");
    }
  };

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  const initials =
    user?.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  return (
    <header className="h-20 flex items-center justify-between px-6 bg-white border-b border-zinc-100 z-10 sticky top-0">
      {/* ── Left: Mobile Toggle & Search ─────────────────── */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2.5 rounded-xl bg-zinc-50 text-zinc-500 hover:text-brand-600 hover:bg-brand-50 transition-all border border-zinc-100"
        >
          <Menu size={20} />
        </button>

        <div className="relative max-w-md w-full hidden md:block">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search dashboard, students, reports..."
            className="w-full pl-12 pr-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-white border border-zinc-200 rounded-md text-[10px] font-medium text-zinc-400">
            ⌘K
          </div>
        </div>
      </div>

      {/* ── Right: Notifications & User Profile ─────────── */}
      <div className="flex items-center gap-4">
        {/* Notifications Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className={clsx(
              "relative p-2.5 rounded-xl transition-all border duration-200",
              notifOpen 
                ? "bg-brand-50 text-brand-600 border-brand-200" 
                : "bg-white text-zinc-500 border-zinc-100 hover:bg-zinc-50 hover:text-zinc-900 hover:scale-105 active:scale-95"
            )}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white ring-1 ring-red-500/30" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-zinc-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="px-6 py-4 border-b border-zinc-50 flex items-center justify-between">
                <h3 className="font-medium text-zinc-900">Notifications</h3>
                <span className="bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full text-[10px] font-medium">
                  {unreadCount} NEW
                </span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div 
                    key={n.id} 
                    className={clsx(
                      "px-6 py-4 hover:bg-zinc-50 transition-colors cursor-pointer border-b border-zinc-50 flex gap-4",
                      n.unread && "bg-brand-50/30"
                    )}
                  >
                    <div className={clsx(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0",
                      n.unread ? "bg-brand-600" : "bg-zinc-200"
                    )} />
                    <div>
                      <p className="text-sm font-medium text-zinc-900 leading-tight mb-1">{n.text}</p>
                      <p className="text-[10px] text-zinc-400 font-medium uppercase">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-zinc-50 border-t border-zinc-100 text-center">
                <button className="text-xs font-medium text-brand-600 hover:underline">View all activity</button>
              </div>
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="h-8 w-px bg-zinc-100 hidden md:block" />

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className={clsx(
              "flex items-center gap-3 p-1.5 rounded-2xl transition-all border duration-200",
              profileOpen 
                ? "bg-brand-50 border-brand-200" 
                : "bg-white border-zinc-100 hover:bg-zinc-50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            )}
          >
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-medium text-sm shadow-brand-500/30 shadow-md">
              {initials}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-zinc-900 leading-none mb-1">{user?.fullName}</p>
              <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">{user?.role}</p>
            </div>
            <ChevronDown size={16} className={clsx("text-zinc-400 transition-transform", profileOpen && "rotate-180")} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-zinc-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-6 bg-zinc-50 border-b border-zinc-100">
                <p className="text-sm font-medium text-zinc-900">{user?.fullName}</p>
                <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate(user?.role === "admin" ? "/admin/settings" : "/dashboard/teacher");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                >
                  <User size={18} className="text-zinc-400" />
                  My Account
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/admin/settings");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                >
                  <Settings size={18} className="text-zinc-400" />
                  Settings
                </button>
                <div className="h-px bg-zinc-100 my-2 mx-4" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
