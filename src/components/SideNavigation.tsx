import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAccessibility } from './AccessibilityProvider';

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "portfolio", label: "Work" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" }
];

export function SideNavigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [showNavigation, setShowNavigation] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const { settings } = useAccessibility();

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

  useEffect(() => {
    // Simple scroll-based visibility and hero detection
    const handleScrollVisibility = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        const scrollPosition = window.scrollY;
        const showThreshold = Math.min(300, heroHeight * 0.2);
        setShowNavigation(scrollPosition > showThreshold);
        
        // Check if we're past the hero section for background change
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollWithOffset = scrollPosition + 100; // Add offset for transition
        setIsPastHero(scrollWithOffset > heroBottom);
      }
    };

    // COMPLETELY REWRITTEN: Much more conservative section detection (matching Header)
    const updateActiveSection = () => {
      const sectionsData = [
        { id: 'hero', element: document.getElementById('hero') },
        { id: 'about', element: document.getElementById('about') },
        { id: 'portfolio', element: document.getElementById('portfolio') },
        { id: 'resume', element: document.getElementById('resume') },
        { id: 'contact', element: document.getElementById('contact') }
      ].filter(section => section.element);

      if (sectionsData.length === 0) return;

      const scrollPosition = window.scrollY + window.innerHeight / 2; // Center of viewport
      
      console.log('🟠 Side Nav: Scroll position:', scrollPosition);
      
      // Find which section the center of viewport is in
      let newActiveSection = 'hero'; // default
      
      for (let i = 0; i < sectionsData.length; i++) {
        const section = sectionsData[i];
        const sectionTop = section.element.offsetTop;
        const sectionBottom = sectionTop + section.element.offsetHeight;
        
        console.log(`🟠 Side Nav: ${section.id} - Top: ${sectionTop}, Bottom: ${sectionBottom}`);
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          newActiveSection = section.id;
          console.log(`🟠 Side Nav: Center is in ${section.id}`);
          break;
        }
      }
      
      // Only update if changed
      if (newActiveSection !== activeSection) {
        console.log(`🟠 Side Nav: Changing from ${activeSection} to ${newActiveSection}`);
        setActiveSection(newActiveSection);
      }
    };

    // Debounced scroll handler to prevent rapid changes  
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      handleScrollVisibility();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateActiveSection, 50); // Small delay to prevent rapid changes
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [activeSection]);

  // FIXED: Scroll function that accounts for fixed header height
  const scrollToSection = (sectionId: string) => {
    console.log('🟠 Side Nav: User clicked', sectionId);
    
    const element = document.getElementById(sectionId);
    if (element) {
      // Immediately set active for visual feedback
      setActiveSection(sectionId);
      
      // Calculate header offset based on screen size
      const getHeaderOffset = () => {
        if (window.innerWidth <= 768) {
          return 80; // Mobile offset
        } else if (window.innerWidth >= 1024) {
          return 120; // Desktop offset
        }
        return 100; // Default offset
      };
      
      const headerOffset = getHeaderOffset();
      const elementPosition = element.offsetTop - headerOffset;
      
      // Use smooth scroll with calculated offset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      
      console.log(`🟠 Side Nav: Scrolled to ${sectionId} with offset ${headerOffset}px`);
    } else {
      console.error(`🟠 Side Nav: Element ${sectionId} not found`);
    }
  };

  // Don't show navigation if reduced motion is enabled
  if (settings.reducedMotion) {
    return null;
  }

  // Navigation colors - Original theme colors always
  const getActiveColor = () => {
    return isLightMode ? '#F0531C' : '#F89A1C'; // Fiery Glow in light, Orange in dark
  };

  const getInactiveColor = () => {
    return isLightMode ? '#09332C' : '#6B7280'; // Fence Green in light, Gray in dark
  };

  const getProgressTrackColor = () => {
    return isLightMode ? '#F7DFBA' : '#374151'; // Macadamia Beige in light, Dark Gray in dark
  };

  const getProgressActiveColor = () => {
    return isLightMode ? '#F0531C' : '#F89A1C'; // Fiery Glow in light, Orange in dark
  };

  const getCounterColor = () => {
    return isLightMode ? '#2E4B3C' : 'rgba(255, 255, 255, 0.4)'; // Norfolk Green in light, White opacity in dark
  };

  return (
    <AnimatePresence>
      {showNavigation && (
        <motion.div
          className="fixed right-4 xl:right-6 top-1/2 transform -translate-y-1/2 z-45 hidden lg:block"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.6 }}
          style={{
            backgroundColor: 'transparent',
            borderRadius: '0px',
            padding: '0px',
            boxShadow: 'none'
          }}
        >
          <div className="relative flex items-center">
            {/* Simple pagination counter - Rotated 90 degrees */}
            <div 
              className="text-xs mr-6 tracking-widest transition-colors duration-300"
              style={{
                color: getCounterColor(),
                transform: 'rotate(-90deg)',
                transformOrigin: 'center center',
                whiteSpace: 'nowrap'
              }}
            >
              {String(sections.findIndex(s => s.id === activeSection) + 1).padStart(2, '0')}/
              {String(sections.length).padStart(2, '0')}
            </div>

            {/* Navigation Menu */}
            <div className="relative">
              <div className="flex flex-col space-y-4">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="group flex items-center justify-end relative outline-none focus:outline-none cursor-pointer"
                      aria-label={`Navigate to ${section.label} section`}
                    >
                      {/* Section Label - NO animations during active changes */}
                      <span
                        className="mr-4 font-light tracking-wider uppercase transition-colors duration-200"
                        style={{
                          fontSize: isActive ? '0.95rem' : '0.875rem',
                          color: isActive ? getActiveColor() : getInactiveColor(),
                          fontWeight: isActive ? 600 : 300,
                          transform: isActive ? 'scale(1.05)' : 'scale(1)'
                        }}
                      >
                        {section.label}
                      </span>
                      
                      {/* Line indicator - NO animations during active changes */}
                      <div
                        className="transition-colors duration-200"
                        style={{
                          width: isActive ? '50px' : '20px',
                          height: isActive ? '3px' : '1px',
                          backgroundColor: isActive ? getActiveColor() : getInactiveColor(),
                          opacity: isActive ? 1 : 0.6
                        }}
                      />
                    </button>
                  );
                })}
              </div>
              
              {/* Progress track */}
              <div 
                className="absolute -left-6 top-0 bottom-0 w-px transition-colors duration-300"
                style={{
                  backgroundColor: getProgressTrackColor()
                }}
              >
                <div
                  className="w-full transition-all duration-300"
                  style={{
                    backgroundColor: getProgressActiveColor(),
                    height: `${((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
