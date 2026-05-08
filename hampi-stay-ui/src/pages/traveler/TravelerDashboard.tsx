import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, Heart, User, LogOut, 
  ChevronRight, MapPin, Star,
  LayoutDashboard, ShoppingBag, Bell
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";

export function TravelerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [bookingsRes, wishlistRes] = await Promise.all([
          fetch(`http://localhost:5000/api/users/${user.id}/bookings`),
          fetch(`http://localhost:5000/api/users/${user.id}/wishlist`)
        ]);

        if (bookingsRes.ok) setBookings(await bookingsRes.json());
        if (wishlistRes.ok) setWishlist(await wishlistRes.json());
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const stats = [
    { label: "Bookings", value: bookings.length.toString(), icon: Calendar, color: "text-gold-600", bg: "bg-gold-50", link: "/dashboard/bookings" },
    { label: "Saved Resorts", value: wishlist.length.toString(), icon: Heart, color: "text-red-500", bg: "bg-red-50", link: "/dashboard/wishlist" },
    { label: "Loyalty Points", value: "1,250", icon: Star, color: "text-blue-600", bg: "bg-blue-50", link: "/dashboard" },
  ];

  const upcomingTrip = bookings[0] ? {
    resortName: bookings[0].resort.name,
    dates: `${new Date(bookings[0].checkIn).toLocaleDateString()} - ${new Date(bookings[0].checkOut).toLocaleDateString()}`,
    status: "Confirmed",
    image: bookings[0].resort.images[0],
    location: bookings[0].resort.locationArea || "Hampi",
  } : null;

  return (
    <div className="min-h-screen bg-sand-50/50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-sand-200 hidden md:flex flex-col sticky top-0 h-screen pt-24 pb-8">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3 p-3 bg-sand-50 rounded-2xl border border-sand-100">
            <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center text-white font-bold overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-navy-950">{user?.name || "Guest"}</p>
              <p className="text-[10px] text-navy-950/40 uppercase tracking-widest font-bold">
                {user?.role === "RESORT_OWNER" ? "Resort Owner" : "Traveller"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-grow px-4 space-y-1">
          {[
            { name: "Overview", icon: LayoutDashboard, path: "/dashboard", active: true },
            { name: "My Bookings", icon: ShoppingBag, path: "/dashboard/bookings" },
            { name: "Wishlist", icon: Heart, path: "/dashboard/wishlist" },
            { name: "Notifications", icon: Bell, path: "/dashboard/notifications" },
            { name: "Profile", icon: User, path: "/dashboard/profile" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                item.active 
                  ? "bg-navy-950 text-white shadow-lg shadow-navy-950/20" 
                  : "text-navy-950/60 hover:bg-sand-100 hover:text-navy-950"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="px-4 pt-4 border-t border-sand-100">
          <button 
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-12 px-4 md:px-10 max-w-6xl mx-auto w-full">
        <header className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-navy-950 mb-2">Welcome back, <span className="text-gold-600 italic">{user?.name || "Guest"}</span></h1>
          <p className="text-navy-950/50">Here's what's happening with your Hampi trips.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <Link key={stat.label} to={stat.link}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[2rem] border border-sand-100 shadow-sm flex items-center gap-5 hover:border-gold-300 hover:shadow-md transition-all cursor-pointer h-full"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", stat.bg)}>
                  <stat.icon className={cn("w-7 h-7", stat.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-navy-950">{stat.value}</p>
                  <p className="text-xs font-bold text-navy-950/40 uppercase tracking-widest">{stat.label}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Upcoming Trip Section */}
          <section className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-navy-950">Upcoming Stay</h2>
              <Link to="/dashboard/bookings" className="text-navy-950/40 text-xs font-bold uppercase tracking-widest hover:text-gold-600 transition-colors">View all</Link>
            </div>
            
            {isLoading ? (
              <div className="bg-white rounded-[2.5rem] p-12 border border-sand-100 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : upcomingTrip ? (
              <div className="bg-white rounded-[2.5rem] border border-sand-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden">
                  <img src={upcomingTrip.image} alt={upcomingTrip.resortName} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-100">
                        {upcomingTrip.status}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-navy-950 mb-2">{upcomingTrip.resortName}</h3>
                    <div className="flex items-center gap-4 text-sm text-navy-950/60 mb-6">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gold-500" />
                        {upcomingTrip.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gold-500" />
                        {upcomingTrip.dates}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link to="/dashboard/bookings">
                      <Button size="sm" className="px-6 shadow-none">Check Details</Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="px-6"
                      onClick={() => alert("Please contact HampiStays Support to reschedule your trip: support@hampistays.com")}
                    >
                      Reschedule
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-dashed border-sand-300 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-sand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-navy-950/20" />
                </div>
                <h3 className="text-xl font-bold text-navy-950 mb-2">No upcoming trips</h3>
                <p className="text-navy-950/50 mb-6 max-w-xs mx-auto">Your next adventure in Hampi is waiting. Explore our collection of hand-picked resorts.</p>
                <Link to="/resorts">
                  <Button variant="outline" className="rounded-xl">Start Exploring</Button>
                </Link>
              </div>
            )}
          </section>

          {/* Quick Actions / Recent Activity */}
          <section className="lg:col-span-4">
            <h2 className="text-2xl font-serif font-bold text-navy-950 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {[
                { name: "Explore New Resorts", path: "/resorts", desc: "Find your next escape" },
                { name: "Write a Review", path: "/dashboard/bookings", desc: "Share your experience" },
                { name: "Support Center", path: "/contact", desc: "Need help with a trip?" },
              ].map((action) => (
                <Link
                  key={action.name}
                  to={action.path}
                  className="block p-5 bg-white rounded-2xl border border-sand-100 hover:border-gold-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-navy-950">{action.name}</p>
                    <ChevronRight className="w-4 h-4 text-navy-950/20 group-hover:text-gold-600 transition-colors" />
                  </div>
                  <p className="text-xs text-navy-950/50">{action.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
