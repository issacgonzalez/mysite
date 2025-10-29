import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ImageWithFallback } from './my-assets/ImageWithFallback';
import { Project } from './data/projectsData';

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect: (project: Project) => void;
}

export const ProjectCard = memo(({ project, index, onSelect }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Theme detection
  const [isLightMode, setIsLightMode] = useState(false);
  
  // Hover state for ribbon
  const [isRibbonHovered, setIsRibbonHovered] = useState(false);

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
  
  // Mouse position values for tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Glow position for edge lighting
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
      onClick={() => onSelect(project)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        transformStyle: 'preserve-3d',
        transform,
        position: 'relative',
        minHeight: '480px', // Match PortfolioSection proportions
        minHeight: '480px' // Increased height for better proportions
      }}
      aria-label={`Explore ${project.title} project`}
    >
      {/* Main Card Container - Ensure height for ribbon positioning */}
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
              src={project.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fHwxNzU1MjIyNDM5fDA&ixlib=rb-4.0.3&q=80&w=1080'}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
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
                          : project.title.toLowerCase().includes('artesano')
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