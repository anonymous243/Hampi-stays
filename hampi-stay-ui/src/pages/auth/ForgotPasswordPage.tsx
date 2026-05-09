import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export function ForgotPasswordPage() {
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const hampiImages = [
    "/images/hampi-3.png", // Boulders
    "/images/hampi-2.png", // Virupaksha Temple
    "/images/hampi-1.png", // Stone Chariot
    "/images/hampi-4.png"  // Lotus Mahal
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % hampiImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [method]: value })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to send reset link.");
      }
    } catch (err) {
      setError("Server connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-sand-50 p-4 md:p-6 lg:p-8 gap-4 md:gap-6 lg:gap-8 overflow-hidden">
      {/* Left Panel: Cinematic Image */}
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-auto md:flex-1 overflow-hidden rounded-[15px] shadow-2xl">
        <AnimatePresence>
          <motion.img
            key={currentImageIndex}
            src={hampiImages[currentImageIndex]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            alt="Scenic Hampi"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
        <div className="absolute inset-0 bg-navy-950/20" />
        
        <div className="absolute bottom-12 left-10 right-10 text-white z-10 hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            {/* Decorative pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-sand-100 text-xs font-semibold tracking-widest uppercase">
                Hampi, Karnataka
              </span>
            </div>

            <h2 className="text-5xl font-serif font-bold mb-4 leading-tight">
              Regain Access to your <br />
              <span className="text-gold-400 italic">Sanctuary</span>
            </h2>
            <p className="text-sand-100/80 max-w-sm leading-relaxed text-base">
              Reset your password to continue managing your luxury experiences and exclusive member benefits.
            </p>

            {/* Stats row */}
            <div className="flex gap-8 mt-8">
              {[
                { value: "200+", label: "Luxury Resorts" },
                { value: "10k+", label: "Happy Guests" },
                { value: "4.9★", label: "Avg Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-sand-200 font-medium mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Glassmorphism Form */}
      <div className="relative w-full md:w-1/2 h-[60vh] md:h-auto md:flex-1 flex flex-col items-center p-6 md:p-12 lg:p-24 z-10 bg-white/40 backdrop-blur-md rounded-[15px] border border-white/20 overflow-y-auto">
        {/* Ambient warm orbs */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gold-200/30 rounded-full blur-[120px] pointer-events-none animate-float-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-sand-300/30 rounded-full blur-[100px] pointer-events-none animate-float" />

        <div className="w-full max-w-md my-auto relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="w-full bg-sand-100/90 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-luxury border border-sand-200/50 relative"
          >
            {/* Back button */}
            <Link to="/login" className="absolute top-8 left-8 text-navy-800/40 hover:text-navy-950 transition-colors z-20">
              <ArrowLeft className="w-6 h-6" />
            </Link>

            <motion.div variants={itemVariant} className="flex justify-center mb-8 mt-4">
              <Link to="/" className="inline-block transition-transform hover:scale-105 duration-300">
                <img src="/logo-full.png" alt="HampiStays" className="h-14 w-auto object-contain drop-shadow-md" />
              </Link>
            </motion.div>

            {!submitted ? (
              <>
                <motion.div variants={itemVariant} className="text-center mb-10">
                  <h1 className="text-3xl font-serif font-bold text-navy-950 mb-3">Reset Password</h1>
                  <p className="text-navy-800/60 font-medium text-sm">
                    Enter your registered email or phone number to receive a reset link.
                  </p>
                </motion.div>

                <motion.div variants={itemVariant} className="flex p-1 bg-sand-200/50 rounded-xl mb-8">
                  <button
                    type="button"
                    onClick={() => {
                      setMethod("email");
                      setValue("");
                    }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                      method === "email" 
                        ? "bg-white text-navy-950 shadow-sm" 
                        : "text-navy-800/60 hover:text-navy-900"
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMethod("phone");
                      setValue("");
                    }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                      method === "phone" 
                        ? "bg-white text-navy-950 shadow-sm" 
                        : "text-navy-800/60 hover:text-navy-900"
                    }`}
                  >
                    Phone
                  </button>
                </motion.div>

                <motion.form variants={itemVariant} className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold animate-shake">
                      {error}
                    </div>
                  )}
                  <Input 
                    label={method === "email" ? "Email Address" : "Phone Number"} 
                    type={method === "email" ? "email" : "tel"} 
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={method === "email" ? "name@example.com" : "+91 98765 43210"}
                    required 
                  />

                  <Button type="submit" className="w-full h-14 text-lg mt-2 shadow-gold" isLoading={isLoading}>
                    Send Reset Link
                  </Button>
                </motion.form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-gold-600" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-navy-950 mb-3">Check your {method}</h2>
                <p className="text-navy-800/70 font-medium text-sm leading-relaxed mb-8">
                  We have sent a password reset link to <br/>
                  <span className="font-bold text-navy-950">{value}</span>
                </p>
                <Button 
                  onClick={() => setSubmitted(false)} 
                  variant="outline"
                  className="w-full h-12"
                >
                  Try another {method}
                </Button>
              </motion.div>
            )}

            <motion.div variants={itemVariant} className="text-center mt-10">
              <p className="text-navy-800/60 font-medium">
                Remember your password?{" "}
                <Link to="/login" className="text-gold-600 font-bold hover:text-sunset-500 transition-colors">
                  Sign in
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
