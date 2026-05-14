import { useState } from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { cn } from "../../utils/cn";

interface AppleAuthButtonProps {
  onSuccess?: (credential: string) => void;
  isLoading?: boolean;
  text?: string;
}

export function AppleAuthButton({ onSuccess, isLoading, text = "Continue with Apple" }: AppleAuthButtonProps) {
  const [isSwiped, setIsSwiped] = useState(false);
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  // Same transformations as Google button for consistency
  const opacity = useTransform(x, [0, 150], [1, 0]);
  const scale = useTransform(x, [0, 150], [1, 0.9]);
  const glowOpacity = useTransform(x, [0, 100, 200], [0, 0.5, 1]);
  const shineX = useTransform(x, [0, 200], ["-100%", "200%"]);
  const iconScale = useTransform(x, [0, 180, 200], [1, 1.1, 1.2]);

  const triggerAppleAuth = () => {
    // Placeholder for Apple Auth logic
    console.log("Apple Auth Triggered");
    if (onSuccess) {
      // Simulate success for now if needed or just handle the UI
    }
  };

  const handleDragEnd = async (_: any, info: any) => {
    if (info.offset.x > 120) {
      setIsSwiped(true);
      await controls.start({ x: 160, transition: { type: "spring", stiffness: 500, damping: 30 } });
      triggerAppleAuth();
      
      setTimeout(() => {
        controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } });
        setIsSwiped(false);
      }, 2000);
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 400, damping: 25 } });
    }
  };

  return (
    <div className="relative w-[82%] max-w-[290px] mx-auto group select-none">
      <motion.button
        type="button"
        onClick={triggerAppleAuth}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.99 }}
        style={{ scale }}
        disabled={isLoading || isSwiped}
        className={cn(
          "relative w-full h-14 flex items-center justify-center gap-3 bg-[#fdfbf7] border border-gold-500/20 rounded-[1.25rem] overflow-hidden transition-all duration-500",
          "hover:border-gold-500/40 hover:shadow-luxury group-active:border-gold-500/60",
          (isLoading || isSwiped) && "opacity-70 cursor-not-allowed"
        )}
      >
        {/* Animated Shine Effect */}
        <motion.div 
          style={{ x: shineX }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-200/20 to-transparent skew-x-[-20deg] z-10 pointer-events-none"
        />

        {/* Swipe Handle / Apple Icon */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 160 }}
          dragElastic={0.05}
          animate={controls}
          style={{ x }}
          onDragEnd={handleDragEnd}
          className="absolute left-1.5 top-1.5 bottom-1.5 w-11 h-11 bg-white rounded-2xl shadow-premium border border-gold-100 flex items-center justify-center z-30 cursor-grab active:cursor-grabbing hover:bg-sand-50 transition-colors"
        >
          <motion.svg viewBox="0 0 256 315" className="w-5 h-5 fill-navy-950" style={{ scale: iconScale }}>
            <path d="M213.803 167.03c.442 47.58 41.74 63.413 42.147 63.615-.35 1.116-6.599 22.563-21.757 44.716-13.104 19.153-26.705 38.235-48.13 38.63-21.05.394-27.815-12.44-51.841-12.44-24.03 0-31.547 12.046-51.412 12.833-20.643.787-36.257-20.706-49.51-39.814C6.115 233.155-15.068 159.204 6.305 122.03c10.607-18.455 29.61-30.147 50.347-30.457 15.932-.31 30.932 10.703 40.697 10.703 9.76 0 27.76-13.16 46.85-11.233 8.013.332 30.547 3.226 44.995 24.4-1.155.717-26.9 15.684-26.623 46.683l.232 4.904zM155.903 59.29c8.583-10.42 14.343-24.89 12.763-39.29-12.353.5-27.27 8.213-36.13 18.633-7.933 9.176-14.863 24.036-13.003 38.1 13.8.106 27.793-7.023 36.37-17.443z" />
          </motion.svg>
        </motion.div>

        {/* Text */}
        <motion.span 
          style={{ opacity }}
          className="text-[13px] font-bold text-navy-950 tracking-tight z-20"
        >
          {isLoading ? "Authenticating..." : text}
        </motion.span>

        {/* Swipe Prompt Overlay */}
        <motion.div 
          style={{ opacity: glowOpacity }}
          className="absolute inset-0 bg-gold-500/5 pointer-events-none z-0"
        />

        {/* Subtle Dots Track */}
        <div className="absolute left-16 right-8 h-full flex items-center justify-around opacity-10 pointer-events-none">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-navy-950" />
          ))}
        </div>
      </motion.button>
      
      {/* Background Track Hint */}
      <div className="absolute inset-x-1.5 top-1.5 bottom-1.5 bg-sand-50/40 rounded-2xl -z-10 pointer-events-none border border-dashed border-gold-200/30 flex items-center justify-end pr-6">
        <motion.div 
          animate={{ x: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="text-[8px] font-black uppercase tracking-[0.3em] text-gold-600/30"
        >
          Slide
        </motion.div>
      </div>
    </div>
  );
}
