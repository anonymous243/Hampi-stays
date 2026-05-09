import { motion } from "framer-motion";
import { Bell, Info, ShieldCheck, Calendar, Star } from "lucide-react";

export function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "Booking Confirmed",
      desc: "Your stay at Heritage Resort Hampi has been confirmed by the owner.",
      time: "2 hours ago",
      icon: ShieldCheck,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      id: 2,
      title: "Review Request",
      desc: "How was your stay at Hampi Island? Share your experience with others.",
      time: "1 day ago",
      icon: Star,
      color: "text-gold-600",
      bg: "bg-gold-50"
    },
    {
      id: 3,
      title: "Trip Reminder",
      desc: "Your upcoming trip to Matanga Hill is only 3 days away!",
      time: "2 days ago",
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-50"
    }
  ];

  return (
    <div className="min-h-screen bg-sand-50/50 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-navy-950 mb-2">Notifications</h1>
          <p className="text-navy-950/50">Stay updated with your latest bookings and alerts.</p>
        </header>

        <div className="bg-white rounded-[2.5rem] border border-sand-100 shadow-sm overflow-hidden">
          {notifications.length > 0 ? (
            <div className="divide-y divide-sand-50">
              {notifications.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 flex items-start gap-6 hover:bg-sand-50/50 transition-colors group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-2xl ${n.bg} flex items-center justify-center shrink-0 border border-sand-100`}>
                    <n.icon className={`w-6 h-6 ${n.color}`} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-navy-950">{n.title}</h3>
                      <span className="text-[10px] font-bold text-navy-950/30 uppercase tracking-widest">{n.time}</span>
                    </div>
                    <p className="text-sm text-navy-950/60 leading-relaxed">{n.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-sand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-navy-950/20" />
              </div>
              <h3 className="text-xl font-bold text-navy-950 mb-2">All caught up!</h3>
              <p className="text-navy-950/50">No new notifications at this time.</p>
            </div>
          )}
        </div>

        <div className="mt-8 p-6 bg-gold-50 border border-gold-100 rounded-3xl flex items-center gap-4">
          <Info className="w-5 h-5 text-gold-600 shrink-0" />
          <p className="text-xs text-navy-950/60 leading-relaxed">
            <b>Pro Tip:</b> Enable browser notifications in your settings to get real-time alerts for booking confirmations and expert messages.
          </p>
        </div>
      </div>
    </div>
  );
}
