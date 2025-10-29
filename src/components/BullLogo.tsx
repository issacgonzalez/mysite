import { useEffect, useState } from 'react';

interface BullLogoProps {
  className?: string;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
  color?: string; // New prop for custom color
}

export const BullLogo = ({ className = "", width = "85", height = "85", style = {}, color }: BullLogoProps) => {
  // Theme detection
  const [isLightMode, setIsLightMode] = useState(false);
  const [isInHeroSection, setIsInHeroSection] = useState(true);

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
    const checkSection = () => {
      const heroElement = document.getElementById('hero');
      if (!heroElement) {
        setIsInHeroSection(false);
        return;
      }

      const scrollY = window.scrollY || 0;
      const heroTop = heroElement.offsetTop;
      const heroBottom = heroTop + heroElement.offsetHeight;
      
      // Consider in hero section if we're within the hero bounds
      setIsInHeroSection(scrollY >= heroTop - 100 && scrollY < heroBottom - 100);
    };

    // Check initially
    checkSection();

    // Listen for scroll events
    const handleScroll = () => {
      checkSection();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also check when the page loads
    setTimeout(checkSection, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Use custom color if provided, otherwise use theme and section-based colors
  const logoColor = color || (() => {
    if (isLightMode) {
      // Light mode: white in hero, green everywhere else
      return isInHeroSection ? '#ffffff' : '#09332C';
    } else {
      // Dark mode: always orange
      return '#f89a1c';
    }
  })();

  return (
    <svg 
      id="bull-logo" 
      xmlns="http://www.w3.org/2000/svg" 
      version="1.1" 
      viewBox="0 0 595.28 841.89"
      width={width}
      height={height}
      className={`logo-fixed-size ${className}`}
      style={{ 
        transform: 'translateY(5px)',
        ...style 
      }}
    >
      <defs>
        <style>
          {`
            .bull-logo-path {
              fill: ${logoColor};
              transition: fill 0.3s ease-in-out;
            }
          `}
        </style>
      </defs>
      <path 
        className="bull-logo-path" 
        d="M359.82,226.03l8.78,4.15c8.98,4.75,20.8,14.27,24.5,23.94,4.61,12.07-.79,23.92-14.24,25.04-23.46,1.96-49.6-1.35-73.38,0-33.39,1.88-50.21,34.6-51.94,64.69-2.17,37.7,20.49,74.87,51.58,94.67,2.2,1.4,16.17,9.69,17.55,8.82,9.2-19.14,19.69-37.75,28.62-57.01,4.67-10.07,11.18-23.85,8.89-35.1l-11.49-16.26c-7.03-.19-14.07-.02-21.11-.06l-26.55-.02h0v29.87l.71.71h23.75l-15.52,32.92c-.65.15-.77-.09-1.18-.46-1.29-1.13-3.7-4.39-4.9-5.91-15.59-19.63-23.08-47.28-12.94-71.21,1.37-3.24,6.32-12.59,9.89-13.16,26.02-1.1,53.1,1.35,79,0,19.18-1.01,36.99-10.42,40.11-30.9,4.96-32.51-31.9-53.88-60.12-54.71h-.01Z"
      />
      <path 
        className="bull-logo-path" 
        d="M222.02,279.17c-1.62,3.64-3.96,6.92-5.72,10.5-3.39,6.85-6.09,14.12-8.14,21.49l-19.31.48-7.5-.49c-33.25-2.65-46.02-37.97-24.47-63.02,10.99-12.76,30.25-21.04,47.02-21.65.52-.02,2.58,0,2.58,0-15.39,4.57-39.98,23.55-34.06,41.86,1.5,4.62,8.21,10.83,13.15,10.83h36.45Z"
      />
      <path 
        className="bull-logo-path" 
        d="M271.03,417.42c-12.8-14.93-21.61-32.95-24.82-52.35-2.11-12.81-1.88-26,1.05-39.26,3.64-16.47,13.27-33.53,27-43.54,0,0,.03-.02.05-.03,1.82-1.31,1.38-4.15-.79-4.74-15.5-4.23-32.12-3.91-41.51,4.45-6.32,5.63-12.28,11.65-16.38,24.53,0,.05-.03.1-.05.16-3.11,12.02-5.03,13.56-5.03,45.98,0,25.67,9.97,46.18,14.51,57.31,2.85,6.97,10.11,23.76,23.61,42.51,8.67,12.03,13.17,18.05,20.25,20.86,15.21,6.02,34.57.1,47.35-15.43,1.11-1.35.62-3.38-.97-4.1-15.22-6.86-31.75-21.75-44.26-36.33h0v-.02Z"
      />
      <path 
        className="bull-logo-path" 
        d="M375.57,321.49c4.15.4,8.68,2.66,12.83,3.63,9.18,2.13,18.26,2.5,26.9-1.74-3.45,19.42-25.85,33.22-44.52,25-10.82-4.76-17.09-16.08-20.37-26.89,8.09.56,17.19-.76,25.16,0Z"
      />
      <path 
        className="bull-logo-path" 
        d="M205.56,321.49l-1.85,20.96c-19.29,17.45-47.42,4.67-52.7-19.08,9.3,4.49,19.5,3.98,29.26,1.27,1.73-.48,7.74-3.16,8.6-3.16h16.69Z"
      />
    </svg>
  );
};
