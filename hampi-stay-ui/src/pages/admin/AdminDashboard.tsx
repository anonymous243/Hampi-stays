import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, CheckCircle, XCircle, ExternalLink, MapPin, 
  User, Mail, LayoutDashboard, Building2, Users, CalendarDays, 
  TrendingUp, Star, AlertCircle, Search, Filter, Sparkles, Download
} from "lucide-react";
import { Button } from "../../components/ui/Button";

type AdminTab = "overview" | "properties" | "users" | "bookings";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [propertySubTab, setPropertySubTab] = useState<"pending" | "active">("pending");
  const [pendingResorts, setPendingResorts] = useState<any[]>([]);
  const [activeResorts, setActiveResorts] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [pendingRes, activeRes, usersRes, statsRes, bookingsRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/resorts/pending"),
        fetch("http://localhost:5000/api/admin/resorts/active"),
        fetch("http://localhost:5000/api/users/list"),
        fetch("http://localhost:5000/api/admin/stats"),
        fetch("http://localhost:5000/api/admin/bookings/all")
      ]);
      
      if (pendingRes.ok) setPendingResorts(await pendingRes.json());
      if (activeRes.ok) setActiveResorts(await activeRes.json());
      if (usersRes.ok) setAllUsers(await usersRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (bookingsRes.ok) setAllBookings(await bookingsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: "APPROVED" | "REJECTED") => {
    setProcessingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/resorts/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        // Refresh both lists
        const [p, a] = await Promise.all([
          fetch("http://localhost:5000/api/admin/resorts/pending").then(r => r.json()),
          fetch("http://localhost:5000/api/admin/resorts/active").then(r => r.json())
        ]);
        setPendingResorts(p);
        setActiveResorts(a);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    setProcessingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/resorts/${id}/feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !currentStatus })
      });
      if (res.ok) {
        setActiveResorts(prev => prev.map(r => r.id === id ? { ...r, isFeatured: !currentStatus } : r));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: `₹${stats?.revenue?.toLocaleString() || 0}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Bookings", value: stats?.bookingCount || 0, icon: CalendarDays, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Users", value: stats?.userCount || 0, icon: Users, color: "text-gold-600", bg: "bg-gold-50" },
          { label: "Platform Rating", value: `${stats?.platformRating || 4.8}/5`, icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-white p-6 rounded-[2rem] border border-sand-200 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold text-navy-950/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-navy-950">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-sand-200 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-navy-950">Recent Activity</h3>
            <Button variant="outline" className="text-xs h-8 px-4 rounded-full">View All</Button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-sand-50 rounded-2xl transition-colors">
                <div className="w-10 h-10 bg-sand-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-bold text-navy-950">New Booking Confirmed</p>
                  <p className="text-xs text-navy-950/50">Traveler booked Heritage Resort Hampi for 3 nights.</p>
                </div>
                <p className="text-[10px] font-bold text-navy-950/30 uppercase">2h ago</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-navy-950 rounded-[2.5rem] p-8 text-white">
          <h3 className="text-xl font-bold mb-6 text-gold-400">System Tasks</h3>
          <div className="space-y-4">
            <Button className="w-full bg-white/10 hover:bg-white/20 border-white/10 text-white justify-start gap-3 h-14 rounded-2xl">
              <AlertCircle className="w-5 h-5" />
              Verify Payouts
            </Button>
            <Button className="w-full bg-white/10 hover:bg-white/20 border-white/10 text-white justify-start gap-3 h-14 rounded-2xl">
              <Mail className="w-5 h-5" />
              Send Newsletter
            </Button>
            <Button className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 justify-start gap-3 h-14 rounded-2xl mt-4">
              <ShieldCheck className="w-5 h-5" />
              Security Audit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResortCard = (resort: any, type: "pending" | "active") => (
    <motion.div
      key={resort.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-white rounded-[2rem] border border-sand-100 shadow-sm overflow-hidden mb-6"
    >
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-72 h-48 lg:h-auto relative">
          <img 
            src={resort.images?.[0] || "https://images.unsplash.com/photo-1548013146-72479768bbaa"} 
            className="w-full h-full object-cover" 
            alt={resort.name}
          />
          {resort.isFeatured && (
            <div className="absolute top-4 left-4">
              <span className="bg-gold-500 text-navy-950 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            </div>
          )}
        </div>

        <div className="flex-grow p-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-grow">
              <div className="flex items-center gap-2 text-gold-600 text-[10px] font-bold uppercase tracking-widest mb-2">
                <MapPin className="w-3.5 h-3.5" />
                {resort.locationArea}
              </div>
              <h3 className="text-2xl font-bold text-navy-950 mb-2">{resort.name}</h3>
              <p className="text-sm text-navy-950/50 mb-6 line-clamp-2 max-w-2xl">{resort.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-sand-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-sand-200">
                    <User className="w-4 h-4 text-navy-950/40" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-navy-950/40 uppercase">Owner</p>
                    <p className="text-sm font-bold text-navy-950">{resort.owner?.user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-sand-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-sand-200">
                    <Mail className="w-4 h-4 text-navy-950/40" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-navy-950/40 uppercase">Contact</p>
                    <p className="text-sm font-bold text-navy-950 text-ellipsis overflow-hidden max-w-[150px]">{resort.owner?.user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-3 justify-center min-w-[160px]">
              {type === "pending" ? (
                <>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white gap-2 h-12 px-6"
                    onClick={() => handleStatusUpdate(resort.id, "APPROVED")}
                    disabled={processingId === resort.id}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50 gap-2 h-12 px-6"
                    onClick={() => handleStatusUpdate(resort.id, "REJECTED")}
                    disabled={processingId === resort.id}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant={resort.isFeatured ? "primary" : "outline"}
                    className={resort.isFeatured ? "bg-gold-500 hover:bg-gold-600 text-navy-950 gap-2 h-12 px-6 border-none" : "border-gold-200 text-gold-700 hover:bg-gold-50 gap-2 h-12 px-6"}
                    onClick={() => handleToggleFeatured(resort.id, resort.isFeatured)}
                    disabled={processingId === resort.id}
                  >
                    <Sparkles className="w-4 h-4" />
                    {resort.isFeatured ? "Featured" : "Mark Featured"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-navy-200 text-navy-950 hover:bg-navy-50 gap-2 h-12 px-6"
                    onClick={() => handleStatusUpdate(resort.id, "REJECTED")} // Actually "Suspension" logic
                    disabled={processingId === resort.id}
                  >
                    <XCircle className="w-4 h-4" />
                    Suspend
                  </Button>
                </>
              )}
              <Button 
                variant="outline" 
                className="gap-2 h-12 px-6"
                onClick={() => window.open(`/resorts/${resort.slug}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderProperties = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h3 className="text-2xl font-bold text-navy-950 mb-4">Property Management</h3>
          <div className="flex bg-white p-1 rounded-xl border border-sand-200 w-fit">
            <button 
              onClick={() => setPropertySubTab("pending")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${propertySubTab === 'pending' ? 'bg-navy-950 text-white shadow-md' : 'text-navy-950/40 hover:text-navy-950'}`}
            >
              Pending ({pendingResorts.length})
            </button>
            <button 
              onClick={() => setPropertySubTab("active")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${propertySubTab === 'active' ? 'bg-navy-950 text-white shadow-md' : 'text-navy-950/40 hover:text-navy-950'}`}
            >
              Active ({activeResorts.length})
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-950/30" />
            <input 
              type="text" 
              placeholder="Search resorts..." 
              className="pl-10 pr-4 py-2 bg-white border border-sand-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20"
            />
          </div>
          <Button variant="outline" className="gap-2 rounded-xl">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {(propertySubTab === "pending" ? pendingResorts : activeResorts).length > 0 ? (
          <motion.div
            key={propertySubTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {(propertySubTab === "pending" ? pendingResorts : activeResorts).map(resort => 
              renderResortCard(resort, propertySubTab)
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-[3rem] p-20 text-center border border-sand-100 shadow-sm max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-green-200" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-navy-950 mb-4">No {propertySubTab} resorts</h2>
            <p className="text-navy-950/60">Everything is up to date.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-[2.5rem] border border-sand-200 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-sand-100 flex items-center justify-between">
        <h3 className="text-xl font-bold text-navy-950">Platform Users</h3>
        <Button className="bg-navy-950 text-white gap-2">
          <Users className="w-4 h-4" />
          Add User
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-sand-50/50 text-[10px] font-bold text-navy-950/40 uppercase tracking-widest">
              <th className="px-8 py-4">User</th>
              <th className="px-8 py-4">Role</th>
              <th className="px-8 py-4">Joined</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {allUsers.map((user) => (
              <tr key={user.id} className="hover:bg-sand-50/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold-100 text-gold-700 rounded-full flex items-center justify-center font-bold">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-950">{user.name}</p>
                      <p className="text-xs text-navy-950/40">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    user.role === 'ADMIN' ? 'bg-navy-950 text-white' : 
                    user.role === 'RESORT_OWNER' ? 'bg-gold-100 text-gold-700' : 
                    'bg-sand-100 text-navy-950/60'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm text-navy-950/60">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-8 py-6">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    ACTIVE
                  </span>
                </td>
                <td className="px-8 py-6">
                  <Button variant="outline" className="h-8 px-4 text-xs rounded-full">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-[2.5rem] border border-sand-200 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-sand-100 flex items-center justify-between">
        <h3 className="text-xl font-bold text-navy-950">Global Bookings</h3>
        <Button variant="outline" className="gap-2 rounded-xl">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-sand-50/50 text-[10px] font-bold text-navy-950/40 uppercase tracking-widest">
              <th className="px-8 py-4">Reference</th>
              <th className="px-8 py-4">Guest</th>
              <th className="px-8 py-4">Resort & Room</th>
              <th className="px-8 py-4">Dates</th>
              <th className="px-8 py-4">Amount</th>
              <th className="px-8 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {allBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-sand-50/30 transition-colors">
                <td className="px-8 py-6">
                  <span className="font-mono font-bold text-gold-700">{booking.referenceNumber}</span>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm font-bold text-navy-950">{booking.user?.name || "Guest"}</p>
                  <p className="text-xs text-navy-950/40">{booking.user?.email}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm font-bold text-navy-950">{booking.resort?.name}</p>
                  <p className="text-xs text-navy-950/40">{booking.roomType?.name || "Standard Stay"}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="text-xs">
                    <p className="font-bold text-navy-950">{new Date(booking.checkIn).toLocaleDateString()}</p>
                    <p className="text-navy-950/40">to {new Date(booking.checkOut).toLocaleDateString()}</p>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm font-bold text-navy-950">
                  ₹{booking.totalPrice?.toLocaleString()}
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    booking.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 
                    booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
            {allBookings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-navy-950/30 italic">
                  No bookings found on the platform.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sand-50/50 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-gold-600 mb-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Administrator Portal</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-navy-950">Command Center</h1>
          </div>

          {/* Sub Navigation */}
          <nav className="flex items-center bg-white p-1.5 rounded-2xl border border-sand-200 shadow-sm">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "properties", label: "Properties", icon: Building2 },
              { id: "users", label: "Users", icon: Users },
              { id: "bookings", label: "Bookings", icon: CalendarDays },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-navy-950 text-white shadow-lg" 
                    : "text-navy-950/40 hover:text-navy-950 hover:bg-sand-50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === "overview" && renderOverview()}
            {activeTab === "properties" && renderProperties()}
            {activeTab === "users" && renderUsers()}
            {activeTab === "bookings" && renderBookings()}
          </motion.div>
        )}
      </div>
    </div>
  );
}
