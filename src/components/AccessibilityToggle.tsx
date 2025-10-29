import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccessibility } from './AccessibilityProvider';

export function AccessibilityToggle() {
  const { settings, toggleReducedMotion, toggleLightMode, setFontSize, isAccessibilityMode } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(parseFloat(e.target.value));
  };

  return (
    <div className="relative">
      {/* Flat Accessibility Toggle Button */}
      <motion.button
          className={`relative p-2.5 rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-aurelius-gold focus:ring-offset-2 focus:ring-offset-black light:focus:ring-offset-white group ${
            isAccessibilityMode 
              ? 'border-aurelius-gold text-aurelius-gold' 
              : 'border-gray-700 light:border-gray-300 text-gray-500 light:text-gray-600 hover:border-aurelius-gold hover:text-aurelius-gold'
          }`}
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Accessibility Menu - Configure accessibility settings"
          aria-expanded={isOpen}
          title="Accessibility Menu"
        >
          {/* Accessibility Icon */}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" 
            />
          </svg>

          {/* Active Indicator */}
          {isAccessibilityMode && (
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-aurelius-gold rounded-full" />
          )}
        </motion.button>

      {/* Flat Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Content - Flat Design */}
            <motion.div
              className="absolute top-full right-0 mt-2 w-72 border border-gray-700 light:border-gray-300 rounded-lg z-50 bg-black light:bg-white"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              onMouseLeave={() => setIsOpen(false)}
            >
              <div className="p-4">
                <h3 className="text-aurelius-gold mb-4 flex items-center gap-2 text-sm font-medium">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Accessibility Settings</span>
                </h3>

                <div className="space-y-4">
                  {/* Reduced Motion Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white light:text-black text-sm font-medium block">Reduce Motion</label>
                      <p className="text-gray-400 light:text-gray-600 text-xs mt-0.5">Minimizes animations</p>
                    </div>
                    <motion.button
                      className={`relative w-9 h-5 rounded-full border transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-aurelius-gold ${
                        settings.reducedMotion ? 'bg-aurelius-gold border-aurelius-gold' : 'border-gray-600 light:border-gray-400'
                      }`}
                      onClick={toggleReducedMotion}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Toggle reduced motion"
                    >
                      <motion.div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm ${
                          settings.reducedMotion ? 'right-0.5' : 'left-0.5'
                        }`}
                        layout
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>

                  {/* Light Mode Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white light:text-black text-sm font-medium block">Light Mode</label>
                      <p className="text-gray-400 light:text-gray-600 text-xs mt-0.5">Switch to bright theme</p>
                    </div>
                    <motion.button
                      className={`relative w-9 h-5 rounded-full border transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-aurelius-gold ${
                        settings.lightMode ? 'bg-aurelius-gold border-aurelius-gold' : 'border-gray-600 light:border-gray-400'
                      }`}
                      onClick={toggleLightMode}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Toggle light mode"
                    >
                      <motion.div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm ${
                          settings.lightMode ? 'right-0.5' : 'left-0.5'
                        }`}
                        layout
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>

                  {/* Text Size Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white light:text-black text-sm font-medium">Text Size</label>
                      <span className="text-aurelius-gold text-xs">{Math.round(settings.fontSize * 100)}%</span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="0.8"
                        max="1.4"
                        step="0.1"
                        value={settings.fontSize}
                        onChange={handleFontSizeChange}
                        className="w-full h-2 bg-gray-700 light:bg-gray-300 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-1 focus:ring-aurelius-gold"
                        aria-label="Adjust text size"
                      />
                      <div className="flex justify-between text-xs text-gray-500 light:text-gray-400 mt-1 px-1">
                        <span>A</span>
                        <span className="text-sm">A</span>
                        <span className="text-base">A</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Info - Flat */}
                <div className="mt-4 pt-3 border-t border-gray-700 light:border-gray-300">
                  <div className="flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 text-gray-500 light:text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-400 light:text-gray-600 text-xs leading-relaxed">
                      Settings sync with system preferences and are saved locally.
                    </p>
                  </div>
                </div>
              </div>

              {/* Custom Slider Styles - Fixed to use global CSS instead of jsx */}
              <style dangerouslySetInnerHTML={{
                __html: `
                  .slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    background: var(--aurelius-gold);
                    cursor: pointer;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                  }
                  
                  .slider::-moz-range-thumb {
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    background: var(--aurelius-gold);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                  }
                `
              }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
