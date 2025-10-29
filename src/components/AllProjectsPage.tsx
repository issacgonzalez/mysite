import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { ProjectLoadingSkeleton } from './ProjectLoadingSkeleton';
import { MetaTags } from './MetaTags';

import { allProjects, Project } from './data/projectsData';

interface AllProjectsPageProps {
  isVisible: boolean;
  onClose: () => void;
  onProjectSelect: (project: Project) => void;
  sourceSection?: string;
  onViewAllProjects?: () => void;
}

export function AllProjectsPage({ 
  isVisible, 
  onClose, 
  onProjectSelect, 
  sourceSection = 'Portfolio', 
  onViewAllProjects 
}: AllProjectsPageProps) {
  const [showContent, setShowContent] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLightMode, setIsLightMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Theme detection with memoization
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

  // Memoized filtered projects
  const filteredProjects = useMemo(() => 
    activeCategory === 'All' 
      ? allProjects 
      : allProjects.filter(project => project.category === activeCategory),
    [activeCategory]
  );

  // Memoized categories in specific order
  const categories = useMemo(() => {
    const categoryOrder = ['Fitness & Wellness', 'Education', 'Local Business'];
    const uniqueCategories = Array.from(new Set(allProjects.map(p => p.category)));
    const sortedCategories = uniqueCategories.sort((a, b) => {
      return categoryOrder.indexOf(a) - categoryOrder.indexOf(b);
    });
    return ['All', ...sortedCategories];
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

  // Optimized handlers with useCallback
  const handleClose = useCallback(() => {
    setShowContent(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  const handleContactRedirect = useCallback(() => {
    handleClose();
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }, [handleClose]);

  const handlePortfolioRedirect = useCallback(() => {
    handleClose();
    setTimeout(() => {
      document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }, [handleClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main Content - Fixed Background Colors */}
          <motion.div
            className="fixed inset-0 z-60 overflow-y-auto projects-page-optimized"
            style={{
              backgroundColor: isLightMode ? '#F7EDDA' : '#000000', // Fixed colors that don't change during scroll
              overflow: 'visible auto', // Allow horizontal overflow for ribbons
              contain: 'layout style', // CSS containment for performance
              willChange: 'transform, opacity' // Performance hint
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
          {/* Main Content */}
          <AnimatePresence>
            {showContent && (
              <motion.main
                className="pt-32 pb-12 md:pt-36 lg:pt-40"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                style={{ overflow: 'visible' }}
              >
                {/* Navigation - Sticky Below Header - Full Width */}
                <motion.div
                  className="sticky z-50 py-6 px-6 sm:px-8 border-b border-gray-800 light:border-macadamia-beige mb-16"
                  style={{ 
                    top: '125px',
                    backgroundColor: 'var(--app-container-bg)'
                  }}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <div className="flex items-center gap-6">
                    <button
                      onClick={handleClose}
                      className={`flex items-center gap-3 transition-colors duration-300 group ${
                        isLightMode
                          ? 'text-norfolk-green hover:text-fiery-glow'
                          : 'text-gray-500 hover:text-aurelius-gold'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                      <span className="text-sm tracking-wide">Back to {sourceSection}</span>
                    </button>
                    
                    <div className={`w-px h-6 ${
                      isLightMode ? 'bg-macadamia-beige' : 'bg-gray-700'
                    }`} />
                    
                    <motion.button
                      className={`transition-colors text-sm tracking-wide ${
                        isLightMode
                          ? 'text-norfolk-green hover:text-fiery-glow'
                          : 'text-gray-400 hover:text-aurelius-gold'
                      }`}
                      onClick={() => {
                        handleClose();
                        setTimeout(() => {
                          document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                        }, 500);
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      Portfolio Overview
                    </motion.button>
                  </div>
                </motion.div>

                <div className="max-w-6xl mx-auto px-6 sm:px-8" style={{ overflow: 'visible' }}>

                  {/* Page Header */}
                  <motion.div
                    className="text-center mb-16"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <div className="mb-8">
                      <h2 className={`text-4xl md:text-6xl mb-2 tracking-tight ${
                        isLightMode ? 'text-fence-green' : 'text-white'
                      }`}>
                        MY
                      </h2>
                      <h2 className={`text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r -mt-4 mb-8 ${
                        isLightMode 
                          ? 'from-fiery-glow to-pumpkin-vapor'
                          : 'from-aurelius-gold to-aurelius-gold-light'
                      }`}>
                        PROJECTS
                      </h2>
                    </div>
                    <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${
                      isLightMode ? 'text-norfolk-green' : 'text-gray-400'
                    }`}>
                      A comprehensive showcase of innovative digital solutions spanning university platforms, 
                      business applications, and creative digital experiences.
                    </p>
                    <div className={`w-24 h-0.5 mx-auto mt-8 ${
                      isLightMode ? 'bg-fiery-glow' : 'bg-aurelius-gold'
                    }`} />
                  </motion.div>

                  {/* Filter Categories */}
                  <motion.div
                    className="flex justify-center mb-12"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <div className="flex gap-4 flex-wrap justify-center">
                      {categories.map((category) => (
                        <motion.button
                          key={category}
                          className={`px-6 py-3 text-sm tracking-wider transition-all duration-200 border rounded-lg backdrop-blur-sm relative overflow-hidden ${
                            activeCategory === category
                              ? isLightMode
                                ? 'text-fiery-glow border-fiery-glow/60 bg-fiery-glow/10'
                                : 'text-aurelius-gold border-aurelius-gold/60 bg-aurelius-gold/10'
                              : isLightMode
                                ? 'text-norfolk-green border-macadamia-beige hover:text-fiery-glow hover:border-fiery-glow/30 hover:bg-fiery-glow/5'
                                : 'text-gray-400 border-gray-700 hover:text-aurelius-gold hover:border-aurelius-gold/30 hover:bg-aurelius-gold/5'
                          }`}
                          onClick={() => setActiveCategory(category)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="relative z-10">{category}</span>
                          {activeCategory === category && (
                            <motion.div
                              layoutId="activeCategory"
                              className={`absolute inset-0 scale-x-0 transition-transform duration-300 origin-left ${
                                isLightMode ? 'bg-fiery-glow/10' : 'bg-aurelius-gold/10'
                              }`}
                              animate={{ scaleX: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Projects Grid - Allow overflow for ribbons */}
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    style={{ perspective: '2000px', overflow: 'visible' }}
                  >
                    <AnimatePresence mode="wait">
                      {filteredProjects.map((project, index) => (
                        <ProjectCard
                          key={`${activeCategory}-${project.id}`}
                          project={project}
                          index={index}
                          onSelect={onProjectSelect}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Call to Action */}
                  <motion.div
                    className="text-center mt-20"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                  >
                    <h3 className={`text-2xl mb-4 ${
                      isLightMode ? 'text-fence-green' : 'text-white'
                    }`}>
                      Ready to Work Together?
                    </h3>
                    <p className={`text-lg mb-8 max-w-xl mx-auto ${
                      isLightMode ? 'text-norfolk-green' : 'text-gray-400'
                    }`}>
                      Let's create something extraordinary. Every project starts with a conversation.
                    </p>
                    <motion.button
                      className={`px-8 py-4 rounded-lg transition-all duration-300 ${
                        isLightMode
                          ? 'bg-fiery-glow text-white hover:bg-pumpkin-vapor'
                          : 'bg-aurelius-gold text-black hover:bg-aurelius-gold-light'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleClose();
                        setTimeout(() => {
                          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }, 500);
                      }}
                    >
                      Get In Touch
                    </motion.button>
                  </motion.div>
                </div>
              </motion.main>
            )}
          </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
