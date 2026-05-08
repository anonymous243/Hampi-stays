import { useLocation } from "react-router-dom";
import { LuxuryFooter } from "./LuxuryFooter";
import { MinimalFooter } from "./MinimalFooter";
import { DashboardFooter } from "./DashboardFooter";

export function Footer() {
  const location = useLocation();
  const path = location.pathname;

  // Define route groups
  const authRoutes = ["/login", "/register", "/forgot-password", "/checkout", "/payment"];

  // Check for dashboard routes (including sub-paths)
  const isDashboard = path.startsWith("/dashboard") || path === "/resort-setup";
  
  // Check for auth routes
  const isAuth = authRoutes.includes(path);

  if (isDashboard) {
    return <DashboardFooter />;
  }

  if (isAuth) {
    return <MinimalFooter />;
  }

  // Default to Luxury Footer for marketing pages
  return <LuxuryFooter />;
}
