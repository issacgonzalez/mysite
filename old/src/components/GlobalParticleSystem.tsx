import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useAccessibility } from './AccessibilityProvider';

interface Particle {
  id: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  velocityX: number;
  velocityY: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
  rotationSpeed: number;
  rotation: number;
  layer: number;
}

interface GlobalParticleSystemProps {
  children?: React.ReactNode;
  particleCount?: number;
  enableMouseEffect?: boolean;
  isProjectsPageOpen?: boolean;
  isProjectPageOpen?: boolean;
  isLoading?: boolean;
}

export function GlobalParticleSystem({ 
  children, 
  particleCount = 80, // Reduced for better performance
  enableMouseEffect = true,
  isProjectsPageOpen = false,
  isProjectPageOpen = false,
  isLoading = false
}: GlobalParticleSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isLightMode, setIsLightMode] = useState(false);
  const { settings } = useAccessibility();
  const [isMounted, setIsMounted] = useState(false);
  
  // Prevent rendering until mounted
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Performance optimization for projects pages and loading states
  const optimizedParticleCount = useMemo(() => {
    if (!isMounted || isLoading) {
      return 0; // No particles during loading for better performance
    }
    if (isProjectsPageOpen || isProjectPageOpen) {
      return Math.floor(particleCount * 0.3); // Reduce to 30% for performance
    }
    return particleCount;
  }, [particleCount, isProjectsPageOpen, isProjectPageOpen, isLoading]);
  
  const shouldReduceEffects = isProjectsPageOpen || isProjectPageOpen || isLoading;
  
  // Mouse tracking for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

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

  // Enhanced particle colors - theme aware with better visibility
  const getParticleColors = () => {
    if (isLightMode) {
      // Dark pixels for light mode with better contrast
      return [
        'rgba(0, 0, 0, 0.8)', // Strong dark for visibility
        'rgba(0, 0, 0, 0.7)', // Medium dark
        'rgba(0, 0, 0, 0.6)', // Lighter dark
        'rgba(9, 51, 44, 0.9)', // Strong Fence Green
        'rgba(46, 75, 60, 0.8)', // Strong Norfolk Green
        'rgba(9, 51, 44, 0.7)', // Medium Fence Green
        'rgba(46, 75, 60, 0.6)', // Medium Norfolk Green
        'rgba(0, 0, 0, 0.5)', // Subtle dark
      ];
    } else {
      // Enhanced orange theme for dark mode with better glow
      return [
        '#F89A1C', // aurelius-gold
        '#FBB454', // aurelius-gold-light  
        '#E8830C', // aurelius-gold-dark
        '#F59E0B', // aurelius-amber
        '#EA580C', // aurelius-orange
        '#FFD700', // aurelius-yellow
        '#FFED4A', // aurelius-yellow-light
        '#FFA500', // Additional orange
        '#FF8C00', // Additional darker orange
      ];
    }
  };

  const createParticle = useCallback((index: number): Particle => {
    const colors = getParticleColors();
    const baseX = Math.random() * 100;
    const baseY = Math.random() * 100;
    
    // Create different particle layers for depth
    const layer = Math.floor(Math.random() * 3); // 0, 1, 2 for background, mid, foreground
    
    // Smaller pixel sizes - more subtle but still visible
    const pixelSize = Math.floor(Math.random() * 4) + 2 + layer; // 2-5px + layer bonus
    
    return {
      id: index,
      x: baseX,
      y: baseY,
      baseX,
      baseY,
      velocityX: (Math.random() - 0.5) * 0.05, // Reduced from 0.3 to 0.05
      velocityY: (Math.random() - 0.5) * 0.05 - 0.02, // Reduced from 0.3 to 0.05, upward bias reduced
      size: pixelSize,
      opacity: Math.random() * 0.6 + 0.4 - (layer * 0.1), // Much more visible
      life: Math.random() * 2000 + 3000,
      maxLife: Math.random() * 2000 + 3000,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotationSpeed: (Math.random() - 0.5) * 0.2, // Reduced from 1 to 0.2
      rotation: Math.random() * 360,
      layer
    };
  }, [isLightMode]);

  // Initialize particles with optimization - prevent infinite loop
  useEffect(() => {
    if (optimizedParticleCount === 0) {
      setParticles([]);
      return;
    }
    
    const newParticles = Array.from({ length: optimizedParticleCount }, (_, i) => createParticle(i));
    setParticles(newParticles);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optimizedParticleCount, isLightMode]);

  // Mouse movement handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || !enableMouseEffect) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width;
    const normalizedY = (e.clientY - rect.top) / rect.height;
    
    mouseX.set((normalizedX - 0.5) * 100);
    mouseY.set((normalizedY - 0.5) * 100);
  }, [enableMouseEffect, mouseX, mouseY]);

  // Animation loop - optimized for projects pages
  const updateParticles = useCallback(() => {
    setParticles(prevParticles => 
      prevParticles.map(particle => {
        // Slower particle aging for projects pages to reduce updates
        const ageRate = shouldReduceEffects ? 24 : 16;
        let newLife = particle.life - ageRate;
        let newParticle = { ...particle, life: newLife };
        
        // Respawn particle if life is over
        if (newLife <= 0) {
          newParticle = createParticle(particle.id);
        } else {
          // Update particle properties - reduced motion for projects pages
          const rotationMultiplier = shouldReduceEffects ? 0.2 : 0.4; // Further reduced rotation
          newParticle.rotation += particle.rotationSpeed * rotationMultiplier;
          newParticle.opacity = (newLife / particle.maxLife) * (0.9 - particle.layer * 0.1); // Enhanced opacity
          
          // Gentle floating movement - reduced for projects pages
          const velocityMultiplier = shouldReduceEffects ? 0.3 : 0.5; // Further reduced movement
          newParticle.baseY += particle.velocityY * velocityMultiplier;
          newParticle.baseX += particle.velocityX * velocityMultiplier;
          
          // Wrap around boundaries
          if (newParticle.baseX > 105) newParticle.baseX = -5;
          if (newParticle.baseX < -5) newParticle.baseX = 105;
          if (newParticle.baseY > 105) newParticle.baseY = -5;
          if (newParticle.baseY < -5) newParticle.baseY = 105;
        }
        
        return newParticle;
      })
    );
  }, [createParticle, shouldReduceEffects]);

  useEffect(() => {
    // Don't run animation if no particles or reduced motion
    if (settings.reducedMotion || particles.length === 0 || !isMounted) return;
    
    // Reduce frame rate for projects pages to improve performance
    let lastUpdate = 0;
    const targetFPS = shouldReduceEffects ? 30 : 60; // 30fps for projects pages, 60fps otherwise
    const frameInterval = 1000 / targetFPS;
    let mounted = true;
    
    const animate = (currentTime: number) => {
      if (!mounted) return;
      
      if (currentTime - lastUpdate >= frameInterval) {
        updateParticles();
        lastUpdate = currentTime;
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      mounted = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateParticles, settings.reducedMotion, shouldReduceEffects, particles.length, isMounted]);

  useEffect(() => {
    if (settings.reducedMotion) return;
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove, settings.reducedMotion]);

  if (settings.reducedMotion || isLoading) {
    return (
      <div className="relative">
        {children}
        {/* Static particles for reduced motion - reduced count for projects pages, none during loading */}
        {!isLoading && (
          <div className="fixed inset-0 pointer-events-none z-1">
            {[...Array(shouldReduceEffects ? 15 : 50)].map((_, i) => (
              <div
                key={`static-${i}`}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${2 + Math.random() * 3}px`,
                  height: `${2 + Math.random() * 3}px`,
                  backgroundColor: isLightMode 
                    ? 'rgba(0, 0, 0, 0.4)' 
                    : 'rgba(248, 154, 28, 0.5)',
                  imageRendering: 'pixelated',
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {children}
      
      {/* Global Particle Canvas - Enhanced Visibility */}
      <div className="fixed inset-0 pointer-events-none z-1">
        {/* Background Layer Pixels */}
        {particles.filter(p => p.layer === 0).map(particle => (
          <motion.div
            key={`bg-${particle.id}`}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size, // Full size for better visibility
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity * 0.9, // Much more visible
              transform: `rotate(${particle.rotation}deg)`,
              imageRendering: 'pixelated',
              boxShadow: isLightMode 
                ? `0 0 ${particle.size * 0.8}px rgba(0, 0, 0, 0.5)`
                : `0 0 ${particle.size * 1.5}px ${particle.color}60` // Enhanced glow
            }}
            animate={{
              x: [0, Math.sin(particle.id) * 2, 0], // Reduced movement from 10 to 2
              y: [0, Math.cos(particle.id) * 1.5, 0], // Reduced movement from 8 to 1.5
              scale: [0.95, 1.05, 0.95] // Reduced scaling from 0.8-1.1 to 0.95-1.05
            }}
            transition={{
              duration: shouldReduceEffects ? 12 + Math.random() * 6 : 8 + Math.random() * 4, // Much slower transitions
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * (shouldReduceEffects ? 6 : 4)
            }}
          />
        ))}
        
        {/* Midground Layer Pixels */}
        {particles.filter(p => p.layer === 1).map(particle => (
          <motion.div
            key={`mid-${particle.id}`}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity, // Full visibility
              transform: `rotate(${particle.rotation}deg)`,
              imageRendering: 'pixelated',
              boxShadow: isLightMode 
                ? `0 0 ${particle.size * 1.2}px rgba(0, 0, 0, 0.6)`
                : `0 0 ${particle.size * 2.5}px ${particle.color}70` // Enhanced midground glow
            }}
            animate={{
              x: [0, Math.sin(particle.id + 1) * 3, 0], // Reduced movement from 15 to 3
              y: [0, Math.cos(particle.id + 1) * 2, 0], // Reduced movement from 12 to 2
              scale: [0.95, 1.1, 0.95], // Reduced scaling from 0.9-1.2 to 0.95-1.1
              rotate: [0, 90, 180] // Reduced rotation from 360 to 180
            }}
            transition={{
              duration: shouldReduceEffects ? 10 + Math.random() * 6 : 6 + Math.random() * 4, // Much slower transitions
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * (shouldReduceEffects ? 5 : 3)
            }}
          />
        ))}
        
        {/* Foreground Layer Pixels */}
        {particles.filter(p => p.layer === 2).map(particle => (
          <motion.div
            key={`fg-${particle.id}`}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size * 1.3, // Bigger for foreground
              height: particle.size * 1.3,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              transform: `rotate(${particle.rotation}deg)`,
              imageRendering: 'pixelated',
              boxShadow: isLightMode 
                ? `0 0 ${particle.size * 2}px rgba(0, 0, 0, 0.7)`
                : `0 0 ${particle.size * 4}px ${particle.color}90`, // Enhanced foreground glow
              border: isLightMode 
                ? `1px solid rgba(0, 0, 0, 0.4)`
                : `1px solid ${particle.color}40`
            }}
            animate={{
              x: [0, Math.sin(particle.id + 2) * 4, 0], // Reduced movement from 20 to 4
              y: [0, Math.cos(particle.id + 2) * 3, 0], // Reduced movement from 16 to 3
              scale: [1, 1.1, 1], // Reduced scaling from 1.3 to 1.1
              rotate: [0, 180, 0] // Reduced rotation from 360 to 180
            }}
            transition={{
              duration: shouldReduceEffects ? 8 + Math.random() * 4 : 5 + Math.random() * 3, // Much slower transitions
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * (shouldReduceEffects ? 4 : 2)
            }}
          />
        ))}
        
        {/* Mouse-reactive particles - reduced for projects pages */}
        {enableMouseEffect && !shouldReduceEffects && (
          <motion.div
            className="absolute inset-0"
            style={{
              x: smoothMouseX * -0.005, // Reduced mouse effect from -0.02 to -0.005
              y: smoothMouseY * -0.005 // Reduced mouse effect from -0.02 to -0.005
            }}
          >
            {particles.slice(0, 25).map(particle => (
              <motion.div
                key={`mouse-${particle.id}`}
                className="absolute"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size * 0.6,
                  height: particle.size * 0.6,
                  backgroundColor: particle.color,
                  opacity: particle.opacity * 0.5,
                  imageRendering: 'pixelated',
                  boxShadow: isLightMode 
                    ? `0 0 ${particle.size * 0.8}px rgba(0, 0, 0, 0.4)`
                    : `0 0 ${particle.size}px ${particle.color}60`
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Enhanced section-specific particle overlays - reduced for projects pages */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Additional floating particles for extra density */}
        {!shouldReduceEffects && [...Array(Math.floor(optimizedParticleCount * 0.4))].map((_, i) => (
          <motion.div
            key={`extra-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`, // Smaller extra particles
              height: `${2 + Math.random() * 3}px`,
              backgroundColor: isLightMode 
                ? 'rgba(0, 0, 0, 0.6)' 
                : 'rgba(248, 154, 28, 0.5)',
              imageRendering: 'pixelated',
              boxShadow: isLightMode 
                ? '0 0 8px rgba(0, 0, 0, 0.4)'
                : '0 0 10px rgba(248, 154, 28, 0.6)',
            }}
            animate={{
              y: [0, -10, 0], // Reduced vertical movement from -60 to -10
              x: [0, Math.random() * 6 - 3, 0], // Reduced horizontal movement from 30 to 6
              opacity: [0.3, 0.8, 0.3], // Slightly reduced opacity peak
              scale: [1, 1.3, 1], // Reduced scaling from 2.2 to 1.3
              rotate: [0, 180] // Reduced rotation from 360 to 180
            }}
            transition={{
              duration: 10 + Math.random() * 6, // Much slower transitions
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
      
      {/* Background ambient particles - More prominent, reduced for projects pages */}
      <div className="fixed inset-0 pointer-events-none z-1">
        {[...Array(Math.floor(optimizedParticleCount * (shouldReduceEffects ? 0.2 : 0.5)))].map((_, i) => (
          <motion.div
            key={`ambient-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`, // Smaller particles
              height: `${2 + Math.random() * 3}px`,
              backgroundColor: isLightMode 
                ? 'rgba(0, 0, 0, 0.7)' // Much more visible in light mode
                : 'rgba(248, 154, 28, 0.8)', // Much more visible in dark mode
              imageRendering: 'pixelated',
              boxShadow: isLightMode 
                ? '0 0 6px rgba(0, 0, 0, 0.4)'
                : '0 0 8px rgba(248, 154, 28, 0.6)',
            }}
            animate={{
              y: [0, -8, 0], // Reduced vertical movement from -50 to -8
              x: [0, Math.sin(i) * 4, 0], // Reduced horizontal movement from 25 to 4
              opacity: [0.4, 0.8, 0.4], // Slightly reduced peak opacity
              scale: [0.9, 1.2, 0.9], // Reduced scaling from 0.8-2 to 0.9-1.2
              rotate: [0, 180] // Reduced rotation from 360 to 180
            }}
            transition={{
              duration: shouldReduceEffects ? 15 + Math.random() * 10 : 10 + Math.random() * 8, // Much slower for minimal movement
              repeat: Infinity,
              delay: Math.random() * (shouldReduceEffects ? 10 : 6),
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
      
      {/* Prominent floating pixels for continuous coverage - reduced for projects pages */}
      <div className="fixed inset-0 pointer-events-none z-1">
        {[...Array(shouldReduceEffects ? 25 : 80)].map((_, i) => (
          <motion.div
            key={`floating-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${3 + Math.random() * 4}px`, // Smaller prominent pixels
              height: `${3 + Math.random() * 4}px`,
              backgroundColor: isLightMode 
                ? `rgba(0, 0, 0, ${0.5 + Math.random() * 0.4})` // Very visible dark pixels
                : `rgba(248, 154, 28, ${0.6 + Math.random() * 0.4})`, // Very visible orange pixels
              imageRendering: 'pixelated',
              boxShadow: isLightMode 
                ? '0 0 10px rgba(0, 0, 0, 0.5)'
                : '0 0 12px rgba(248, 154, 28, 0.7)',
              borderRadius: Math.random() > 0.5 ? '1px' : '0px', // Some slightly rounded
            }}
            animate={{
              y: [0, -12 - Math.random() * 8, 0], // Reduced vertical movement from -80-120 to -12-20
              x: [0, (Math.random() - 0.5) * 8, 0], // Reduced horizontal movement from 60 to 8
              opacity: [0.6, 0.9, 0.6], // Slightly reduced peak opacity
              scale: [1, 1.15 + Math.random() * 0.15, 1], // Reduced scaling from 1-2 to 1-1.3
              rotate: [0, Math.random() * 120] // Reduced rotation from 360 to 120
            }}
            transition={{
              duration: shouldReduceEffects ? 20 + Math.random() * 12 : 15 + Math.random() * 10, // Extremely slow for minimal movement
              repeat: Infinity,
              delay: Math.random() * (shouldReduceEffects ? 12 : 8),
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Section-specific particle enhancements
export function SectionParticleOverlay({ 
  density = 'medium',
  colors = 'orange' 
}: { 
  density?: 'low' | 'medium' | 'high';
  colors?: 'orange' | 'mixed' | 'white';
}) {
  const { settings } = useAccessibility();
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
  
  if (settings.reducedMotion) return null;
  
  const getParticleCount = () => {
    switch (density) {
      case 'low': return 12; // Increased from 8
      case 'high': return 28; // Increased from 20
      default: return 18; // Increased from 12
    }
  };
  
  const getColors = () => {
    // White stardust colors for Dynamic Convergences section
    if (colors === 'white') {
      return [
        'rgba(255, 255, 255, 0.9)', // Bright white
        'rgba(255, 255, 255, 0.8)', // Medium white
        'rgba(255, 255, 255, 0.7)', // Subtle white
        'rgba(248, 250, 252, 0.8)', // Very light blue-white
        'rgba(241, 245, 249, 0.7)', // Light gray-white
        'rgba(226, 232, 240, 0.6)', // Soft gray-white
      ];
    }
    
    if (isLightMode) {
      // Dark colors for light mode
      return [
        'rgba(0, 0, 0, 0.6)',
        'rgba(9, 51, 44, 0.7)', // Fence Green
        'rgba(46, 75, 60, 0.6)', // Norfolk Green
        'rgba(0, 0, 0, 0.5)'
      ];
    } else {
      // Orange colors for dark mode
      if (colors === 'mixed') {
        return ['#F89A1C', '#FBB454', '#FFD700', '#FFED4A'];
      }
      return ['#F89A1C', '#FBB454', '#E8830C'];
    }
  };
  
  const particleColors = getColors();
  const particleCount = getParticleCount();
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 3 + 2, // Smaller section particles: 2-4px
            height: Math.random() * 3 + 2,
            backgroundColor: particleColors[Math.floor(Math.random() * particleColors.length)],
            opacity: Math.random() * 0.5 + 0.2,
            imageRendering: 'pixelated',
            boxShadow: colors === 'white'
              ? '0 0 12px rgba(255, 255, 255, 0.8), 0 0 24px rgba(255, 255, 255, 0.4)' // Strong white glow
              : isLightMode 
                ? '0 0 8px rgba(0, 0, 0, 0.3)'
                : '0 0 6px rgba(248, 154, 28, 0.4)'
          }}
          animate={{
            y: [0, -8, 0], // Reduced vertical movement from -40 to -8
            x: [0, Math.sin(i) * 3, 0], // Reduced horizontal movement from 20 to 3
            rotate: [0, 90, 0], // Reduced rotation from 360 to 90
            scale: [0.8, 1.15, 0.8], // Reduced scaling from 0.6-1.4 to 0.8-1.15
            opacity: [0.2, 0.6, 0.2] // Slightly reduced peak opacity
          }}
          transition={{
            duration: 12 + Math.random() * 8, // Much slower transitions
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}