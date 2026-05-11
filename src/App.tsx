// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import { ProtectedRoute, RoleRoute, GuestRoute } from "./routes/ProtectedRoute";

// // Public pages
// import Landing from "./pages/Landing";
// import About from "./pages/About";
// import Contact from "./pages/Contact";

// // Auth pages
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import PublicLayout from "./Component/layout/PublicLayout";
// import DashboardLayout from "./Component/layout/DashboardLayout";

// // Dashboard page stubs — replace one by one as you build them
// const ComingSoon = ({ label }: { label: string }) => (
//   <div className="flex items-center justify-center min-h-[60vh]">
//     <div className="glass rounded-2xl p-12 text-center">
//       <p className="font-mono text-jade-400 text-sm mb-2">Coming next</p>
//       <h2 className="font-display text-3xl text-ink-100">{label}</h2>
//     </div>
//   </div>
// );

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* ── Public ───────────────────────────────── */}
//         <Route element={<PublicLayout />}>
//           <Route path="/" element={<Landing />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />
//         </Route>

//         {/* ── Guest only ───────────────────────────── */}
//         <Route element={<GuestRoute />}>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//         </Route>

//         {/* ── Protected — all roles need auth ──────── */}
//         <Route element={<ProtectedRoute />}>
//           <Route element={<DashboardLayout />}>
//             {/* Admin only */}
//             <Route element={<RoleRoute allowedRoles={["admin"]} />}>
//               <Route
//                 path="/dashboard/admin"
//                 element={<ComingSoon label="Admin Dashboard" />}
//               />
//               <Route
//                 path="/admin/students"
//                 element={<ComingSoon label="Manage Students" />}
//               />
//               <Route
//                 path="/admin/teachers"
//                 element={<ComingSoon label="Manage Teachers" />}
//               />
//               <Route
//                 path="/admin/courses"
//                 element={<ComingSoon label="Manage Courses" />}
//               />
//               <Route
//                 path="/admin/notices"
//                 element={<ComingSoon label="Manage Notices" />}
//               />
//               <Route
//                 path="/admin/settings"
//                 element={<ComingSoon label="Settings" />}
//               />
//             </Route>

//             {/* Teacher only */}
//             <Route element={<RoleRoute allowedRoles={["teacher"]} />}>
//               <Route
//                 path="/dashboard/teacher"
//                 element={<ComingSoon label="Teacher Dashboard" />}
//               />
//               <Route
//                 path="/teacher/students"
//                 element={<ComingSoon label="Students List" />}
//               />
//               <Route
//                 path="/teacher/attendance"
//                 element={<ComingSoon label="Attendance Entry" />}
//               />
//               <Route
//                 path="/teacher/marks"
//                 element={<ComingSoon label="Upload Marks" />}
//               />
//               <Route
//                 path="/teacher/notices"
//                 element={<ComingSoon label="Notices" />}
//               />
//             </Route>

//             {/* Student only */}
//             <Route element={<RoleRoute allowedRoles={["student"]} />}>
//               <Route
//                 path="/dashboard/student"
//                 element={<ComingSoon label="Student Dashboard" />}
//               />
//               <Route
//                 path="/student/courses"
//                 element={<ComingSoon label="My Courses" />}
//               />
//               <Route
//                 path="/student/profile"
//                 element={<ComingSoon label="My Profile" />}
//               />
//               <Route
//                 path="/student/notices"
//                 element={<ComingSoon label="My Notices" />}
//               />
//             </Route>
//           </Route>
//         </Route>

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
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
            <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/students" element={<StudentsList />} />
            <Route path="/teacher/attendance" element={<Attendance />} />
            <Route path="/teacher/marks" element={<Marks />} />
            <Route path="/teacher/notices" element={<TeacherNotices />} />
            {/* Student */}
            <Route element={<RoleRoute allowedRoles={["student"]} />}>
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<Profile />} />
              <Route path="/student/courses" element={<MyCourses />} />
              <Route path="/student/notices" element={<MyNotices />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
