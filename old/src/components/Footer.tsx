import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BullLogo } from './BullLogo';

interface FooterProps {
  onHiddenPageOpen?: () => void;
}

export function Footer({ onHiddenPageOpen }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [clickCount, setClickCount] = useState(0);

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

  // Hidden easter egg - 3 clicks on logo opens Dynamic Convergence page
  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount === 2) {
      // Third click triggers hidden page
      if (onHiddenPageOpen) {
        onHiddenPageOpen();
      }
      setClickCount(0);
    } else {
      // Reset count after 3 seconds if not completed
      setTimeout(() => setClickCount(0), 3000);
    }
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/gonzalezissac/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Email',
      href: 'mailto:issacngonzalez@gmail.com',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <footer 
      className="border-t relative overflow-hidden"
      style={{
        backgroundColor: isLightMode ? '#F7EDDA' : '#000000',
        borderColor: isLightMode ? 'rgba(247, 223, 186, 0.3)' : 'rgba(156, 163, 175, 0.3)'
      }}
    >
      {/* Background pattern - Dark mode only */}
      {!isLightMode && (
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49px,rgba(248,154,28,0.1)_50px,rgba(248,154,28,0.1)_51px,transparent_52px),linear-gradient(rgba(248,154,28,0.1)_50px,transparent_51px)] bg-[size:100px_100px]" />
        </div>
      )}

      <div className="section-container relative z-10">
        <div className="py-12">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            
            {/* Brand section with enhanced logo matching header */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div 
                className="flex items-center gap-1 group cursor-pointer"
                onClick={handleLogoClick}
              >
                <motion.div
                  className="relative"
                  whileHover={{
                    rotate: [0, -3, 3, 0],
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.6 }}
                  onHoverStart={() => setIsLogoHovered(true)}
                  onHoverEnd={() => setIsLogoHovered(false)}
                >
                  {/* Enhanced Glow Layers - HOVER ONLY - Dark mode only */}
                  {!isLightMode && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                        style={{
                          transform: "scale(2.5)",
                          background:
                            "radial-gradient(circle, rgba(248, 154, 28, 0.2) 0%, rgba(245, 158, 11, 0.1) 40%, transparent 70%)",
                          filter: "blur(4px)",
                        }}
                      />

                      <motion.div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                        style={{
                          transform: "scale(1.8)",
                          background:
                            "radial-gradient(circle, rgba(248, 154, 28, 0.3) 0%, rgba(245, 158, 11, 0.15) 30%, transparent 60%)",
                          filter: "blur(2px)",
                        }}
                      />
                    </>
                  )}

                  {/* Bull Logo with Conditional Glow - No glow in light mode */}
                  <motion.div
                    className="w-[85px] h-[85px] relative z-10 transition-all duration-500 group-hover:scale-105"
                    style={{
                      filter: isLightMode
                        ? "none"
                        : "drop-shadow(0 0 2px rgba(248, 154, 28, 0.15))",
                    }}
                    whileHover={{
                      filter: isLightMode
                        ? "none"
                        : "drop-shadow(0 0 8px rgba(248, 154, 28, 0.4)) drop-shadow(0 0 12px rgba(245, 158, 11, 0.2))",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <BullLogo
                      className="w-full h-full"
                      width="85"
                      height="85"
                    />
                  </motion.div>

                  {/* Orbiting Glow Particles - HOVER ONLY - Animation only on hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={isLogoHovered ? { rotate: 360 } : {}}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div
                      className={`absolute top-0 left-1/2 w-2 h-2 transform -translate-x-1/2 -translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        isLightMode
                          ? "bg-fiery-glow"
                          : "bg-aurelius-gold"
                      }`}
                      style={{
                        boxShadow: isLightMode
                          ? "none"
                          : "0 0 4px rgba(248, 154, 28, 0.8)",
                        imageRendering: "pixelated",
                      }}
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-1 h-1 transform translate-x-2 translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        isLightMode
                          ? "bg-pumpkin-vapor"
                          : "bg-aurelius-amber"
                      }`}
                      style={{
                        boxShadow: isLightMode
                          ? "none"
                          : "0 0 3px rgba(245, 158, 11, 0.8)",
                        imageRendering: "pixelated",
                      }}
                    />
                  </motion.div>

                  {/* Pulse Ring Effect - HOVER ONLY - Dark mode only */}
                  {!isLightMode && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                      animate={
                        isLogoHovered
                          ? {
                              scale: [1, 1.8, 1],
                              opacity: [0, 0.15, 0],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    >
                      <div
                        className="w-full h-full rounded-full border border-aurelius-gold/40"
                        style={{
                          boxShadow:
                            "inset 0 0 10px rgba(248, 154, 28, 0.25), 0 0 10px rgba(248, 154, 28, 0.25)",
                        }}
                      />
                    </motion.div>
                  )}
                </motion.div>
                
                <div className="flex flex-col items-start -ml-[20px]">
                  <span
                    className="text-lg leading-tight transition-colors duration-300"
                    style={{
                      color: isLightMode ? "#09332C" : "#ffffff",
                      letterSpacing: "0.1em"
                    }}
                  >
                    ISSAC GONZALEZ
                  </span>
                  <span
                    className="text-xs uppercase transition-colors duration-300"
                    style={{
                      color: isLightMode ? "#2E4B3C" : "#9CA3AF",
                      letterSpacing: "0.1em"
                    }}
                  >
                    WEB DEVELOPER
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick links */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 
                className="tracking-wider mb-4"
                style={{ color: isLightMode ? '#09332C' : '#ffffff' }}
              >
                Navigation
              </h3>
              <ul className="space-y-2">
                {['Home', 'About', 'Work', 'Resume', 'Contact'].map((item, index) => (
                  <li key={item}>
                    <motion.button
                      className="transition-colors text-sm"
                      style={{
                        color: isLightMode ? '#2E4B3C' : '#9CA3AF'
                      }}
                      whileHover={{ 
                        x: 4,
                        color: isLightMode ? '#F0531C' : '#F89A1C'
                      }}
                      onClick={() => {
                        const sectionId = item.toLowerCase() === 'home' ? 'hero' : 
                                         item.toLowerCase() === 'work' ? 'portfolio' : item.toLowerCase();
                        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {item}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Connect section */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 
                className="tracking-wider mb-4"
                style={{ color: isLightMode ? '#09332C' : '#ffffff' }}
              >
                Connect
              </h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="transition-colors p-2 border rounded-lg backdrop-blur-sm"
                    style={{
                      color: isLightMode ? '#2E4B3C' : '#9CA3AF',
                      borderColor: isLightMode ? '#F7DFBA' : '#374151'
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      y: -2,
                      color: isLightMode ? '#F0531C' : '#F89A1C',
                      borderColor: isLightMode ? '#F0531C' : '#F89A1C',
                      boxShadow: isLightMode 
                        ? '0 4px 20px rgba(240, 83, 28, 0.2)'
                        : '0 4px 20px rgba(248, 154, 28, 0.2)'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="sr-only">{social.name}</span>
                    {social.icon}
                  </motion.a>
                ))}
              </div>
              
              <div className="pt-4">
                <p 
                  className="text-xs mb-2"
                  style={{ color: isLightMode ? '#2E4B3C' : '#6B7280' }}
                >
                  Ready to collaborate?
                </p>
                <motion.a
                  href="mailto:issacngonzalez@gmail.com"
                  className="transition-colors text-sm"
                  style={{ color: isLightMode ? '#F0531C' : '#F89A1C' }}
                  whileHover={{ 
                    scale: 1.05,
                    color: isLightMode ? '#FFA74F' : '#FBB454'
                  }}
                >
                  issacngonzalez@gmail.com
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Bottom bar */}
          <motion.div
            className="pt-8 border-t border-gray-800/30 flex flex-col md:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div 
              className="flex items-center gap-6 text-sm"
              style={{ color: isLightMode ? '#2E4B3C' : '#6B7280' }}
            >
              <span>© {currentYear} Issac Gonzalez. All rights reserved.</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subtle glow effect - Dark mode only */}
      {!isLightMode && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-aurelius-gold/20 to-transparent" />
      )}
    </footer>
  );
}