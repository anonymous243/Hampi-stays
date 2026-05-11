import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

interface ImmersiveBackgroundProps {
  images: string[];
  labels?: string[];
  overlayColor?: string;
  height?: string;
}

export function ImmersiveBackground({ 
  images, 
  labels = [], 
  overlayColor = "from-navy-950/80 via-navy-950/40 to-sand-50",
  height = "h-[65vh]"
}: ImmersiveBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${height}`}>
      <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentIndex}
            src={images[currentIndex]} 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.7, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            alt={labels[currentIndex] || "Hampi Atmosphere"}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        {/* Ambient Overlays */}
        <div className={`absolute inset-0 bg-gradient-to-b ${overlayColor}`} />
        <div className="absolute inset-0 bg-navy-950/20 mix-blend-overlay" />
        
        {/* Subtle Dust/Particle Effect (Optional) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </motion.div>
    </div>
  );
}
