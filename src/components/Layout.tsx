import { ReactNode, useState, useEffect } from "react";
import { motion } from "motion/react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isLightMode, setIsLightMode] = useState(false);

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      setIsLightMode(document.documentElement.classList.contains('light'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div 
      className="min-h-screen bg-black light:bg-venetian-lace text-white light:text-fence-green overflow-x-hidden transition-colors duration-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Global Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* Animated grain texture */}
        <div className="absolute inset-0 opacity-[0.02] bg-noise animate-pulse" />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gray-900" />
      </div>
      
      {/* Main Content Container */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Cursor Follow Effect */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
          y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="w-full h-full border border-yellow-500 rounded-full opacity-20" />
      </motion.div>
    </motion.div>
  );
}
