import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Cookie, 
  Shield, 
  Settings, 
  Eye, 
  Trash2, 
  Info,
  ExternalLink,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

interface SectionProps {
  id: string;
  number: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function PolicySection({ id, number, title, icon: Icon, children }: SectionProps) {
  return (
    <motion.section
      id={id}
      custom={parseInt(number)}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="scroll-mt-32"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200/60 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-gold-600" />
        </div>
        <div>
          <span className="text-xs font-bold text-gold-500 tracking-wider uppercase">
            Section {number}
          </span>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-navy-950">
            {title}
          </h2>
        </div>
      </div>
      <div className="ml-14 text-navy-800/70 leading-relaxed space-y-4 text-[15px]">
        {children}
      </div>
    </motion.section>
  );
}

const cookieCategories = [
  {
    name: "Essential Cookies",
    desc: "Strictly necessary for the website to function. These cannot be disabled.",
    icon: Shield,
    status: "Always Active",
    cookies: ["session_id", "csrf_token", "auth_status"]
  },
  {
    name: "Functional Cookies",
    desc: "Remember your preferences like language, currency, and search filters.",
    icon: Settings,
    status: "Active",
    cookies: ["preferred_currency", "last_search", "theme_mode"]
  },
  {
    name: "Analytics Cookies",
    desc: "Help us understand how guests use HampiStays so we can improve the experience.",
    icon: Eye,
    status: "Active",
    cookies: ["_ga", "_gid", "_mixpanel_id"]
  },
  {
    name: "Marketing Cookies",
    desc: "Used to show relevant offers and track performance of our social media campaigns.",
    icon: ExternalLink,
    status: "Optional",
    cookies: ["_fbp", "_uetsid", "ads_perf"]
  }
];

export function CookiesPage() {
  return (
    <main className="min-h-screen bg-sand-50">
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-200/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-amber-50/60 backdrop-blur-md border border-amber-200/60 rounded-full px-5 py-2 mb-6">
              <Cookie className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold tracking-widest uppercase text-amber-700">
                Transparency First
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-serif font-bold text-navy-950 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Cookie <span className="text-gold-600 italic">Policy</span>
          </motion.h1>

          <motion.p
            className="text-lg text-navy-800/60 max-w-2xl mx-auto leading-relaxed mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            We use cookies to ensure you have the best experience on our platform. 
            This policy explains how and why we use these technologies.
          </motion.p>

          <motion.p
            className="text-sm text-navy-800/40 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Last updated: May 11, 2026
          </motion.p>
        </div>
      </section>

      {/* ── QUICK SETTINGS ── */}
      <section className="container mx-auto px-4 md:px-6 mb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cookieCategories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="bg-white rounded-2xl p-6 border border-sand-200 hover:border-gold-300 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-sand-50 flex items-center justify-center">
                  <cat.icon className="w-5 h-5 text-navy-950/60" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  cat.status === 'Always Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-sand-100 text-navy-950/40'
                }`}>
                  {cat.status}
                </span>
              </div>
              <h4 className="font-bold text-navy-950 text-sm mb-2">{cat.name}</h4>
              <p className="text-xs text-navy-800/50 leading-relaxed">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="container mx-auto px-4 md:px-6 pb-28">
        <div className="max-w-4xl mx-auto space-y-16">
          
          <PolicySection id="what-are-cookies" number="1" title="What are Cookies?" icon={Info}>
            <p>
              Cookies are small text files that are stored on your browser or device when you visit a website. 
              They allow the website to recognize your device and store some information about your preferences or past actions.
            </p>
            <p>
              At HampiStays, we use cookies to keep you logged in, remember your search preferences (like dates and number of guests), 
              and to understand how you interact with our heritage stories and resort listings.
            </p>
          </PolicySection>

          <PolicySection id="how-we-use" number="2" title="How We Use Cookies" icon={Eye}>
            <p>We use cookies for the following purposes:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {[
                { title: "Authentication", desc: "Keeping you securely logged into your HampiStays account." },
                { title: "Security", desc: "Protecting your data and our platform from unauthorized access." },
                { title: "Preferences", desc: "Remembering your filters, currency, and language settings." },
                { title: "Analytics", desc: "Measuring platform performance to build a better experience." }
              ].map(item => (
                <li key={item.title} className="bg-white p-4 rounded-xl border border-sand-100">
                  <h5 className="font-bold text-navy-950 text-sm mb-1">{item.title}</h5>
                  <p className="text-xs text-navy-800/50">{item.desc}</p>
                </li>
              ))}
            </ul>
          </PolicySection>

          <PolicySection id="consent" number="3" title="Consent and Control" icon={Settings}>
            <p>
              When you first visit HampiStays, we show you a cookie consent banner. By clicking "Accept All", 
              you consent to our use of all cookies described in this policy.
            </p>
            <p>
              You can change your mind at any time. Most browsers allow you to block or delete cookies through their settings:
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              {['Chrome', 'Safari', 'Firefox', 'Edge'].map(browser => (
                <a 
                  key={browser}
                  href="#" 
                  className="flex items-center gap-2 px-4 py-2 bg-sand-100/50 hover:bg-sand-200/50 rounded-full text-xs font-bold text-navy-950 transition-all border border-sand-200"
                >
                  Manage on {browser} <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </PolicySection>

          <PolicySection id="third-party" number="4" title="Third-Party Cookies" icon={Shield}>
            <p>
              Some cookies are placed by third-party services that appear on our pages. 
              We use these services to enhance our platform's functionality:
            </p>
            <ul className="space-y-4 mt-4">
              <li className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-sand-100">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <span className="font-bold text-blue-600">G</span>
                </div>
                <div>
                  <h5 className="font-bold text-navy-950 text-sm">Google Analytics & Auth</h5>
                  <p className="text-xs text-navy-800/50 mt-1">We use Google to understand site traffic and provide a seamless "One-Tap" login experience.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-sand-100">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
                  <span className="font-bold text-indigo-600">C</span>
                </div>
                <div>
                  <h5 className="font-bold text-navy-950 text-sm">Cloudinary & Maps</h5>
                  <p className="text-xs text-navy-800/50 mt-1">Used for high-performance image delivery and interactive resort location maps.</p>
                </div>
              </li>
            </ul>
          </PolicySection>

          <PolicySection id="data-deletion" number="5" title="Data Deletion & Requests" icon={Trash2}>
            <p>
              You have the right to request the deletion of your data collected via cookies. 
              While most cookies can be cleared through your browser, you can also contact our support team.
            </p>
            <div className="bg-navy-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h4 className="text-2xl font-serif font-bold mb-3 text-gold-400">Have Privacy Questions?</h4>
                  <p className="text-white/60 text-sm max-w-md">Our dedicated privacy team is here to help you understand your rights and manage your data.</p>
                </div>
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <a href="mailto:privacy@hampistays.com" className="bg-gold-500 hover:bg-gold-400 text-navy-950 px-8 py-3 rounded-xl font-bold text-sm text-center transition-all shadow-lg">
                    Email Privacy Team
                  </a>
                  <Link to="/contact" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-bold text-sm text-center transition-all">
                    General Support
                  </Link>
                </div>
              </div>
            </div>
          </PolicySection>

          {/* ── FOOTER NOTICE ── */}
          <div className="pt-10 text-center border-t border-sand-200">
            <p className="text-xs text-navy-800/40 font-medium">
              By using HampiStays, you agree to our use of cookies as outlined in this policy. 
              Also see our <Link to="/privacy" className="text-gold-600 hover:underline">Privacy Policy</Link> and <Link to="/terms" className="text-gold-600 hover:underline">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
