import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import astronautBull from '@/assets/1f41969c4bfeed74d089c60bfee3e5c5cc070324.png';

export function DynamicConvergences() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLightMode, setIsLightMode] = useState(false);

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
  
  // Scroll-based progress for all animations - more forgiving offset
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  // Scroll-driven animations
  
  // Triangle positions - entrance, stable, and exit phases
  const topLeftTriangleX = useTransform(scrollYProgress, [0, 0.15, 0.3, 0.7, 0.85, 1], ['-70vw', '-20vw', '10vw', '10vw', '-20vw', '-70vw']);
  const topLeftTriangleY = useTransform(scrollYProgress, [0, 0.15, 0.3, 0.7, 0.85, 1], ['-70vh', '-20vh', '10vh', '10vh', '-20vh', '-70vh']);
  const topLeftTriangleScale = useTransform(scrollYProgress, [0, 0.15, 0.3, 0.7, 0.85, 1], [0.7, 1, 1.2, 1.2, 1, 0.7]);
  const topLeftTriangleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.3, 0.7, 0.9, 1], [0, 0.8, 1, 1, 0.8, 0]);
  
  const bottomRightTriangleX = useTransform(scrollYProgress, [0.05, 0.2, 0.35, 0.75, 0.9, 1], ['70vw', '20vw', '-10vw', '-10vw', '20vw', '70vw']);
  const bottomRightTriangleY = useTransform(scrollYProgress, [0.05, 0.2, 0.35, 0.75, 0.9, 1], ['70vh', '20vh', '-10vh', '-10vh', '20vh', '70vh']);
  const bottomRightTriangleScale = useTransform(scrollYProgress, [0.05, 0.2, 0.35, 0.75, 0.9, 1], [0.7, 1, 1.2, 1.2, 1, 0.7]);
  const bottomRightTriangleOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.35, 0.75, 0.95, 1], [0, 0.8, 1, 1, 0.8, 0]);
  

  
  // Convergence effects - appear when triangles meet, fade out on exit
  const convergenceOpacity = useTransform(scrollYProgress, [0.25, 0.4, 0.7, 0.85], [0, 1, 1, 0]);
  const sparkleScale = useTransform(scrollYProgress, [0.3, 0.45, 0.7, 0.85], [0, 1, 1, 0]);
  
  // Content reveal - appears very early with maximum viewing time (60% of scroll progress!)
  const contentOpacity = useTransform(scrollYProgress, [0.35, 0.4], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.35, 0.4], [50, 0]);
  const contentScale = useTransform(scrollYProgress, [0.35, 0.4], [0.9, 1]);

  // Astronaut Bull Floating Animation - Comes from right side, settles, then exits on a path
  const astronautX = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.8, 1], [500, 230, 415, 450, 520]); // Exits to the right
  const astronautY = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.8, 1], [220, 40, 220, 280, 400]); // Exits down and away
  const astronautScale = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.8, 1], [0.3, 0.9, 1.7, 1.7, 1.7]); // Maintains size during exit
  const astronautOpacity = useTransform(scrollYProgress, [0, 0.1, 0.3, 0.6], [0, 0.6, 0.9, 0.7]); // No fade out - stays visible
  const astronautRotate = useTransform(scrollYProgress, [0, 0.8, 1], [-10, 5, 15]); // Gentle rotation as it exits



  return (
    <section 
      ref={containerRef}
      id="dynamic-convergences"
      className="relative h-[110vh] bg-black overflow-hidden flex items-center justify-center"
    >

      

      {/* Left Particle Field - Entrance, Stable, Exit Animation */}
      <motion.div
        className="absolute z-5 w-full h-full"
        style={{
          opacity: topLeftTriangleOpacity,
          x: topLeftTriangleX,
          y: topLeftTriangleY,
          scale: topLeftTriangleScale
        }}
      >
        {/* Generate twinkling particles for left side */}
        {Array.from({ length: 75 }, (_, i) => {
          const size = Math.random() * 8 + 2;
          const x = Math.random() * 60; // Left 60% of screen
          const y = Math.random() * 100;
          const opacity = Math.random() * 0.8 + 0.2;
          const isLightGray = Math.random() > 0.6;
          const delay = (i / 75) * 0.5; // Stagger animation
          const twinkleDelay = Math.random() * 5; // Random twinkle start
          
          // Same colors for both themes
          const particleColor = isLightGray ? `rgba(209, 213, 219, ${opacity})` : `rgba(107, 114, 128, ${opacity})`;
          const particleFilter = isLightGray ? 'drop-shadow(0 0 3px rgba(209, 213, 219, 0.4))' : 'drop-shadow(0 0 2px rgba(107, 114, 128, 0.2))';
          
          return (
            <motion.div
              key={`left-${i}`}
              className="absolute dynamic-particle"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: particleColor,
                filter: particleFilter,
                imageRendering: 'pixelated'
              }}
              initial={{ 
                scale: 0,
                opacity: 0
              }}
              animate={{ 
                scale: [1, 1.15, 1, 1.08, 1], // Subtle twinkle scale animation
                opacity: [opacity, opacity * 1.2, opacity * 0.6, opacity * 1.1, opacity], // Gentle twinkle opacity animation
                backgroundColor: [
                  particleColor,
                  isLightGray ? `rgba(209, 213, 219, ${opacity * 1.2})` : `rgba(107, 114, 128, ${opacity * 1.2})`,
                  isLightGray ? `rgba(209, 213, 219, ${opacity * 0.6})` : `rgba(107, 114, 128, ${opacity * 0.6})`,
                  isLightGray ? `rgba(209, 213, 219, ${opacity * 1.1})` : `rgba(107, 114, 128, ${opacity * 1.1})`,
                  particleColor
                ],
                filter: [
                  particleFilter,
                  isLightGray ? 'drop-shadow(0 0 5px rgba(209, 213, 219, 0.6))' : 'drop-shadow(0 0 4px rgba(107, 114, 128, 0.4))',
                  particleFilter,
                  isLightGray ? 'drop-shadow(0 0 4px rgba(209, 213, 219, 0.5))' : 'drop-shadow(0 0 3px rgba(107, 114, 128, 0.3))',
                  particleFilter
                ]
              }}
              transition={{ 
                duration: 0.6,
                delay: delay,
                ease: [0.25, 0.46, 0.45, 0.94],
                // Continuous twinkle animation
                scale: {
                  repeat: Infinity,
                  duration: 3 + Math.random() * 2, // Random duration between 3-5 seconds
                  delay: twinkleDelay,
                  ease: "easeInOut"
                },
                opacity: {
                  repeat: Infinity,
                  duration: 3 + Math.random() * 2,
                  delay: twinkleDelay,
                  ease: "easeInOut"
                },
                filter: {
                  repeat: Infinity,
                  duration: 3 + Math.random() * 2,
                  delay: twinkleDelay,
                  ease: "easeInOut"
                }
              }}
            />
          );
        })}
      </motion.div>

      {/* Right Particle Field - Entrance, Stable, Exit Animation */}
      <motion.div
        className="absolute z-5 w-full h-full"
        style={{
          opacity: bottomRightTriangleOpacity,
          x: bottomRightTriangleX,
          y: bottomRightTriangleY,
          scale: bottomRightTriangleScale
        }}
      >
        {/* Generate twinkling particles for right side */}
        {Array.from({ length: 75 }, (_, i) => {
          const size = Math.random() * 8 + 2;
          const x = 40 + Math.random() * 60; // Right 60% of screen
          const y = Math.random() * 100;
          const opacity = Math.random() * 0.8 + 0.2;
          const isLightGray = Math.random() > 0.6;
          const delay = (i / 75) * 0.5; // Stagger animation
          const twinkleDelay = Math.random() * 5; // Random twinkle start
          
          // Same colors for both themes
          const particleColor = isLightGray ? `rgba(209, 213, 219, ${opacity})` : `rgba(75, 85, 99, ${opacity})`;
          const particleFilter = isLightGray ? 'drop-shadow(0 0 3px rgba(209, 213, 219, 0.4))' : 'drop-shadow(0 0 2px rgba(75, 85, 99, 0.2))';
          
          return (
            <motion.div
              key={`right-${i}`}
              className="absolute dynamic-particle"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: particleColor,
                filter: particleFilter,
                imageRendering: 'pixelated'
              }}
              initial={{ 
                scale: 0,
                opacity: 0
              }}
              animate={{ 
                scale: [1, 1.15, 1, 1.08, 1], // Subtle twinkle scale animation
                opacity: [opacity, opacity * 1.2, opacity * 0.6, opacity * 1.1, opacity], // Gentle twinkle opacity animation
                backgroundColor: [
                  particleColor,
                  isLightGray ? `rgba(209, 213, 219, ${opacity * 1.2})` : `rgba(75, 85, 99, ${opacity * 1.2})`,
                  isLightGray ? `rgba(209, 213, 219, ${opacity * 0.6})` : `rgba(75, 85, 99, ${opacity * 0.6})`,
                  isLightGray ? `rgba(209, 213, 219, ${opacity * 1.1})` : `rgba(75, 85, 99, ${opacity * 1.1})`,
                  particleColor
                ],
                filter: [
                  particleFilter,
                  isLightGray ? 'drop-shadow(0 0 5px rgba(209, 213, 219, 0.6))' : 'drop-shadow(0 0 4px rgba(75, 85, 99, 0.4))',
                  particleFilter,
                  isLightGray ? 'drop-shadow(0 0 4px rgba(209, 213, 219, 0.5))' : 'drop-shadow(0 0 3px rgba(75, 85, 99, 0.3))',
                  particleFilter
                ]
              }}
              transition={{ 
                duration: 0.6,
                delay: delay,
                ease: [0.25, 0.46, 0.45, 0.94],
                // Continuous twinkle animation
                scale: {
                  repeat: Infinity,
                  duration: 3 + Math.random() * 2, // Random duration between 3-5 seconds
                  delay: twinkleDelay,
                  ease: "easeInOut"
                },
                opacity: {
                  repeat: Infinity,
                  duration: 3 + Math.random() * 2,
                  delay: twinkleDelay,
                  ease: "easeInOut"
                },
                filter: {
                  repeat: Infinity,
                  duration: 3 + Math.random() * 2,
                  delay: twinkleDelay,
                  ease: "easeInOut"
                }
              }}
            />
          );
        })}
      </motion.div>

      {/* Astronaut Bull - Floating from Right Side - FRONT LAYER */}
      <motion.div
        className="absolute top-1/2 left-1/2 z-15 pointer-events-none"
        style={{
          x: astronautX,
          y: astronautY,
          scale: astronautScale,
          opacity: astronautOpacity,
          rotate: astronautRotate,
        }}
      >
        <motion.div
          className="relative"
          animate={{
            y: [0, -8, 0, -5, 0],
            rotate: [0, 2, 0, -1, 0],
            scale: [1, 1.02, 1, 1.01, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1]
          }}
        >
          <img 
            src={astronautBull} 
            alt="Space Explorer Bull" 
            className="w-64 h-64 object-contain transform -translate-x-1/2 -translate-y-1/2"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.2))'
            }}
          />
          
          {/* Subtle Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(107, 114, 128, 0.02) 40%, transparent 70%)',
              filter: 'blur(15px)',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>



      {/* Convergence Effects - ORIGINAL WHITE STAR BURST */}
      <motion.div
        className="absolute inset-0 z-6 pointer-events-none"
        style={{ opacity: convergenceOpacity }}
      >
        {/* Central explosion effect - CSS THEME AWARE */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 convergence-explosion"
          style={{
            width: '500px',
            height: '500px',
            scale: sparkleScale,
            filter: 'blur(25px)',
          }}
          animate={{
            scale: [sparkleScale, sparkleScale * 1.2, sparkleScale],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Convergence shockwave rings - CSS THEME AWARE */}
        {Array.from({ length: 4 }, (_, i) => (
          <motion.div
            key={`ring-${i}`}
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 convergence-ring ring-${i + 1}`}
            style={{
              width: `${300 + i * 120}px`,
              height: `${300 + i * 120}px`,
              scale: sparkleScale,
              filter: `blur(${2 + i * 1}px)`,
            }}
            animate={{
              scale: [sparkleScale, sparkleScale * 1.2, sparkleScale],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Twinkling sparkles - CSS THEME AWARE */}
        {Array.from({ length: 16 }, (_, i) => (
          <motion.div
            key={`spark-${i}`}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 convergence-sparkle"
            style={{
              width: '5px',
              height: '5px',
              scale: sparkleScale,
              x: Math.cos(i * 22.5 * Math.PI / 180) * (100 + (i % 4) * 35),
              y: Math.sin(i * 22.5 * Math.PI / 180) * (100 + (i % 4) * 35),
              imageRendering: 'pixelated'
            }}
            animate={{
              scale: [1, 1.4, 0.8, 1.2, 1],
              opacity: [0.6, 1, 0.4, 0.8, 0.6]
            }}
            transition={{
              duration: 2.5 + Math.random() * 1.5, // Random duration between 2.5-4 seconds
              repeat: Infinity,
              delay: Math.random() * 2, // Random start delay
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      {/* Content Layer - Clean Design Without Backgrounds */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center z-10 text-center max-w-4xl mx-auto px-4"
        style={{ 
          opacity: contentOpacity,
          scale: contentScale,
        }}
      >
        <motion.div
          style={{
            y: contentY,
          }}
        >
          {/* Simplified Hero-Style Titles - Always Visible */}
          <motion.h2 
            className="text-6xl md:text-8xl lg:text-9xl tracking-tighter mb-8 relative dynamic-convergences-title text-aurelius-gold animate-dynamic-title-glow"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform, filter'
            }}
          >
            DYNAMIC
          </motion.h2>

          <motion.h2 
            className="text-6xl md:text-8xl lg:text-9xl tracking-tighter mb-8 relative dynamic-convergences-title text-white animate-convergence-title-glow"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform, filter'
            }}
          >
            CONVERGENCE
          </motion.h2>

          {/* HR Line to match other sections */}
          <motion.div 
            className={`w-24 h-1 mx-auto mb-12 ${isLightMode ? 'bg-fiery-glow' : 'bg-aurelius-gold'}`}
            initial={{ width: 0 }}
            animate={{ width: '6rem' }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />

          {/* Description - Same styling for both themes */}
          <motion.p 
            className="text-xl md:text-2xl text-white leading-relaxed max-w-2xl mx-auto mb-12"
            style={{
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
            }}
          >
            You and your imagination{' '}
            <motion.span 
              className="text-aurelius-gold relative inline-block"
              style={{
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.7)'
              }}
              whileHover={{ 
                scale: 1.05,
                textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)'
              }}
            >
              bull-charge into orbit
            </motion.span>
            , redefining what's possible with{' '}
            <motion.span 
              className="text-aurelius-gold relative inline-block"
              style={{
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.7)'
              }}
              whileHover={{ 
                scale: 1.05,
                textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)'
              }}
            >
              technology
            </motion.span>
            .
            
          </motion.p>
          
          {/* Action buttons - Clean Brand Style */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-6 mt-16"
          >
            <motion.button 
              className="px-8 py-4 border-2 border-aurelius-gold rounded-lg backdrop-blur-sm bg-black/30 text-aurelius-gold hover:bg-aurelius-gold/10 transition-all duration-300 cursor-pointer text-lg font-medium"
              style={{
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Portfolio
            </motion.button>
            <motion.button 
              className="px-8 py-4 bg-aurelius-gold text-black rounded-lg hover:bg-aurelius-gold-light transition-all duration-300 cursor-pointer text-lg font-medium"
              style={{
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              Start Conversation
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
