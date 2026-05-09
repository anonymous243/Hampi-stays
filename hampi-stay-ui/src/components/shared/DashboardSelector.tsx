import { useAuth } from "../../context/AuthContext";
import { TravelerDashboard } from "../../pages/traveler/TravelerDashboard";
import { OwnerDashboard } from "../../pages/owner/OwnerDashboard";
import { AdminDashboard } from "../../pages/admin/AdminDashboard";
import { GuideDashboard } from "../../pages/owner/GuideDashboard";

export function DashboardSelector() {
  const { user } = useAuth();

  // Ensure role check is case-insensitive and robust
  const role = user?.role?.toUpperCase();

  if (role === "ADMIN") {
    return <AdminDashboard />;
  }

  if (role === "RESORT_OWNER") {
    return <OwnerDashboard />;
  }

  if (role === "GUIDE") {
    return <GuideDashboard />;
  }

  return <TravelerDashboard />;
}
