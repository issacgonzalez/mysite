import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BullLogo } from './BullLogo';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Enhanced theme detection with observer
    const checkTheme = () => {
      setIsLightMode(document.documentElement.classList.contains('light'));
    };
    
    // Check initially
    checkTheme();
    
    // Set up observer for class changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Show content immediately
    setShowContent(true);
    
    // Slower progress - completes in ~2.5 seconds for better visibility
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 300);
          return 100;
        }
        return prev + 2; // Slower increment for longer display
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Calculate perimeter path progress  
  const [viewportDimensions, setViewportDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const updateDimensions = () => {
      setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const getPerimeterPath = () => {
    const { width, height } = viewportDimensions;
    const margin = 2; // Small margin from edges
    
    // Create a path around the screen perimeter (counter-clockwise)
    return `M ${margin} ${margin} L ${margin} ${height - margin} L ${width - margin} ${height - margin} L ${width - margin} ${margin} Z`;
  };

  const getPerimeterLength = () => {
    const { width, height } = viewportDimensions;
    const margin = 2;
    
    // Calculate actual perimeter length
    return 2 * ((width - 2 * margin) + (height - 2 * margin));
  };

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden loading-screen ${
        isLightMode ? 'bg-[#f2b43b]' : 'bg-black'
      }`}
      initial={{ opacity: 1 }}
      animate={{ opacity: progress >= 100 ? 0 : 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Perimeter Progress Bar */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 60 }}
        viewBox={`0 0 ${viewportDimensions.width} ${viewportDimensions.height}`}
      >
        <defs>
          <linearGradient id="loadingProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {isLightMode ? (
              <>
                <stop offset="0%" stopColor="#000000" stopOpacity="1" />
                <stop offset="25%" stopColor="#1a1a1a" stopOpacity="1" />
                <stop offset="50%" stopColor="#000000" stopOpacity="1" />
                <stop offset="75%" stopColor="#1a1a1a" stopOpacity="1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="1" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#F89A1C" stopOpacity="1" />
                <stop offset="25%" stopColor="#FBB454" stopOpacity="1" />
                <stop offset="50%" stopColor="#F89A1C" stopOpacity="1" />
                <stop offset="75%" stopColor="#FBB454" stopOpacity="1" />
                <stop offset="100%" stopColor="#F89A1C" stopOpacity="1" />
              </>
            )}
          </linearGradient>
          
          <filter id="loadingProgressGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background track */}
        <path
          d={getPerimeterPath()}
          fill="none"
          stroke={isLightMode ? "rgba(0, 0, 0, 0.2)" : "rgba(248, 154, 28, 0.2)"}
          strokeWidth="2"
        />
        
        {/* Progress path */}
        <path
          d={getPerimeterPath()}
          fill="none"
          stroke="url(#loadingProgressGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={getPerimeterLength()}
          strokeDashoffset={getPerimeterLength() * (1 - progress / 100)}
          filter="url(#loadingProgressGlow)"
          style={{
            transition: 'stroke-dashoffset 0.12s ease-out'
          }}
        />
      </svg>

      {/* Background Bull Logo - EPIC MASSIVE SIZE */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 10.0, opacity: 0 }}
        animate={{ 
          scale: showContent ? 20.0 : 10.0, 
          opacity: showContent ? (isLightMode ? 0.3 : 0.25) : 0,
          rotate: [0, 1, -1, 0]
        }}
        transition={{ 
          scale: { duration: 1, ease: 'easeOut' },
          opacity: { duration: 0.8, ease: 'easeOut' },
          rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }}
        style={{
          filter: isLightMode 
            ? 'invert(1) brightness(0) contrast(100%)' // Make logo black in light mode
            : 'none'
        }}
      >
        <BullLogo className="w-[400vh] h-[400vh] max-w-[6000px] max-h-[6000px] animate-footer-style-logo-glow" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center font-inter"
        initial={{ opacity: 0, y: 30 }}
        animate={{ 
          opacity: showContent ? 1 : 0, 
          y: showContent ? 0 : 30 
        }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      >
        {/* Main Title */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight mb-6 font-inter"
          style={isLightMode ? {
            color: '#000000',
            textShadow: '0 0 30px rgba(0, 0, 0, 0.4)',
            letterSpacing: '0.02em',
            fontFamily: 'Inter, sans-serif'
          } : {
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 40%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
            letterSpacing: '0.02em',
            fontFamily: 'Inter, sans-serif'
          }}
          animate={{
            textShadow: isLightMode ? [
              '0 0 30px rgba(0, 0, 0, 0.4)',
              '0 0 45px rgba(0, 0, 0, 0.6)',
              '0 0 30px rgba(0, 0, 0, 0.4)'
            ] : [
              '0 0 30px rgba(255, 255, 255, 0.3)',
              '0 0 45px rgba(248, 154, 28, 0.4)',
              '0 0 30px rgba(255, 255, 255, 0.3)'
            ]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          ISSAC GONZALEZ
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          className="text-lg md:text-xl lg:text-2xl uppercase mb-12 font-inter"
          style={isLightMode ? {
            color: '#000000',
            letterSpacing: '0.2em',
            fontFamily: 'Inter, sans-serif',
            opacity: 0.8
          } : {
            color: '#F89A1C',
            letterSpacing: '0.2em',
            fontFamily: 'Inter, sans-serif'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          WEB DEVELOPER
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          className={`text-sm tracking-wider font-inter ${
            isLightMode ? 'text-black' : 'text-aurelius-gold'
          }`}
          style={{
            fontFamily: 'Inter, sans-serif'
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Loading {Math.round(progress)}%
        </motion.div>
      </motion.div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full opacity-70 ${
              isLightMode ? 'bg-black' : 'bg-aurelius-gold'
            }`}
            style={{
              left: `${(i * 135.7) % 100}%`,
              top: `${(i * 423.1) % 100}%`,
              boxShadow: isLightMode 
                ? '0 0 8px rgba(0, 0, 0, 0.6)'
                : '0 0 8px rgba(248, 154, 28, 0.6)',
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, Math.sin(i) * 25, 0],
              opacity: [0.3, 0.9, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Orbiting Elements */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      >
        <div className="relative w-32 h-32">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${
                isLightMode ? 'bg-black' : 'bg-aurelius-gold'
              }`}
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: `${40 + i * 20}px 0`,
                boxShadow: isLightMode 
                  ? '0 0 6px rgba(0, 0, 0, 0.8)'
                  : '0 0 6px rgba(248, 154, 28, 0.8)',
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 8 + i * 2, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
