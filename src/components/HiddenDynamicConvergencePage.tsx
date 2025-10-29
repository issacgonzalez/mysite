import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X } from 'lucide-react';
import { DynamicConvergences } from './DynamicConvergences';
import { GlobalParticleSystem, SectionParticleOverlay } from './GlobalParticleSystem';

interface HiddenDynamicConvergencePageProps {
  isVisible: boolean;
  onClose: () => void;
}

export function HiddenDynamicConvergencePage({ isVisible, onClose }: HiddenDynamicConvergencePageProps) {
  const [showContent, setShowContent] = useState(false);
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

  useEffect(() => {
    if (isVisible) {
      setShowContent(true);
      document.body.style.overflow = 'hidden';
      // Scroll to top immediately
      window.scrollTo(0, 0);
    } else {
      setShowContent(false);
      document.body.style.overflow = 'unset';
    }
  }, [isVisible]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) onClose();
    };
    
    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  const handleClose = () => {
    setShowContent(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main Content - Fixed Background Colors */}
          <motion.div
            className="fixed inset-0 z-60 overflow-y-auto"
            style={{
              backgroundColor: '#000000', // Always dark background for Dynamic Convergences
              overflow: 'visible auto',
              contain: 'layout style',
              willChange: 'transform, opacity'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Navigation Header */}
            <motion.div
              className="fixed top-0 left-0 right-0 z-70 bg-black/80 backdrop-blur-md border-b border-gray-800"
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4">
                <div className="flex items-center justify-between">
                  {/* Left side - Back Navigation */}
                  <button
                    onClick={handleClose}
                    className="flex items-center gap-3 text-gray-500 hover:text-aurelius-gold transition-colors duration-300 group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="text-sm tracking-wide">Back to Portfolio</span>
                  </button>

                  {/* Center - Page Title */}
                  <motion.div
                    className="text-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h1 className="text-white text-lg tracking-wide">
                      <span className="text-aurelius-gold animate-dynamic-title-glow">DYNAMIC</span>
                      {' '}
                      <span className="text-white animate-convergence-title-glow">CONVERGENCES</span>
                    </h1>
                  </motion.div>

                  {/* Right side - Close Button */}
                  <button
                    className="text-gray-500 hover:text-gray-400 transition-colors duration-200"
                    onClick={handleClose}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  className="pt-20"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 40, opacity: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  {/* Dynamic Convergences Section - With White Stardust */}
                  <div id="dynamic-convergences" className="relative min-h-screen">
                    <GlobalParticleSystem 
                      particleCount={200} 
                      enableMouseEffect={true}
                      isProjectsPageOpen={false}
                      isProjectPageOpen={false}
                      isLoading={false}
                    >
                      <DynamicConvergences />
                      <SectionParticleOverlay density="high" colors="white" />
                    </GlobalParticleSystem>
                  </div>

                  {/* Additional Content - Description */}
                  <motion.section
                    className="py-20 bg-gray-900"
                    initial={{ y: 60, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
                      <h2 className="text-3xl md:text-4xl text-white mb-6">
                        Experimental Interface Design
                      </h2>
                      <p className="text-lg text-gray-400 leading-relaxed mb-8">
                        This hidden section showcases experimental interface elements and interactive convergence points. 
                        It represents the intersection of creativity and functionality, where design meets innovation 
                        in digital experiences that push the boundaries of conventional web interaction.
                      </p>
                      <div className="w-24 h-0.5 bg-aurelius-gold mx-auto" />
                    </div>
                  </motion.section>

                  {/* Navigation Footer */}
                  <motion.section
                    className="py-16 bg-black border-t border-gray-800"
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center">
                      <h3 className="text-2xl text-white mb-6">
                        Return to Portfolio
                      </h3>
                      <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        Explore the complete collection of projects and digital experiences.
                      </p>
                      <motion.button
                        className="px-8 py-4 bg-aurelius-gold text-black rounded-lg hover:bg-aurelius-gold-light transition-all duration-300"
                        onClick={handleClose}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View All Projects
                      </motion.button>
                    </div>
                  </motion.section>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
