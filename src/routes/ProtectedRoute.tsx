import { useAppSelector } from "@/app/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// ── ProtectedRoute ──────────────────────────────────────
// Blocks access to any route if user is not authenticated.
// Saves the attempted URL so after login we can redirect back.
export function ProtectedRoute() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

// ── RoleRoute ───────────────────────────────────────────
// Blocks access if user's role doesn't match the allowed roles.
// E.g. a student hitting /dashboard/admin gets redirected away.
interface RoleRouteProps {
  allowedRoles: ("admin" | "teacher" | "student" | "parent")[];
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user } = useAppSelector((state) => state.auth);

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard, not login
    const fallback =
      user?.role === "admin"
        ? "/dashboard/admin"
        : user?.role === "teacher"
          ? "/dashboard/teacher"
          : user?.role === "parent"
            ? "/parent/dashboard"
            : "/dashboard/student";

    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}

// ── GuestRoute ──────────────────────────────────────────
// Blocks logged-in users from accessing login/register.
// If already authenticated, redirect to their dashboard.
export function GuestRoute() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (isAuthenticated && user) {
    const dashboard =
      user.role === "admin"
        ? "/dashboard/admin"
        : user.role === "teacher"
          ? "/dashboard/teacher"
          : user.role === "parent"
            ? "/parent/dashboard"
            : "/dashboard/student";

    return <Navigate to={dashboard} replace />;
  }

  return <Outlet />;
}
