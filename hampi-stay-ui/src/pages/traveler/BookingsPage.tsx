import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar, MapPin, Download, Clock,
  Star, XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { cn } from "../../utils/cn";

export function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showReview, setShowReview] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}/bookings`);
      if (response.ok) setBookings(await response.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [user]);

  const now = new Date();
  const upcoming = bookings.filter(b => new Date(b.checkIn) >= now && b.status !== "CANCELLED");
  const completed = bookings.filter(b => new Date(b.checkOut) < now && b.status !== "CANCELLED");
  const cancelled = bookings.filter(b => b.status === "CANCELLED");

  const tabData = { upcoming, completed, cancelled };
  const displayBookings = tabData[activeTab];

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking? This cannot be undone.")) return;
    setCancellingId(bookingId);
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        await fetchBookings();
        setActiveTab("cancelled");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  };

  const handleReview = async (resortId: string) => {
    try {
      await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, resortId, ...reviewData }),
      });
      setShowReview(null);
      setReviewData({ rating: 5, comment: "" });
      alert("Review submitted! Thank you.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadInvoice = (booking: any) => {
    const content = `
HAMPISTAYS — BOOKING INVOICE
================================
Booking Reference: ${booking.referenceNumber}
Date Issued: ${new Date().toLocaleDateString("en-IN")}

GUEST: ${user?.name}

BOOKING DETAILS
Resort: ${booking.resort?.name}
Check-in: ${new Date(booking.checkIn).toLocaleDateString("en-IN")}
Check-out: ${new Date(booking.checkOut).toLocaleDateString("en-IN")}
Guests: ${booking.guests}
Status: ${booking.status}

PAYMENT
Total: ₹${booking.totalPrice?.toLocaleString("en-IN")}
GST: Included (12%)

Thank you for choosing HampiStays.
    `.trim();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice_${booking.referenceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-sand-50/50 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <header className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-navy-950 mb-2">My Bookings</h1>
          <p className="text-navy-950/50">Manage your upcoming, completed, and past Hampi adventures.</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1.5 bg-white rounded-2xl border border-sand-100 shadow-sm w-fit">
          {(["upcoming", "completed", "cancelled"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn("px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all",
                activeTab === tab ? "bg-navy-950 text-white shadow" : "text-navy-950/40 hover:text-navy-950")}>
              {tab} ({tabData[tab].length})
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : displayBookings.length > 0 ? (
          <div className="space-y-6">
            {displayBookings.map((booking, i) => (
              <motion.div key={booking.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2.5rem] border border-sand-100 overflow-hidden shadow-sm flex flex-col md:flex-row">
                <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden shrink-0 relative">
                  <img src={booking.resort?.images?.[0]} alt={booking.resort?.name} className="w-full h-full object-cover" />
                  {booking.status === "CANCELLED" && (
                    <div className="absolute inset-0 bg-navy-950/50 flex items-center justify-center">
                      <span className="text-white text-xs font-bold uppercase tracking-widest">Cancelled</span>
                    </div>
                  )}
                </div>

                <div className="p-8 flex-grow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={cn("px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border",
                          booking.status === "CONFIRMED" ? "bg-green-50 text-green-700 border-green-100" :
                          booking.status === "CANCELLED" ? "bg-red-50 text-red-600 border-red-100" :
                          "bg-gold-50 text-gold-700 border-gold-100")}>
                          {booking.status}
                        </span>
                        <span className="text-[10px] font-bold text-navy-950/30 uppercase tracking-widest">
                          Ref: {booking.referenceNumber}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-navy-950 mb-1">{booking.resort?.name}</h3>
                      <p className="text-sm text-gold-600 font-medium italic">{booking.resort?.locationArea}, Hampi</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-2xl font-bold text-navy-950">₹{booking.totalPrice?.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-navy-950/30 uppercase tracking-widest">Total Paid</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-5 bg-sand-50 rounded-2xl border border-sand-100 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gold-500 shrink-0" />
                      <div>
                        <p className="text-[10px] text-navy-950/40 uppercase tracking-widest font-bold">Check-in</p>
                        <p className="font-bold text-navy-950">{new Date(booking.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gold-500 shrink-0" />
                      <div>
                        <p className="text-[10px] text-navy-950/40 uppercase tracking-widest font-bold">Check-out</p>
                        <p className="font-bold text-navy-950">{new Date(booking.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
                      <div>
                        <p className="text-[10px] text-navy-950/40 uppercase tracking-widest font-bold">Guests</p>
                        <p className="font-bold text-navy-950">{booking.guests} Adults</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" variant="outline" className="px-5 rounded-xl gap-2" onClick={() => handleDownloadInvoice(booking)}>
                      <Download className="w-4 h-4" /> Invoice
                    </Button>

                    {activeTab === "upcoming" && (
                      <Button size="sm" variant="outline" className="px-5 rounded-xl gap-2 border-red-200 text-red-600 bg-red-50/30 hover:bg-red-50"
                        isLoading={cancellingId === booking.id}
                        onClick={() => handleCancel(booking.id)}>
                        <XCircle className="w-4 h-4" /> Cancel Booking
                      </Button>
                    )}

                    {activeTab === "completed" && (
                      <Button size="sm" className="px-5 rounded-xl gap-2 bg-gold-50 text-gold-700 border border-gold-200 hover:bg-gold-100 shadow-none"
                        onClick={() => setShowReview(booking.resortId)}>
                        <Star className="w-4 h-4" /> Write Review
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-sand-100 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-sand-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Calendar className="w-10 h-10 text-navy-950/20" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-navy-950 mb-4">No {activeTab} bookings</h2>
            <p className="text-navy-950/60 mb-10">
              {activeTab === "upcoming" ? "Your next Hampi adventure is waiting to be booked." : "Your past bookings will appear here."}
            </p>
            {activeTab === "upcoming" && (
              <Link to="/resorts">
                <Button size="lg" className="rounded-2xl px-12 shadow-gold">Start Booking</Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm" onClick={() => setShowReview(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-luxury">
            <h2 className="text-2xl font-serif font-bold text-navy-950 mb-6">Share Your Experience</h2>
            <div className="flex gap-2 mb-6">
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => setReviewData(p => ({...p, rating: star}))}>
                  <Star className={cn("w-8 h-8 transition-all", reviewData.rating >= star ? "fill-gold-400 text-gold-400 scale-110" : "text-sand-300")} />
                </button>
              ))}
            </div>
            <textarea
              rows={4}
              placeholder="What made your stay special? Share the highlights..."
              value={reviewData.comment}
              onChange={e => setReviewData(p => ({...p, comment: e.target.value}))}
              className="w-full p-4 rounded-2xl border border-sand-200 bg-sand-50 text-sm resize-none outline-none focus:ring-2 focus:ring-gold-400 mb-6"
            />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowReview(null)}>Cancel</Button>
              <Button className="flex-1 rounded-xl shadow-gold" onClick={() => handleReview(showReview)}>Submit Review</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
