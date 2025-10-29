import React, { useRef, useState, useCallback, memo } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ImageWithFallback } from './my-assets/ImageWithFallback';
import lamarHeroImage from "@/assets/1f01804b7476e2b99aa0486154dfcb2676daa967.png";
import vixenParallaxHero from "@/assets/f4988d593e5d0a5a5c6b3d3f197e085c27f519bb.png";
import arkansasStateHeroImage from "@/assets/4f4b0723283e65a70e32f4e82d1ac7afaa29ad47.png";
import texasAMInternationalHeroImage from "@/assets/14a10daf6e8aac2b19bfebf5923d40008e6ddc6f.png";
import utaHeroImage from "@/assets/6dda4674f46466ee6ae6d23a36158ef2bf86c812.png";
import artesanoHeroImage from "@/assets/5a9e341f80b08d29e35e6b75f11bb9369d6ad195.png";

// Modern Left-Strip Project Card Design
const ProjectCard = memo(({ project, index, onExploreClick }: { project: any, index: number, onExploreClick: (project: any) => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Theme detection
  const [isLightMode, setIsLightMode] = useState(false);
  
  // Hover state for ribbon
  const [isRibbonHovered, setIsRibbonHovered] = useState(false);

  React.useEffect(() => {
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
  
  // Mouse position values for tilt (desktop only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Mouse position for glow effect (0-1 normalized)
  const glowX = useMotionValue(0.5);
  const glowY = useMotionValue(0.5);
  
  // Spring configuration for smooth tilt
  const springConfig = { damping: 25, stiffness: 200, mass: 1 };
  
  // Transform position to rotation degrees
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  
  // Transform for the card with perspective
  const transform = useTransform(
    [rotateX, rotateY],
    ([x, y]) => `perspective(1400px) rotateX(${x}deg) rotateY(${y}deg) scale3d(1.01, 1.01, 1.01)`
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate tilt values (-0.5 to 0.5)
    const tiltX = (e.clientX - centerX) / (rect.width / 2);
    const tiltY = (e.clientY - centerY) / (rect.height / 2);
    
    // Calculate glow position (0 to 1)
    const glowXPos = (e.clientX - rect.left) / rect.width;
    const glowYPos = (e.clientY - rect.top) / rect.height;
    
    // Set motion values
    mouseX.set(Math.max(-0.5, Math.min(0.5, tiltX)));
    mouseY.set(Math.max(-0.5, Math.min(0.5, tiltY)));
    
    glowX.set(Math.max(0, Math.min(1, glowXPos)));
    glowY.set(Math.max(0, Math.min(1, glowYPos)));
  }, [mouseX, mouseY, glowX, glowY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    glowX.set(0.5);
    glowY.set(0.5);
  }, [mouseX, mouseY, glowX, glowY]);

  const handleRibbonMouseEnter = () => {
    setIsRibbonHovered(true);
  };

  const handleRibbonMouseLeave = () => {
    setIsRibbonHovered(false);
  };

  return (
    <motion.button
      ref={cardRef}
      className="group relative cursor-pointer w-full text-left focus:outline-none"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onExploreClick(project)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        transformStyle: 'preserve-3d',
        transform,
        position: 'relative',
        minHeight: '480px' // Increased height for better proportions
      }}
      aria-label={`Explore ${project.title} project`}
    >
      {/* Main Card Container */}
      <div className="relative w-full min-h-[480px]">
        {/* Image Section - Centered and narrower with glow on hover */}
        <div className="flex justify-center py-4">
          <motion.div 
            className="relative h-96 w-[70%] overflow-hidden rounded-lg"
            style={{
              boxShadow: useTransform(
                [glowX, glowY],
                ([x, y]) => {
                  // Calculate which edge is closest to mouse
                  const distanceToLeft = x;
                  const distanceToRight = 1 - x;
                  const distanceToTop = y;
                  const distanceToBottom = 1 - y;
                  
                  const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);
                  const edgeIntensity = Math.max(0, (0.35 - minDistance) / 0.35);
                  
                  if (edgeIntensity <= 0) return '0 4px 12px rgba(0, 0, 0, 0.1)';
                  
                  const baseGlow = 25;
                  const strongGlow = 40;
                  const glowOpacity = edgeIntensity * 0.9;
                  const strongOpacity = edgeIntensity * 0.6;
                  
                  // Use brand colors for glow - only on image
                  const aurRgb = isLightMode ? '240, 83, 28' : '248, 154, 28';
                  const baseBoxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  
                  if (distanceToLeft === minDistance) {
                    return `${baseBoxShadow}, 
                            -${baseGlow}px 0 ${baseGlow * 2}px rgba(${aurRgb}, ${glowOpacity}),
                            -${strongGlow}px 0 ${strongGlow * 3}px rgba(${aurRgb}, ${strongOpacity}),
                            -${strongGlow * 1.5}px 0 ${strongGlow * 4}px rgba(${aurRgb}, ${strongOpacity * 0.4})`;
                  } else if (distanceToRight === minDistance) {
                    return `${baseBoxShadow}, 
                            ${baseGlow}px 0 ${baseGlow * 2}px rgba(${aurRgb}, ${glowOpacity}),
                            ${strongGlow}px 0 ${strongGlow * 3}px rgba(${aurRgb}, ${strongOpacity}),
                            ${strongGlow * 1.5}px 0 ${strongGlow * 4}px rgba(${aurRgb}, ${strongOpacity * 0.4})`;
                  } else if (distanceToTop === minDistance) {
                    return `${baseBoxShadow}, 
                            0 -${baseGlow}px ${baseGlow * 2}px rgba(${aurRgb}, ${glowOpacity}),
                            0 -${strongGlow}px ${strongGlow * 3}px rgba(${aurRgb}, ${strongOpacity}),
                            0 -${strongGlow * 1.5}px ${strongGlow * 4}px rgba(${aurRgb}, ${strongOpacity * 0.4})`;
                  } else {
                    return `${baseBoxShadow}, 
                            0 ${baseGlow}px ${baseGlow * 2}px rgba(${aurRgb}, ${glowOpacity}),
                            0 ${strongGlow}px ${strongGlow * 3}px rgba(${aurRgb}, ${strongOpacity}),
                            0 ${strongGlow * 1.5}px ${strongGlow * 4}px rgba(${aurRgb}, ${strongOpacity * 0.4})`;
                  }
                }
              )
            }}
          >
            <ImageWithFallback
              src={project.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGV8ZW58MXx8fHwxNzU1MjIyNDM5fDA&ixlib=rb-4.0.3&q=80&w=1080'}
              alt={project.title}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              style={
                project.title.toLowerCase().includes('lamar') 
                  ? { 
                      objectPosition: '75% 25%',
                      filter: 'brightness(1.3) contrast(1.2) saturate(1.1)'
                    }
                  : project.title.toLowerCase().includes('arkansas')
                    ? {
                        objectPosition: '60% 30%',
                        filter: 'brightness(1.25) contrast(1.25) saturate(1.1)'
                      }
                    : project.title.toLowerCase().includes('texas a&m')
                      ? {
                          objectPosition: '15% 35%',
                          filter: 'brightness(1.3) contrast(1.3) saturate(1.1)'
                        }
                      : project.title.toLowerCase().includes('uta')
                        ? {
                            objectPosition: 'center 40%',
                            filter: 'brightness(1.25) contrast(1.2) saturate(1.1)'
                          }
                        : project.title.toLowerCase().includes('pizza')
                          ? {
                              objectPosition: 'center center',
                              filter: 'brightness(1.2) contrast(1.2) saturate(1.1)'
                            }
                          : project.title.toLowerCase().includes('exodus')
                            ? {
                                objectPosition: 'center center',
                                filter: 'brightness(1.25) contrast(1.25) saturate(1.1)'
                              }
                            : project.title.toLowerCase().includes('vixen')
                              ? {
                                  objectPosition: 'center center',
                                  filter: 'brightness(1.2) contrast(1.2) saturate(1.1)'
                                }
                              : {
                                  objectPosition: 'center center',
                                  filter: 'brightness(1.25) contrast(1.2) saturate(1.1)'
                                }
              }
            />
            
            {/* Hover Border Highlight - Only on image */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
              style={{
                border: useTransform(
                  [glowX, glowY],
                  ([x, y]) => {
                    const distanceToLeft = x;
                    const distanceToRight = 1 - x;
                    const distanceToTop = y;
                    const distanceToBottom = 1 - y;
                    
                    const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);
                    const edgeIntensity = Math.max(0, (0.3 - minDistance) / 0.3);
                    
                    if (edgeIntensity <= 0) return 'none';
                    
                    const borderOpacity = edgeIntensity * 0.8;
                    const aurRgb = isLightMode ? '240, 83, 28' : '248, 154, 28';
                    return `2px solid rgba(${aurRgb}, ${borderOpacity})`;
                  }
                )
              }}
            />
          </motion.div>
        </div>

        {/* PROJECT RIBBON - Fixed positioning with hover state management */}
        <div 
          className="project-ribbon"
          style={{
            position: 'absolute',
            left: '40px',
            top: '190px',
            width: '280px',
            height: '70px',
            backgroundColor: isLightMode ? '#f2b43b' : '#F89A1C',
            zIndex: 2000,
            boxShadow: `
              0 4px 12px rgba(0, 0, 0, 0.2),
              0 2px 6px rgba(0, 0, 0, 0.15),
              0 8px 24px rgba(${isLightMode ? '242, 180, 59' : '248, 154, 28'}, 0.3)
            `,
            borderRadius: '0 4px 4px 0',
            overflow: 'hidden',
            pointerEvents: 'auto',
            cursor: 'pointer'
          }}
          onMouseEnter={handleRibbonMouseEnter}
          onMouseLeave={handleRibbonMouseLeave}
        >
          {/* Default Content - Project Info */}
          <div 
            className="ribbon-default-content"
            style={{
              position: 'absolute',
              inset: '0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingLeft: '20px',
              paddingRight: '20px',
              opacity: isRibbonHovered ? '0' : '1',
              transition: 'opacity 300ms ease-in-out'
            }}
          >
            {/* Category Text */}
            <div style={{ marginBottom: '6px' }}>
              <span 
                style={{ 
                  fontSize: '11px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.08em',
                  color: '#000000',
                  fontWeight: '600',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {project.category}
              </span>
            </div>

            {/* Project Title */}
            <div>
              <h3 
                style={{ 
                  fontSize: '16px', 
                  lineHeight: '1.2',
                  color: '#000000',
                  fontWeight: '700',
                  margin: '0',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {project.title}
              </h3>
            </div>
          </div>

          {/* Hover Content - View Project */}
          <div 
            className="ribbon-hover-content"
            style={{
              position: 'absolute',
              inset: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              opacity: isRibbonHovered ? '1' : '0',
              transition: 'opacity 300ms ease-in-out',
              backgroundColor: 'rgba(0, 0, 0, 0.1)'
            }}
          >
            <span 
              style={{ 
                fontSize: '16px',
                color: '#000000',
                fontWeight: '700',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              View Project
            </span>
            <motion.div
              animate={{ 
                x: [0, 4, 0],
                rotate: [0, 3, -3, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <svg 
                width="20" 
                height="20"
                fill="none" 
                stroke="#000000"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                style={{ display: 'block' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.button>
  );
});

ProjectCard.displayName = 'ProjectCard';

export function PortfolioSection({ onProjectSelect, onViewAllProjects }: { onProjectSelect: (project: any) => void; onViewAllProjects: () => void }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Theme detection
  const [isLightMode, setIsLightMode] = useState(false);

  React.useEffect(() => {
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

  const handleExploreClick = (project: any) => {
    onProjectSelect(project);
  };

  // Category order for sorting
  const categoryOrder = {
    "Fitness & Wellness": 1,
    "Education": 2,
    "Local Business": 3
  };

  // Enhanced project portfolio with images - sorted by category then alphabetically
  const projects = [
    {
      id: 2,
      title: 'Vixen Workout',
      category: 'Fitness & Wellness',
      description: 'Innovative fitness platform featuring immersive workout experiences, community engagement, and cutting-edge design that empowers users to feel bigger than life.',
      tech: ['React', 'Node.js', 'WebGL', 'Motion Design'],
      image: vixenParallaxHero
    },
    {
      id: 3,
      title: 'Arkansas State University',
      category: 'Education',
      description: 'Complete university website redesign focusing on enhanced user experience and modern academic program presentation with conversion optimization.',
      tech: ['WordPress', 'A/B Testing', 'JavaScript', 'Responsive Design'],
      image: arkansasStateHeroImage
    },
    {
      id: 1,
      title: 'Lamar University',
      category: 'Education',
      description: 'Built and maintained comprehensive university degree program pages with advanced information architecture and optimized user experience design.',
      tech: ['WordPress', 'PHP', 'JavaScript', 'CSS'],
      image: lamarHeroImage
    },
    {
      id: 4,
      title: 'Texas A&M International',
      category: 'Education',
      description: 'Modern university website development with focus on online education programs and student engagement through interactive design elements.',
      tech: ['WordPress', 'C#', 'JavaScript', 'User Experience'],
      image: texasAMInternationalHeroImage
    },
    {
      id: 8,
      title: 'UTA',
      category: 'Education',
      description: 'Comprehensive academic partnerships platform for University of Texas at Arlington, connecting prospective students with online programs through strategic partner networks.',
      tech: ['WordPress', 'PHP', 'JavaScript', 'CSS'],
      image: utaHeroImage
    },
    {
      id: 7,
      title: 'Artesano',
      category: 'Local Business',
      description: 'Sophisticated artisan marketplace showcasing handcrafted goods with integrated e-commerce functionality, artist portfolio management, and immersive product galleries.',
      tech: ['Shopify', 'Liquid', 'JavaScript', 'CSS'],
      image: artesanoHeroImage
    }
  ];

  return (
    <section 
      id="portfolio"
      ref={sectionRef}
      className={`min-h-screen py-24 relative transition-colors duration-300 ${
        isLightMode ? 'bg-venetian-lace' : 'bg-black'
      }`}
      style={{ perspective: '2000px', overflow: 'visible' }}
    >
      {/* Background pattern */}
      <div className={`absolute inset-0 pointer-events-none ${
        isLightMode ? 'opacity-3' : 'opacity-5'
      }`}>
        <div 
          className="absolute inset-0 bg-[size:100px_100px]"
          style={{
            backgroundImage: `
              linear-gradient(90deg,transparent 49px, ${isLightMode ? 'var(--fiery-glow)' : 'var(--aurelius-gold)'}10 50px, ${isLightMode ? 'var(--fiery-glow)' : 'var(--aurelius-gold)'}10 51px,transparent 52px),
              linear-gradient(${isLightMode ? 'var(--fiery-glow)' : 'var(--aurelius-gold)'}10 50px,transparent 51px)
            `
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <h2 className={`text-5xl md:text-6xl mb-2 transition-colors duration-300 ${
                isLightMode ? 'text-fence-green' : 'text-white'
              }`}>
                SELECTED
              </h2>
              <h2 className={`text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r mb-6 ${
                isLightMode 
                  ? 'from-fiery-glow to-pumpkin-vapor'
                  : 'from-aurelius-gold to-aurelius-gold-light'
              }`}>
                WORK
              </h2>
            </div>
            <motion.div 
              className={`w-24 h-1 mx-auto transition-colors duration-300 ${
                isLightMode ? 'bg-fiery-glow' : 'bg-aurelius-gold'
              }`}
              initial={{ width: 0 }}
              animate={isInView ? { width: '6rem' } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>

          {/* Projects grid - 2 columns layout with very tight spacing */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 max-w-6xl mx-auto"
            style={{ overflow: 'visible' }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {projects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index}
                onExploreClick={handleExploreClick}
              />
            ))}
          </motion.div>

          {/* Call to action */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              className={`inline-flex items-center text-lg px-6 py-3 border rounded-lg backdrop-blur-sm relative overflow-hidden transition-all duration-300 ${
                isLightMode
                  ? 'border-fiery-glow text-fiery-glow hover:bg-fiery-glow/10'
                  : 'border-aurelius-gold text-aurelius-gold hover:bg-aurelius-gold/10'
              }`}
              whileHover={{ 
                scale: 1.05,
                borderColor: isLightMode ? 'var(--fiery-glow)' : 'var(--aurelius-gold)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewAllProjects}
            >
              <span className="relative z-10">View All Projects</span>
              <svg className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
      
      {/* Additional floating pixels for Portfolio section */}
      <div className="absolute inset-0 pointer-events-none z-1">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={`portfolio-pixel-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              backgroundColor: isLightMode 
                ? 'rgba(0, 0, 0, 0.8)' 
                : 'rgba(248, 154, 28, 0.7)',
              imageRendering: 'pixelated',
              boxShadow: isLightMode 
                ? '0 0 10px rgba(0, 0, 0, 0.5)'
                : '0 0 12px rgba(248, 154, 28, 0.6)',
            }}
            animate={{
              y: [0, -70, 0],
              x: [0, Math.cos(i) * 35, 0],
              opacity: [0.4, 0.9, 0.4],
              scale: [1, 2, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 7 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    </section>
  );
}
