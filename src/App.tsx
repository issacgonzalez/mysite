// src/App.tsx
import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelmetProvider } from "react-helmet-async";
import { AccessibilityProvider } from "./components/AccessibilityProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingScreen } from "./components/LoadingScreen";
import { ThemeToggle } from "./components/ThemeToggle";
import { MetaTags } from "./components/MetaTags";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { PortfolioSection } from "./components/PortfolioSection";
import { ResumeSection } from "./components/ResumeSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { SideNavigation } from "./components/SideNavigation";
import { Layout } from "./components/Layout";
import {
  GlobalParticleSystem,
  SectionParticleOverlay,
} from "./components/GlobalParticleSystem";
import { ProjectLoadingScreen } from "./components/ProjectLoadingScreen";

// SAFE MODE: use direct imports instead of lazy() to avoid Vite cache issues
import { ProjectPage } from "./components/ProjectPage";
import { AllProjectsPage } from "./components/AllProjectsPage";
import { HiddenDynamicConvergencePage } from "./components/HiddenDynamicConvergencePage";
import { ContactSubmissionsView } from "./components/ContactSubmissionsView";

// Import project type from data file
import type { Project } from "./components/data/projectsData";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectPage, setShowProjectPage] = useState(false);
  const [showAllProjectsPage, setShowAllProjectsPage] = useState(false);
  const [showHiddenConvergencePage, setShowHiddenConvergencePage] =
    useState(false);
  const [showContactSubmissions, setShowContactSubmissions] = useState(false);
  const [isProjectPageLoading, setIsProjectPageLoading] = useState(false);
  const [isAllProjectsPageLoading, setIsAllProjectsPageLoading] =
    useState(false);

  const projectLoadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const allProjectsLoadingTimeoutRef = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  const handleLoadingComplete = () => {
    requestAnimationFrame(() => setIsLoading(false));
  };

  // Keyboard shortcuts for hidden pages
  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        setShowHiddenConvergencePage(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        setShowContactSubmissions(true);
      }
    };

    document.addEventListener("keydown", handleKeyboardShortcut);
    return () =>
      document.removeEventListener("keydown", handleKeyboardShortcut);
  }, []);

  // Project page handlers
  const handleProjectSelect = (project: Project) => {
    if (isProjectPageLoading) return;
    if (projectLoadingTimeoutRef.current)
      clearTimeout(projectLoadingTimeoutRef.current);

    setIsProjectPageLoading(true);
    setSelectedProject(project);

    const mainTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        setShowAllProjectsPage(false);
        setShowProjectPage(true);
        setIsProjectPageLoading(false);
      });
    }, 800);

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
    if (projectLoadingTimeoutRef.current) {
      clearTimeout(projectLoadingTimeoutRef.current);
      projectLoadingTimeoutRef.current = null;
    }
    requestAnimationFrame(() => {
      setShowProjectPage(false);
      setIsProjectPageLoading(false);
    });
    setTimeout(() => setSelectedProject(null), 300);
  };

  // All Projects Page handlers
  const handleViewAllProjects = () => {
    if (isAllProjectsPageLoading) return;
    if (allProjectsLoadingTimeoutRef.current)
      clearTimeout(allProjectsLoadingTimeoutRef.current);

    setIsAllProjectsPageLoading(true);

    const mainTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        setShowProjectPage(false);
        setShowAllProjectsPage(true);
        setIsAllProjectsPageLoading(false);
      });
    }, 600);

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
    if (allProjectsLoadingTimeoutRef.current) {
      clearTimeout(allProjectsLoadingTimeoutRef.current);
      allProjectsLoadingTimeoutRef.current = null;
    }
    requestAnimationFrame(() => {
      setShowAllProjectsPage(false);
      setIsAllProjectsPageLoading(false);
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (projectLoadingTimeoutRef.current)
        clearTimeout(projectLoadingTimeoutRef.current);
      if (allProjectsLoadingTimeoutRef.current)
        clearTimeout(allProjectsLoadingTimeoutRef.current);
    };
  }, []);

  // Determine current page
  const currentPage =
    showHiddenConvergencePage
      ? "dynamic-convergence"
      : showProjectPage
      ? "project"
      : showAllProjectsPage
      ? "all-projects"
      : "home";

  // --- MAIN RENDER ---
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AccessibilityProvider>
          {/* Dynamic Meta Tags */}
          <MetaTags page={currentPage} project={selectedProject} />

          {/* Header */}
          <AnimatePresence>
            {!isLoading && !isProjectPageLoading && !isAllProjectsPageLoading && (
              <Header
                onNavigate={
                  showProjectPage || showAllProjectsPage
                    ? (sectionId?: string) => {
                        if (showProjectPage) {
                          document.body.style.overflow = "unset";
                          handleProjectClose();
                          if (sectionId) {
                            setTimeout(() => {
                              document
                                .getElementById(sectionId)
                                ?.scrollIntoView({ behavior: "smooth" });
                            }, 400);
                          }
                        }
                        if (showAllProjectsPage) {
                          document.body.style.overflow = "unset";
                          handleAllProjectsClose();
                          if (sectionId) {
                            setTimeout(() => {
                              document
                                .getElementById(sectionId)
                                ?.scrollIntoView({ behavior: "smooth" });
                            }, 400);
                          }
                        }
                      }
                    : undefined
                }
                isAllProjectsPage={showAllProjectsPage}
              />
            )}
          </AnimatePresence>

          {/* Main App Container */}
          <div className="min-h-screen bg-app-container relative overflow-hidden mobile-viewport-lock">
            {/* Loading States */}
            <AnimatePresence>
              {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
            </AnimatePresence>

            <AnimatePresence>
              {isProjectPageLoading && (
                <ProjectLoadingScreen
                  onComplete={() => setIsProjectPageLoading(false)}
                  loadingText="Loading Project"
                  project={selectedProject}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isAllProjectsPageLoading && (
                <ProjectLoadingScreen
                  onComplete={() => setIsAllProjectsPageLoading(false)}
                  loadingText="Loading Projects"
                  project={null}
                />
              )}
            </AnimatePresence>

            {/* Main Site Content */}
            <AnimatePresence mode="wait">
              {!isLoading &&
                !isProjectPageLoading &&
                !isAllProjectsPageLoading &&
                !showProjectPage &&
                !showAllProjectsPage && (
                  <motion.div
                    key="main-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                      delay: 0.1,
                    }}
                    className="relative z-1"
                  >
                    <GlobalParticleSystem
                      particleCount={80}
                      enableMouseEffect={false}
                      isProjectsPageOpen={showAllProjectsPage}
                      isProjectPageOpen={showProjectPage}
                      isLoading={
                        isProjectPageLoading || isAllProjectsPageLoading
                      }
                    >
                      <Layout>
                        <SideNavigation />
                        <main className="relative">
                          {/* Hero */}
                          <div id="hero" className="relative">
                            <HeroSection />
                            <SectionParticleOverlay
                              density="low"
                              colors="mixed"
                            />
                          </div>

                          {/* About */}
                          <div id="about" className="relative">
                            <AboutSection />
                          </div>

                          {/* Portfolio */}
                          <div id="portfolio" className="relative">
                            <PortfolioSection
                              onProjectSelect={handleProjectSelect}
                              onViewAllProjects={handleViewAllProjects}
                            />
                          </div>

                          {/* Resume */}
                          <div id="resume" className="relative">
                            <ResumeSection />
                          </div>

                          {/* Contact */}
                          <div id="contact" className="relative">
                            <ContactSection />
                          </div>
                        </main>
                        <Footer
                          onHiddenPageOpen={() =>
                            setShowHiddenConvergencePage(true)
                          }
                        />
                      </Layout>
                    </GlobalParticleSystem>
                  </motion.div>
                )}
            </AnimatePresence>

            {/* Pages */}
            {selectedProject && (
              <ProjectPage
                project={selectedProject}
                isVisible={showProjectPage && !isProjectPageLoading}
                onClose={handleProjectClose}
                onProjectSelect={handleProjectSelect}
                onViewAllProjects={handleViewAllProjects}
              />
            )}

            {showAllProjectsPage && (
              <AllProjectsPage
                isVisible={showAllProjectsPage && !isAllProjectsPageLoading}
                onClose={handleAllProjectsClose}
                onProjectSelect={handleProjectSelect}
                sourceSection="Portfolio"
                onViewAllProjects={handleViewAllProjects}
              />
            )}

            {showHiddenConvergencePage && (
              <HiddenDynamicConvergencePage
                isVisible={showHiddenConvergencePage}
                onClose={() => setShowHiddenConvergencePage(false)}
              />
            )}

            {showContactSubmissions && (
              <ContactSubmissionsView
                onClose={() => setShowContactSubmissions(false)}
              />
            )}
          </div>

          {/* Theme Toggle */}
          <AnimatePresence>{!isLoading && <ThemeToggle />}</AnimatePresence>
        </AccessibilityProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
