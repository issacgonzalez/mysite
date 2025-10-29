import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'motion/react';
import exampleImage from '@/assets/ecbb3e44b891555290d9941209019fda1ed55ba9.png';


// Simple Moving Particle Component
const MovingParticle = ({ index }: { index: number }) => {
  const randomSeed = {
    x: (index * 123.456) % 100,
    y: (index * 234.567) % 100,
    size: 2 + (index % 4),
    speed: 8 + (index % 12),
    direction: (index * 67) % 360,
    opacity: 0.1 + (index * 0.05) % 0.4,
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${randomSeed.x}%`,
        top: `${randomSeed.y}%`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: randomSeed.opacity,
        scale: 1,
        x: [
          0,
          Math.cos(randomSeed.direction * Math.PI / 180) * 200,
          Math.cos((randomSeed.direction + 90) * Math.PI / 180) * 200,
          Math.cos((randomSeed.direction + 180) * Math.PI / 180) * 200,
          Math.cos((randomSeed.direction + 270) * Math.PI / 180) * 200,
          0
        ],
        y: [
          0,
          Math.sin(randomSeed.direction * Math.PI / 180) * 150,
          Math.sin((randomSeed.direction + 90) * Math.PI / 180) * 150,
          Math.sin((randomSeed.direction + 180) * Math.PI / 180) * 150,
          Math.sin((randomSeed.direction + 270) * Math.PI / 180) * 150,
          0
        ],
        rotate: [0, 360]
      }}
      transition={{
        duration: randomSeed.speed + index * 2,
        repeat: Infinity,
        ease: 'linear',
        delay: index * 0.1
      }}
    >
      <motion.div
        className="bg-aurelius-gold shadow-aurelius-gold"
        style={{
          width: `${randomSeed.size}px`,
          height: `${randomSeed.size}px`,
          imageRendering: 'pixelated',
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 3 + index * 0.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  );
};

export function HeroSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  // Theme detection
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Mouse movement tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax for background image - matching content behavior
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 0.9]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  
  // Light mode blur effect instead of scale
  const imageBlur = useTransform(scrollYProgress, [0, 0.5], [0, 8]); // 0px to 8px blur
  
  // Edge transparency effect - progressive fade on left and right
  const edgeTransparency = useTransform(scrollYProgress, [0, 0.5], [0, 40]); // 0% to 40% transparent edges
  


  useEffect(() => {
    // Coordinate with loading screen completion
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x: x * 60, y: y * 60 }); // Reduced from 100 to 60 for subtlety
        mouseX.set(x * 15); // Reduced from 30 to 15
        mouseY.set(y * 15); // Reduced from 30 to 15
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  // Generate moving particles
  const particles = Array.from({ length: 30 }, (_, i) => i);

  return (
    <section 
      id="hero"
      ref={sectionRef}
      className="min-h-screen relative overflow-hidden bg-black light:bg-fiery-glow flex items-center justify-center transition-colors duration-300"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Hero Background Image with Theme-Aware Filters */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{
          y: imageY,
          scale: isLightMode ? 1.1 : imageScale, // No shrink effect in light mode
          opacity: imageOpacity,
          // Maximum blur edge transparency mask with 50% increased softness
          WebkitMask: `linear-gradient(to right, 
            transparent 0%, 
            rgba(0,0,0,0.01) ${edgeTransparency * 0.25}%, 
            rgba(0,0,0,0.03) ${edgeTransparency * 0.3}%, 
            rgba(0,0,0,0.06) ${edgeTransparency * 0.35}%, 
            rgba(0,0,0,0.08) ${edgeTransparency * 0.4}%, 
            rgba(0,0,0,0.12) ${edgeTransparency * 0.45}%, 
            rgba(0,0,0,0.15) ${edgeTransparency * 0.5}%, 
            rgba(0,0,0,0.25) ${edgeTransparency * 0.55}%, 
            rgba(0,0,0,0.3) ${edgeTransparency * 0.6}%, 
            rgba(0,0,0,0.4) ${edgeTransparency * 0.65}%, 
            rgba(0,0,0,0.5) ${edgeTransparency * 0.7}%, 
            rgba(0,0,0,0.6) ${edgeTransparency * 0.75}%, 
            rgba(0,0,0,0.7) ${edgeTransparency * 0.8}%, 
            rgba(0,0,0,0.8) ${edgeTransparency * 0.85}%, 
            rgba(0,0,0,0.9) ${edgeTransparency * 0.9}%, 
            rgba(0,0,0,0.95) ${edgeTransparency * 0.95}%, 
            rgba(0,0,0,0.98) ${edgeTransparency * 0.98}%, 
            black ${edgeTransparency}%, 
            black ${100 - edgeTransparency}%, 
            rgba(0,0,0,0.98) ${100 - (edgeTransparency * 0.98)}%, 
            rgba(0,0,0,0.95) ${100 - (edgeTransparency * 0.95)}%, 
            rgba(0,0,0,0.9) ${100 - (edgeTransparency * 0.9)}%, 
            rgba(0,0,0,0.8) ${100 - (edgeTransparency * 0.85)}%, 
            rgba(0,0,0,0.7) ${100 - (edgeTransparency * 0.8)}%, 
            rgba(0,0,0,0.6) ${100 - (edgeTransparency * 0.75)}%, 
            rgba(0,0,0,0.5) ${100 - (edgeTransparency * 0.7)}%, 
            rgba(0,0,0,0.4) ${100 - (edgeTransparency * 0.65)}%, 
            rgba(0,0,0,0.3) ${100 - (edgeTransparency * 0.6)}%, 
            rgba(0,0,0,0.25) ${100 - (edgeTransparency * 0.55)}%, 
            rgba(0,0,0,0.15) ${100 - (edgeTransparency * 0.5)}%, 
            rgba(0,0,0,0.12) ${100 - (edgeTransparency * 0.45)}%, 
            rgba(0,0,0,0.08) ${100 - (edgeTransparency * 0.4)}%, 
            rgba(0,0,0,0.06) ${100 - (edgeTransparency * 0.35)}%, 
            rgba(0,0,0,0.03) ${100 - (edgeTransparency * 0.3)}%, 
            rgba(0,0,0,0.01) ${100 - (edgeTransparency * 0.25)}%, 
            transparent 100%)`,
          mask: `linear-gradient(to right, 
            transparent 0%, 
            rgba(0,0,0,0.01) ${edgeTransparency * 0.25}%, 
            rgba(0,0,0,0.03) ${edgeTransparency * 0.3}%, 
            rgba(0,0,0,0.06) ${edgeTransparency * 0.35}%, 
            rgba(0,0,0,0.08) ${edgeTransparency * 0.4}%, 
            rgba(0,0,0,0.12) ${edgeTransparency * 0.45}%, 
            rgba(0,0,0,0.15) ${edgeTransparency * 0.5}%, 
            rgba(0,0,0,0.25) ${edgeTransparency * 0.55}%, 
            rgba(0,0,0,0.3) ${edgeTransparency * 0.6}%, 
            rgba(0,0,0,0.4) ${edgeTransparency * 0.65}%, 
            rgba(0,0,0,0.5) ${edgeTransparency * 0.7}%, 
            rgba(0,0,0,0.6) ${edgeTransparency * 0.75}%, 
            rgba(0,0,0,0.7) ${edgeTransparency * 0.8}%, 
            rgba(0,0,0,0.8) ${edgeTransparency * 0.85}%, 
            rgba(0,0,0,0.9) ${edgeTransparency * 0.9}%, 
            rgba(0,0,0,0.95) ${edgeTransparency * 0.95}%, 
            rgba(0,0,0,0.98) ${edgeTransparency * 0.98}%, 
            black ${edgeTransparency}%, 
            black ${100 - edgeTransparency}%, 
            rgba(0,0,0,0.98) ${100 - (edgeTransparency * 0.98)}%, 
            rgba(0,0,0,0.95) ${100 - (edgeTransparency * 0.95)}%, 
            rgba(0,0,0,0.9) ${100 - (edgeTransparency * 0.9)}%, 
            rgba(0,0,0,0.8) ${100 - (edgeTransparency * 0.85)}%, 
            rgba(0,0,0,0.7) ${100 - (edgeTransparency * 0.8)}%, 
            rgba(0,0,0,0.6) ${100 - (edgeTransparency * 0.75)}%, 
            rgba(0,0,0,0.5) ${100 - (edgeTransparency * 0.7)}%, 
            rgba(0,0,0,0.4) ${100 - (edgeTransparency * 0.65)}%, 
            rgba(0,0,0,0.3) ${100 - (edgeTransparency * 0.6)}%, 
            rgba(0,0,0,0.25) ${100 - (edgeTransparency * 0.55)}%, 
            rgba(0,0,0,0.15) ${100 - (edgeTransparency * 0.5)}%, 
            rgba(0,0,0,0.12) ${100 - (edgeTransparency * 0.45)}%, 
            rgba(0,0,0,0.08) ${100 - (edgeTransparency * 0.4)}%, 
            rgba(0,0,0,0.06) ${100 - (edgeTransparency * 0.35)}%, 
            rgba(0,0,0,0.03) ${100 - (edgeTransparency * 0.3)}%, 
            rgba(0,0,0,0.01) ${100 - (edgeTransparency * 0.25)}%, 
            transparent 100%)`,
          filter: isLightMode 
            ? `blur(${imageBlur}px)` // Dynamic blur effect in light mode
            : 'blur(1px)' // Fixed edge blur in dark mode
        }}
      >
        <img
          src={exampleImage}
          alt="Issac Gonzalez Portrait"
          className="w-full h-full object-cover transition-all duration-300"
          style={{
            filter: isLightMode 
              ? 'grayscale(100%) contrast(1.2) brightness(0.7)' // Brighter in light mode to show through reduced overlay
              : 'grayscale(100%) contrast(1.1) brightness(0.4)',
            objectPosition: 'center 35%' // Position image lower to show more of the picture
          }}
        />
        
        {/* Dynamic Theme-Aware Overlays - Reduced Opacity in Light Mode */}
        <div 
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: isLightMode 
              ? 'linear-gradient(to right, rgba(242, 180, 59, 0.15) 0%, rgba(242, 180, 59, 0.10) 50%, rgba(242, 180, 59, 0.05) 100%)'
              : 'linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.45) 100%)'
          }}
        />
        <div 
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: isLightMode 
              ? 'linear-gradient(to top, rgba(242, 180, 59, 0.20) 0%, transparent 50%, rgba(242, 180, 59, 0.05) 100%)'
              : 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, transparent 50%, rgba(0, 0, 0, 0.30) 100%)'
          }}
        />
        
        {/* Light Mode Color Filter - #f2b43b Tint */}
        <div 
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: isLightMode ? '#f2b43b' : 'transparent',
            mixBlendMode: isLightMode ? 'multiply' : 'normal',
            opacity: isLightMode ? 0.3 : 0
          }}
        />
        
        {/* Light Mode Bottom Gradient - #f2b43b */}
        <div 
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: isLightMode 
              ? 'linear-gradient(to top, #f2b43b 0%, rgba(242, 180, 59, 0.8) 15%, rgba(242, 180, 59, 0.4) 30%, transparent 50%)'
              : 'transparent',
            opacity: isLightMode ? 1 : 0
          }}
        />
        
        {/* SUBTLE: Primary Accent Overlay - Gentle mouseover effect */}
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at ${50 + mousePosition.x * 0.2}% ${50 + mousePosition.y * 0.2}%, 
                        var(--aurelius-gold) 0%, 
                        var(--aurelius-amber) 30%, 
                        transparent 70%)`,
            opacity: isLightMode ? 0.05 : 0.03 // Reduced base opacity
          }}
          animate={{
            opacity: isHovering ? (isLightMode ? 0.25 : 0.08) : (isLightMode ? 0.12 : 0.03), // Much more subtle hover
          }}
          transition={{ duration: 2, ease: 'easeOut' }} // Slower, smoother transition
        />
      </motion.div>



      {/* Enhanced Background Layers */}
      <div className="absolute inset-0 z-10">
        {/* Simple Moving Particles System */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((index) => (
            <MovingParticle key={index} index={index} />
          ))}
        </div>
      </div>

      {/* Content Container with Logo-Aligned Layout */}
      <motion.div 
        style={{ 
          y: y, 
          opacity: opacity, 
          scale: scale 
        }}
        className="relative z-20 w-full"
      >
        <div className="max-w-7xl mx-auto px-6 pt-12 sm:pt-28 md:pt-16 lg:pt-4">
          {/* Logo-Aligned Text Content */}
          <div className="flex items-start min-h-screen pt-36 md:pt-44 lg:pt-52">
            
            {/* Text Content - Aligned with Header Logo */}
            <div className="w-full max-w-4xl">
              
              {/* Enhanced Typography with High Contrast Light Mode Support */}
              <div className="mb-8 relative">
                <motion.div
                  className="relative"
                  initial={{ y: 100, opacity: 0 }}
                  animate={isVisible ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* Eyebrow Text - High Contrast Theme Aware */}
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, x: -50 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <span className="text-aurelius-gold text-sm md:text-base uppercase font-medium transition-colors duration-300"
                      style={{
                        color: isLightMode ? '#000000' : 'var(--aurelius-gold)',
                        textShadow: isLightMode ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.5)',
                        letterSpacing: '0.8em'
                      }}>
                      Web Developer
                    </span>
                  </motion.div>

                  <h1 
                    className="text-6xl md:text-7xl lg:text-8xl xl:text-[6rem] leading-none tracking-tighter mb-4"
                    style={isLightMode ? {
                      // Light mode: Rich dark brown with strong contrast
                      color: '#1a1a1a',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
                    } : {
                      // Dark mode: Existing gradient - FIXED: separated properties
                      backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 0 40px rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    ISSAC
                  </h1>

                  <h1 
                    className="text-6xl md:text-7xl lg:text-8xl xl:text-[6rem] leading-none tracking-tighter -mt-4 mb-8"
                    style={isLightMode ? {
                      // Light mode: Pure black text, no gradient
                      color: '#000000',
                      textShadow: 'none'
                    } : {
                      // Dark mode: Gradient text
                      backgroundImage: 'linear-gradient(to right, var(--aurelius-gold), var(--aurelius-gold-light), var(--aurelius-gold))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      backgroundSize: '200% 200%'
                    }}
                  >
                    GONZALEZ
                  </h1>
                </motion.div>
              </div>

              {/* Enhanced Subtitle with High Contrast Light Mode Support */}
              <motion.div
                className="mb-12 relative"
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 1 }}
              >
                <div className="max-w-xl">
                  <div 
                    className="text-lg md:text-xl leading-relaxed mb-8 transition-colors duration-300"
                    style={{
                      color: isLightMode ? '#000000' : '#E5E7EB', // Black in light, light gray in dark
                      textShadow: isLightMode ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    I unite{' '}
                    <motion.span 
                      className="relative inline-block transition-colors duration-300"
                      style={{
                        color: 'var(--aurelius-gold)',
                        fontWeight: 600
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        textShadow: '0 0 15px var(--aurelius-gold)' 
                      }}
                    >
                      creative vision
                    </motion.span>
                    {' '}with{' '}
                    <motion.span 
                      className="relative inline-block transition-colors duration-300"
                      style={{
                        color: 'var(--aurelius-gold)',
                        fontWeight: 600
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        textShadow: '0 0 15px var(--aurelius-gold)' 
                      }}
                    >
                      technical craft
                    </motion.span>
                    {' '}to turn ideas into{' '}
                    <motion.span 
                      className="relative inline-block transition-colors duration-300"
                      style={{
                        color: 'var(--aurelius-gold)',
                        fontWeight: 600
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        textShadow: '0 0 15px var(--aurelius-gold)' 
                      }}
                    >
                      engaging
                    </motion.span>
                    {', '}
                    <motion.span 
                      className="relative inline-block transition-colors duration-300"
                      style={{
                        color: 'var(--aurelius-gold)',
                        fontWeight: 600
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        textShadow: '0 0 15px var(--aurelius-gold)' 
                      }}
                    >
                      high-performing web realities
                    </motion.span>
                    {'.'}
                  </div>
                </div>

                {/* Animated accent line - Theme Aware */}
                <div
                  className="h-px max-w-xs bg-gradient-to-r from-aurelius-gold via-aurelius-gold/50 to-transparent transition-colors duration-300"
                  style={{
                    width: isVisible ? '100%' : '0%',
                    opacity: isVisible ? 1 : 0,
                    transition: 'width 2s ease-in-out 1.8s, opacity 2s ease-in-out 1.8s'
                  }}
                />
              </motion.div>

              {/* Enhanced CTA Buttons with High Contrast Light Mode Support */}
              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-start items-start"
                initial={{ y: 80, opacity: 0 }}
                animate={isVisible ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 1, duration: 1 }}
              >
                <motion.a
                  href="#portfolio"
                  className="group relative px-8 py-4 border-2 border-aurelius-gold text-aurelius-gold overflow-hidden backdrop-blur-sm transition-all duration-300"
                  style={{
                    background: 'var(--aurelius-gold)05'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 40px var(--aurelius-gold)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span className="relative z-10 text-base tracking-wider font-medium transition-colors duration-500">
                    VIEW MORE
                  </span>
                </motion.a>

                <motion.a
                  href="#contact"
                  className="group relative px-8 py-4 border-2 border-aurelius-gold text-aurelius-gold backdrop-blur-sm transition-all duration-300"
                  style={{
                    background: 'var(--aurelius-gold)05'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 40px var(--aurelius-gold)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span className="relative z-10 text-base tracking-wider font-medium transition-colors duration-500">
                    LET'S CREATE SOMETHING TOGETHER
                  </span>
                </motion.a>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gradient Transition Overlay - Seamlessly fades to About section */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-32 z-25 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 1 }}
        style={{
          background: isLightMode 
            ? 'linear-gradient(to bottom, transparent 0%, rgba(242, 180, 59, 0.3) 30%, rgba(242, 180, 59, 0.6) 60%, #f2b43b 100%)'
            : 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 30%, rgba(0, 0, 0, 0.6) 60%, #000000 100%)'
        }}
      />

      {/* Scroll Indicator - Theme Aware */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span 
            className="text-xs tracking-widest uppercase transition-colors duration-300"
            style={{
              color: isLightMode ? '#000000' : '#9CA3AF'
            }}
          >
            Scroll
          </span>
          <div 
            className="w-px h-8 transition-colors duration-300"
            style={{
              background: isLightMode ? '#000000' : 'var(--aurelius-gold)'
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
