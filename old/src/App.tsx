import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelmetProvider } from 'react-helmet-async';
import { AccessibilityProvider } from './components/AccessibilityProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { ThemeToggle } from './components/ThemeToggle';
import { MetaTags } from './components/MetaTags';
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { PortfolioSection } from "./components/PortfolioSection";
import { ResumeSection } from "./components/ResumeSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { SideNavigation } from "./components/SideNavigation";
import { Layout } from "./components/Layout";
import { GlobalParticleSystem, SectionParticleOverlay } from './components/GlobalParticleSystem';
import { ProjectLoadingScreen } from './components/ProjectLoadingScreen';

// Lazy load heavy components with timeout handling
const ProjectPage = lazy(() => 
  Promise.race([
    import('./components/ProjectPage').then(m => ({ default: m.ProjectPage })),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('ProjectPage load timeout')), 10000)
    )
  ]) as Promise<{ default: typeof import('./components/ProjectPage').ProjectPage }>
);

const AllProjectsPage = lazy(() => 
  Promise.race([
    import('./components/AllProjectsPage').then(m => ({ default: m.AllProjectsPage })),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AllProjectsPage load timeout')), 10000)
    )
  ]) as Promise<{ default: typeof import('./components/AllProjectsPage').AllProjectsPage }>
);

const HiddenDynamicConvergencePage = lazy(() => 
  import('./components/HiddenDynamicConvergencePage').then(m => ({ default: m.HiddenDynamicConvergencePage }))
);

const ContactSubmissionsView = lazy(() => 
  import('./components/ContactSubmissionsView').then(m => ({ default: m.ContactSubmissionsView }))
);

// Import project type from data file
import type { Project } from './components/data/projectsData';

// Welcome to ISSAC GONZALEZ - Your Experimental Portfolio Experience
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Project page navigation state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectPage, setShowProjectPage] = useState(false);
  const [showAllProjectsPage, setShowAllProjectsPage] = useState(false);
  
  // Hidden Dynamic Convergence page state
  const [showHiddenConvergencePage, setShowHiddenConvergencePage] = useState(false);
  
  // Contact submissions admin view state
  const [showContactSubmissions, setShowContactSubmissions] = useState(false);
  
  // Loading states for project pages
  const [isProjectPageLoading, setIsProjectPageLoading] = useState(false);
  const [isAllProjectsPageLoading, setIsAllProjectsPageLoading] = useState(false);
  
  // Safety timeout refs to prevent stuck loading states
  const projectLoadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const allProjectsLoadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLoadingComplete = () => {
    // Use requestAnimationFrame to prevent blocking
    requestAnimationFrame(() => {
      setIsLoading(false);
    });
  };

  // Hidden keyboard shortcuts
  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      // Dynamic Convergence page (Ctrl/Cmd + Shift + D)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (!showHiddenConvergencePage) {
          setShowHiddenConvergencePage(true);
        }
      }
      
      // Contact Submissions admin view (Ctrl/Cmd + Shift + C)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        if (!showContactSubmissions) {
          setShowContactSubmissions(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcut);
    return () => document.removeEventListener('keydown', handleKeyboardShortcut);
  }, [showHiddenConvergencePage, showContactSubmissions]);

  // Project page handlers
  const handleProjectSelect = (project: Project) => {
    // Prevent multiple rapid clicks
    if (isProjectPageLoading) return;
    
    // Clear any existing timeout
    if (projectLoadingTimeoutRef.current) {
      clearTimeout(projectLoadingTimeoutRef.current);
    }
    
    // Set project and start loading in a batch
    setIsProjectPageLoading(true);
    setSelectedProject(project);
    
    // Main transition - happens after loading animation
    const mainTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        // Atomic state update - all at once
        setShowAllProjectsPage(false);
        setShowProjectPage(true);
        setIsProjectPageLoading(false);
      });
    }, 800);
    
    // Safety timeout to force loading completion if something goes wrong
    projectLoadingTimeoutRef.current = setTimeout(() => {
      clearTimeout(mainTimeout);
      requestAnimationFrame(() => {
        setShowAllProjectsPage(false);
        setShowProjectPage(true);
        setIsProjectPageLoading(false);
      });
    }, 5000);
  };

  const handleProjectClose = () => {
    // Clear any pending timeouts first
    if (projectLoadingTimeoutRef.current) {
      clearTimeout(projectLoadingTimeoutRef.current);
      projectLoadingTimeoutRef.current = null;
    }
    
    // Atomic state reset
    requestAnimationFrame(() => {
      setShowProjectPage(false);
      setIsProjectPageLoading(false);
    });
    
    // Clear selected project after animation
    setTimeout(() => {
      setSelectedProject(null);
    }, 300);
  };

  // All projects page handlers
  const handleViewAllProjects = () => {
    // Prevent multiple rapid clicks
    if (isAllProjectsPageLoading) return;
    
    // Clear any existing timeout
    if (allProjectsLoadingTimeoutRef.current) {
      clearTimeout(allProjectsLoadingTimeoutRef.current);
    }
    
    setIsAllProjectsPageLoading(true);
    
    // Main transition - happens after loading animation
    const mainTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        // Atomic state update - all at once
        setShowProjectPage(false);
        setShowAllProjectsPage(true);
        setIsAllProjectsPageLoading(false);
      });
    }, 600);
    
    // Safety timeout to force loading completion if something goes wrong
    allProjectsLoadingTimeoutRef.current = setTimeout(() => {
      clearTimeout(mainTimeout);
      requestAnimationFrame(() => {
        setShowProjectPage(false);
        setShowAllProjectsPage(true);
        setIsAllProjectsPageLoading(false);
      });
    }, 5000);
  };

  const handleAllProjectsClose = () => {
    // Clear any pending timeouts first
    if (allProjectsLoadingTimeoutRef.current) {
      clearTimeout(allProjectsLoadingTimeoutRef.current);
      allProjectsLoadingTimeoutRef.current = null;
    }
    
    // Atomic state reset
    requestAnimationFrame(() => {
      setShowAllProjectsPage(false);
      setIsAllProjectsPageLoading(false);
    });
  };

  // Hidden Dynamic Convergence page handlers
  const handleHiddenConvergenceOpen = () => {
    setShowHiddenConvergencePage(true);
  };

  const handleHiddenConvergenceClose = () => {
    setShowHiddenConvergencePage(false);
  };

  // Loading completion handlers for project pages
  const handleProjectPageLoadingComplete = () => {
    setIsProjectPageLoading(false);
    // Clear timeout when loading completes successfully
    if (projectLoadingTimeoutRef.current) {
      clearTimeout(projectLoadingTimeoutRef.current);
      projectLoadingTimeoutRef.current = null;
    }
  };

  const handleAllProjectsPageLoadingComplete = () => {
    setIsAllProjectsPageLoading(false);
    // Clear timeout when loading completes successfully
    if (allProjectsLoadingTimeoutRef.current) {
      clearTimeout(allProjectsLoadingTimeoutRef.current);
      allProjectsLoadingTimeoutRef.current = null;
    }
  };
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (projectLoadingTimeoutRef.current) {
        clearTimeout(projectLoadingTimeoutRef.current);
      }
      if (allProjectsLoadingTimeoutRef.current) {
        clearTimeout(allProjectsLoadingTimeoutRef.current);
      }
    };
  }, []);

  // Determine current page for dynamic meta tags - memoized to prevent recalculation
  const currentPage = showHiddenConvergencePage 
    ? 'dynamic-convergence' 
    : showProjectPage 
      ? 'project' 
      : showAllProjectsPage 
        ? 'all-projects' 
        : 'home';

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AccessibilityProvider>
          {/* Dynamic Meta Tags - Changes based on current page */}
          <MetaTags 
            page={currentPage}
            project={selectedProject}
          />

          {/* Header - Always Visible - Fixed Positioning - OUTSIDE MAIN CONTAINER */}
          <AnimatePresence>
            {!isLoading && !isProjectPageLoading && !isAllProjectsPageLoading && (
              <Header 
                onNavigate={showProjectPage || showAllProjectsPage ? (sectionId?: string) => {
                  if (showProjectPage) {
                    // Immediately restore body overflow to allow scrolling
                    document.body.style.overflow = 'unset';
                    handleProjectClose();
                    // Allow time for close animation
                    if (sectionId) {
                      setTimeout(() => {
                        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                      }, 400);
                    }
                  }
                  if (showAllProjectsPage) {
                    // Immediately restore body overflow to allow scrolling
                    document.body.style.overflow = 'unset';
                    handleAllProjectsClose();
                    // Allow time for close animation
                    if (sectionId) {
                      setTimeout(() => {
                        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                      }, 400);
                    }
                  }
                } : undefined}
                isAllProjectsPage={showAllProjectsPage}
              />
            )}
          </AnimatePresence>

          {/* Main App Container - Fixed Background Colors */}
          <div className="min-h-screen bg-app-container relative overflow-hidden mobile-viewport-lock">

        {/* Loading Screen */}
        <AnimatePresence>
          {isLoading && (
            <LoadingScreen onComplete={handleLoadingComplete} />
          )}
        </AnimatePresence>

        {/* Project Page Loading Screen */}
        <AnimatePresence>
          {isProjectPageLoading && (
            <ProjectLoadingScreen 
              onComplete={handleProjectPageLoadingComplete}
              loadingText="Loading Project"
              project={selectedProject}
            />
          )}
        </AnimatePresence>

        {/* All Projects Page Loading Screen */}
        <AnimatePresence>
          {isAllProjectsPageLoading && (
            <ProjectLoadingScreen 
              onComplete={handleAllProjectsPageLoadingComplete}
              loadingText="Loading Projects"
              project={null}
            />
          )}
        </AnimatePresence>

        {/* Main Site Content with Global Particle System */}
        <AnimatePresence mode="wait">
          {!isLoading && !isProjectPageLoading && !isAllProjectsPageLoading && !showProjectPage && !showAllProjectsPage && (
            <motion.div
              key="main-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.6,
                ease: "easeInOut",
                delay: 0.1
              }}
              className="relative z-1"
            >
              <GlobalParticleSystem 
                particleCount={80} 
                enableMouseEffect={false}
                isProjectsPageOpen={showAllProjectsPage}
                isProjectPageOpen={showProjectPage}
                isLoading={isProjectPageLoading || isAllProjectsPageLoading}
              >
                <Layout>
                  <SideNavigation />
                  <main className="relative">
                    {/* Hero Section */}
                    <div id="hero" className="relative">
                      <HeroSection />
                      <SectionParticleOverlay density="low" colors="mixed" />
                    </div>

                    {/* About Section */}
                    <div id="about" className="relative">
                      <AboutSection />
                    </div>

                    {/* Portfolio Section */}
                    <div id="portfolio" className="relative">
                      <PortfolioSection 
                        onProjectSelect={handleProjectSelect} 
                        onViewAllProjects={handleViewAllProjects} 
                      />
                    </div>

                    {/* Resume Section */}
                    <div id="resume" className="relative">
                      <ResumeSection />
                    </div>

                    {/* Contact Section */}
                    <div id="contact" className="relative">
                      <ContactSection />
                    </div>
                  </main>
                  <Footer onHiddenPageOpen={handleHiddenConvergenceOpen} />
                </Layout>
              </GlobalParticleSystem>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Page - Higher z-index */}
        <Suspense fallback={
          <div className="fixed inset-0 z-75 flex items-center justify-center bg-black">
            <div className="text-white">Loading project...</div>
          </div>
        }>
          {selectedProject && (
            <ProjectPage 
              project={selectedProject}
              isVisible={showProjectPage && !isProjectPageLoading}
              onClose={handleProjectClose}
              onProjectSelect={handleProjectSelect}
              onViewAllProjects={handleViewAllProjects}
            />
          )}
        </Suspense>

        {/* All Projects Page - Higher z-index, Performance Optimized */}
        <Suspense fallback={
          <div className="fixed inset-0 z-75 flex items-center justify-center bg-black">
            <div className="text-white">Loading projects...</div>
          </div>
        }>
          {showAllProjectsPage && (
            <AllProjectsPage
              isVisible={showAllProjectsPage && !isAllProjectsPageLoading}
              onClose={handleAllProjectsClose}
              onProjectSelect={handleProjectSelect}
              sourceSection="Portfolio"
              onViewAllProjects={handleViewAllProjects}
            />
          )}
        </Suspense>

        {/* Hidden Dynamic Convergence Page - Highest z-index */}
        <Suspense fallback={null}>
          <HiddenDynamicConvergencePage
            isVisible={showHiddenConvergencePage}
            onClose={handleHiddenConvergenceClose}
          />
        </Suspense>

        {/* Contact Submissions Admin View - Highest z-index */}
        <Suspense fallback={null}>
          {showContactSubmissions && (
            <ContactSubmissionsView
              onClose={() => setShowContactSubmissions(false)}
            />
          )}
        </Suspense>
          </div>

          {/* Theme Toggle - Always visible, fixed to bottom right, highest z-index */}
          <AnimatePresence>
            {!isLoading && (
              <ThemeToggle />
            )}
          </AnimatePresence>
        </AccessibilityProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}