import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useAccessibility } from './AccessibilityProvider';

export function ThemeToggle() {
  const { settings, toggleLightMode } = useAccessibility();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get theme state from accessibility provider
  const isDark = !settings.lightMode;

  const toggleTheme = () => {
    setIsTransitioning(true);
    toggleLightMode(); // Use the accessibility provider's toggle
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 600);
  };

  // Component is always ready since settings come from AccessibilityProvider

  return (
    <motion.div
      className="fixed bottom-8 right-8 md:bottom-12 md:right-12"
      style={{ zIndex: 99999, pointerEvents: 'auto' }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.8,
        delay: 1.2, // Delay to appear after main content loads
        ease: [0.23, 1, 0.32, 1]
      }}
    >
      {/* Floating Theme Toggle Button - SOLID ICONS & ROLLING ANIMATION */}
      <motion.button
        onClick={toggleTheme}
        className="relative w-20 h-10 rounded-full p-1 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-aurelius-gold/30 group"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' 
            : 'linear-gradient(135deg, #F7EDDA 0%, #F7DFBA 100%)', // Venetian Lace to Macadamia Beige
          boxShadow: isDark
            ? '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 4px 20px rgba(240, 83, 28, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)', // Fiery Glow
          border: isDark 
            ? '1px solid rgba(248, 154, 28, 0.3)' 
            : '1px solid rgba(240, 83, 28, 0.4)' // Fiery Glow
        }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: isDark
            ? '0 6px 25px rgba(248, 154, 28, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 6px 25px rgba(240, 83, 28, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)' // Fiery Glow
        }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {/* Switch Track Glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            background: isDark
              ? 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(248,154,28,0.1) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(240,83,28,0.15) 0%, transparent 70%)' // Fiery Glow
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Sliding Toggle Circle with ROLLING ANIMATION & COLOR MORPHING */}
        <motion.div
          className="relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
          animate={{
            x: isDark ? 0 : 36,
            rotate: isTransitioning ? (isDark ? -180 : 180) : 0, // ROLLING EFFECT
          }}
          transition={{ 
            x: { 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            },
            rotate: {
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            }
          }}
        >
          {/* Background Color Morphing Layers */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: isTransitioning 
                ? [
                    isDark ? 'linear-gradient(135deg, #F89A1C 0%, #FBB454 100%)' : 'linear-gradient(135deg, #09332C 0%, #2E4B3C 100%)', // Fence to Norfolk Green
                    'linear-gradient(135deg, #F0531C 0%, #FFA74F 100%)', // Fiery Glow to Pumpkin Vapor transition
                    isDark ? 'linear-gradient(135deg, #09332C 0%, #2E4B3C 100%)' : 'linear-gradient(135deg, #F89A1C 0%, #FBB454 100%)'
                  ]
                : isDark
                  ? 'linear-gradient(135deg, #F89A1C 0%, #FBB454 100%)'
                  : 'linear-gradient(135deg, #09332C 0%, #2E4B3C 100%)', // Fence to Norfolk Green
              boxShadow: isTransitioning
                ? [
                    isDark ? '0 2px 8px rgba(248, 154, 28, 0.4)' : '0 2px 8px rgba(9, 51, 44, 0.4)', // Fence Green
                    '0 2px 12px rgba(240, 83, 28, 0.5)', // Fiery Glow shadow
                    isDark ? '0 2px 8px rgba(9, 51, 44, 0.4)' : '0 2px 8px rgba(248, 154, 28, 0.4)'
                  ]
                : isDark
                  ? '0 2px 8px rgba(248, 154, 28, 0.4)'
                  : '0 2px 8px rgba(9, 51, 44, 0.4)' // Fence Green
            }}
            transition={{ 
              duration: isTransitioning ? 0.6 : 0.3,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          />

          {/* Rotating Inner Highlight */}
          <motion.div
            className="absolute inset-0.5 rounded-full"
            animate={{
              background: isTransitioning
                ? 'linear-gradient(45deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
              rotate: isTransitioning ? 360 : 0
            }}
            transition={{ 
              duration: 0.6,
              ease: 'linear'
            }}
          />

          {/* Icon Container with Enhanced Transitions */}
          <motion.div
            className="relative z-20 flex items-center justify-center"
            animate={{
              scale: isTransitioning ? [1, 0.8, 1] : 1,
              rotate: isTransitioning ? [0, 180, 360] : 0
            }}
            transition={{ 
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <motion.div
              key={isDark ? 'sun' : 'moon'}
              initial={{ opacity: 1, rotate: -90, scale: 0.5 }}
              animate={{ 
                opacity: 1, // Always fully opaque - no transparency
                rotate: 0, 
                scale: 1 
              }}
              exit={{ opacity: 1, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? (
                <Sun 
                  size={16} 
                  className="text-white drop-shadow-sm" 
                  strokeWidth={2.5}
                />
              ) : (
                <Moon 
                  size={16} 
                  className="text-white drop-shadow-sm" 
                  strokeWidth={2.5}
                  fill="currentColor"
                />
              )}
            </motion.div>
          </motion.div>
        </motion.div>



        {/* Enhanced Hover Effect Overlay */}
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(248,154,28,0.15) 0%, rgba(251,180,84,0.08) 100%)'
              : 'linear-gradient(135deg, rgba(240,83,28,0.15) 0%, rgba(255,167,79,0.08) 100%)' // Fiery Glow to Pumpkin Vapor
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Transition Ripple Effect */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{
            scale: isTransitioning ? [1, 1.2, 1] : 1,
            opacity: isTransitioning ? [0, 0.3, 0] : 0
          }}
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(248,154,28,0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(240,83,28,0.3) 0%, transparent 70%)' // Fiery Glow
          }}
          transition={{ duration: 0.6 }}
        />
      </motion.button>

      {/* Floating Animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Enhanced Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: isTransitioning
            ? [
                '0 0 20px rgba(248, 154, 28, 0.4)',
                '0 0 40px rgba(240, 83, 28, 0.6)', // Fiery Glow during transition
                '0 0 20px rgba(9, 51, 44, 0.4)' // Fence Green
              ]
            : isDark
              ? [
                  '0 0 20px rgba(248, 154, 28, 0.2)',
                  '0 0 30px rgba(248, 154, 28, 0.3)',
                  '0 0 20px rgba(248, 154, 28, 0.2)'
                ]
              : [
                  '0 0 20px rgba(240, 83, 28, 0.2)', // Fiery Glow
                  '0 0 30px rgba(240, 83, 28, 0.3)',
                  '0 0 20px rgba(240, 83, 28, 0.2)'
                ]
        }}
        transition={{
          duration: isTransitioning ? 0.6 : 4,
          repeat: isTransitioning ? 0 : Infinity,
          ease: "easeInOut"
        }}
      />


    </motion.div>
  );
}