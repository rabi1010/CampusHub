import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute, RoleRoute, GuestRoute } from "./routes/ProtectedRoute";

// Public pages
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicLayout from "./Component/layout/PublicLayout";
import DashboardLayout from "./Component/layout/DashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Students from "./pages/admin/Students";
import Teachers from "./pages/admin/Teachers";
import Courses from "./pages/admin/Courses";
import Notices from "./pages/admin/Notices";
import Settings from "./pages/admin/Settings";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentsList from "./pages/teacher/StudentsList";
import Attendance from "./pages/teacher/Attendance";
import Marks from "./pages/teacher/Marks";
import TeacherNotices from "./pages/teacher/TeacherNotices";
import StudentDashboard from "./pages/student/StudentDashboard";
import Profile from "./pages/student/Profile";
import MyCourses from "./pages/student/MyCourses";
import MyNotices from "./pages/student/MyNotices";
import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentAttendance from "./pages/parent/ParentAttendance";
import ParentNotices from "./pages/parent/ParentNotices";
import ParentProfile from "./pages/parent/ParentProfile";

// Temporary placeholder — replace as you build each page
const ComingSoon = ({ label }: { label: string }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-xl shadow-slate-200/50">
      <p className="font-mono text-brand-500 text-[10px] font-bold uppercase tracking-widest mb-4">Development in progress</p>
      <h2 className="font-display text-4xl text-slate-900 font-bold mb-4">{label}</h2>
      <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">We're building something amazing. This feature will be available in the next release.</p>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ───────────────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* ── Guest only ───────────────────────────── */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ── Protected ────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Admin */}
            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<Students />} />
              <Route path="/admin/teachers" element={<Teachers />} />
              <Route path="/admin/courses" element={<Courses />} />
              <Route path="/admin/notices" element={<Notices />} />

              <Route path="/admin/settings" element={<Settings />} />
            </Route>

            {/* Teacher */}
            <Route element={<RoleRoute allowedRoles={["teacher"]} />}>
              <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/students" element={<StudentsList />} />
              <Route path="/teacher/attendance" element={<Attendance />} />
              <Route path="/teacher/marks" element={<Marks />} />
              <Route path="/teacher/notices" element={<TeacherNotices />} />
            </Route>
            {/* Student */}
            <Route element={<RoleRoute allowedRoles={["student"]} />}>
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<Profile />} />
              <Route path="/student/courses" element={<MyCourses />} />
              <Route path="/student/notices" element={<MyNotices />} />
            </Route>

            {/* Parent */}
            <Route element={<RoleRoute allowedRoles={["parent"]} />}>
              <Route path="/parent/dashboard" element={<ParentDashboard />} />
              <Route path="/parent/attendance" element={<ParentAttendance />} />
              <Route path="/parent/notices" element={<ParentNotices />} />
              <Route path="/parent/profile" element={<ParentProfile />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
