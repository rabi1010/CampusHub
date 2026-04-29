import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import PublicLayout from "./Component/layout/PublicLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All public pages share Navbar + Footer via PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Login is full screen — no Navbar/Footer */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard stubs — you'll build these next */}
        <Route
          path="/dashboard/admin"
          element={
            <div className="min-h-screen flex items-center justify-center text-jade-400 font-mono">
              Admin Dashboard — coming next
            </div>
          }
        />
        <Route
          path="/dashboard/teacher"
          element={
            <div className="min-h-screen flex items-center justify-center text-jade-400 font-mono">
              Teacher Dashboard — coming next
            </div>
          }
        />
        <Route
          path="/dashboard/student"
          element={
            <div className="min-h-screen flex items-center justify-center text-jade-400 font-mono">
              Student Dashboard — coming next
            </div>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
