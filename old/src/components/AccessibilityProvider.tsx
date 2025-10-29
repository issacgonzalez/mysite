import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilitySettings {
  reducedMotion: boolean;
  lightMode: boolean;
  fontSize: number; // New font size setting (0.8 to 1.4)
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  toggleReducedMotion: () => void;
  toggleLightMode: () => void;
  setFontSize: (size: number) => void;
  isAccessibilityMode: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    lightMode: false,
    fontSize: 1, // Default font size
  });

  // Check for system preferences on mount
  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check for prefers-color-scheme: light
    const prefersLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    // Load saved preferences from localStorage
    const savedSettings = localStorage.getItem('aurelius-accessibility');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({
          reducedMotion: parsed.reducedMotion ?? prefersReducedMotion,
          lightMode: parsed.lightMode ?? prefersLightMode,
          fontSize: parsed.fontSize ?? 1,
        });
      } catch {
        // If parsing fails, use system preferences
        setSettings({
          reducedMotion: prefersReducedMotion,
          lightMode: prefersLightMode,
          fontSize: 1,
        });
      }
    } else {
      // Use system preferences if no saved settings
      setSettings({
        reducedMotion: prefersReducedMotion,
        lightMode: prefersLightMode,
        fontSize: 1,
      });
    }

    // Listen for system preference changes
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const colorSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('aurelius-accessibility-manual-motion')) {
        setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
      }
    };
    
    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('aurelius-accessibility-manual-color')) {
        setSettings(prev => ({ ...prev, lightMode: e.matches }));
      }
    };

    motionMediaQuery.addEventListener('change', handleMotionChange);
    colorSchemeMediaQuery.addEventListener('change', handleColorSchemeChange);

    return () => {
      motionMediaQuery.removeEventListener('change', handleMotionChange);
      colorSchemeMediaQuery.removeEventListener('change', handleColorSchemeChange);
    };
  }, []);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Apply light mode
    if (settings.lightMode) {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }

    // Apply font size
    root.style.setProperty('--font-size', `${14 * settings.fontSize}px`);
    
    // Update all font size variables proportionally
    const baseFontSize = 14 * settings.fontSize;
    root.style.setProperty('--text-xs', `${0.75 * baseFontSize}px`);
    root.style.setProperty('--text-sm', `${0.875 * baseFontSize}px`);
    root.style.setProperty('--text-base', `${baseFontSize}px`);
    root.style.setProperty('--text-lg', `${1.125 * baseFontSize}px`);
    root.style.setProperty('--text-xl', `${1.25 * baseFontSize}px`);
    root.style.setProperty('--text-2xl', `${1.5 * baseFontSize}px`);

    // Save to localStorage
    localStorage.setItem('aurelius-accessibility', JSON.stringify(settings));
  }, [settings]);

  const toggleReducedMotion = () => {
    setSettings(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }));
    localStorage.setItem('aurelius-accessibility-manual-motion', 'true');
  };

  const toggleLightMode = () => {
    setSettings(prev => ({ ...prev, lightMode: !prev.lightMode }));
    localStorage.setItem('aurelius-accessibility-manual-color', 'true');
  };

  const setFontSize = (size: number) => {
    setSettings(prev => ({ ...prev, fontSize: Math.max(0.8, Math.min(1.4, size)) }));
  };

  const isAccessibilityMode = settings.reducedMotion || settings.lightMode || settings.fontSize !== 1;

  return (
    <AccessibilityContext.Provider 
      value={{
        settings,
        toggleReducedMotion,
        toggleLightMode,
        setFontSize,
        isAccessibilityMode,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}