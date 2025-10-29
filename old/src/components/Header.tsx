import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  Home,
  User,
  Briefcase,
  FileText,
  Mail,
} from "lucide-react";
import { BullLogo } from "./BullLogo";
import { AccessibilityToggle } from "./AccessibilityToggle";

interface HeaderProps {
  onNavigate?: (sectionId?: string) => void;
  isAllProjectsPage?: boolean;
}

export function Header({ onNavigate, isAllProjectsPage = false }: HeaderProps = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isLightMode, setIsLightMode] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      setIsLightMode(
        document.documentElement.classList.contains("light"),
      );
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Calculate header offset based on screen size
    const getHeaderOffset = () => {
      if (window.innerWidth <= 768) {
        return 80; // Mobile offset
      } else if (window.innerWidth >= 1024) {
        return 120; // Desktop offset
      }
      return 100; // Default offset
    };

    if (onNavigate) {
      // Close project/all projects page and let App.tsx handle the scroll
      onNavigate(sectionId);
    } else {
      // Direct scroll for main page navigation with header offset
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = getHeaderOffset();
        const elementPosition =
          element.offsetTop - headerOffset;

        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      let scrollY = 0;

      if (onNavigate) {
        // For project pages, find any scrollable container with overflow-y-auto
        const projectContainer = document.querySelector(
          "[data-project-container], .fixed.inset-0.overflow-y-auto, .project-page-container",
        );
        if (projectContainer) {
          scrollY = projectContainer.scrollTop;
        } else {
          scrollY = window.scrollY || 0;
        }
        // Use much lower threshold for All Projects page (10%), higher for regular project pages (70%)
        const threshold = isAllProjectsPage ? window.innerHeight * 0.1 : window.innerHeight * 0.7;
        setIsPastHero(scrollY > threshold);
      } else {
        scrollY = window.scrollY || 0;
        // Change header colors when scrolled past 70% of viewport height
        const threshold = window.innerHeight * 0.7;
        setIsPastHero(scrollY > threshold);
      }
    };

    if (onNavigate) {
      // Try multiple selectors for project containers and set up interval to keep checking
      const tryAddScrollListener = () => {
        const selectors = [
          "[data-project-container]",
          ".fixed.inset-0.overflow-y-auto",
          ".project-page-container",
          'div[style*="overflow-y: auto"]',
          ".project-container",
          ".project-content",
        ];

        let projectContainer = null;
        for (const selector of selectors) {
          projectContainer = document.querySelector(selector);
          if (projectContainer) break;
        }

        if (projectContainer) {
          projectContainer.addEventListener(
            "scroll",
            handleScroll,
            { passive: true },
          );
          return projectContainer;
        }
        return null;
      };

      const container = tryAddScrollListener();
      if (container) {
        handleScroll();
        return () =>
          container.removeEventListener("scroll", handleScroll);
      }

      // Fallback to window scroll if no container found
      window.addEventListener("scroll", handleScroll, {
        passive: true,
      });
      handleScroll();
      return () =>
        window.removeEventListener("scroll", handleScroll);
    }

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    handleScroll();

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, [onNavigate, isAllProjectsPage]);

  useEffect(() => {
    const sections = [
      "hero",
      "about",
      "portfolio",
      "resume",
      "contact",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      },
    );

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }

    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { id: "hero", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "portfolio", label: "Work", icon: Briefcase },
    { id: "resume", label: "Resume", icon: FileText },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  // Enhanced Logo Component with HOVER-ONLY Footer-Style Animations
  const EnhancedLogo = ({
    size = "w-[85px] h-[85px]",
    className = "",
  }: {
    size?: string;
    className?: string;
  }) => {
    return (
      <div
        className={`flex justify-center items-center ${className}`}
      >
        <motion.div
          className="relative group"
          whileHover={{
            rotate: [0, -3, 3, 0],
            scale: 1.1,
          }}
          transition={{ duration: 0.6 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
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
            className={`${size} relative z-10 transition-all duration-500 group-hover:scale-105`}
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
            animate={isHovered ? { rotate: 360 } : {}}
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
                isHovered
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
      </div>
    );
  };

  return (
    <>
      {/* FIXED HEADER - PROPER Z-INDEX FOR ALL PAGES */}
      <header
        className={`fixed top-0 left-0 right-0 px-6 py-6 transition-all duration-500 ${
          isPastHero
            ? "backdrop-blur-lg border-b"
            : "bg-transparent"
        }`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: isPastHero
            ? isLightMode
              ? "#f2b43b" // Yellow background in light mode
              : "#000000" // Black background in dark mode
            : "transparent",
          borderColor: isPastHero
            ? isLightMode
              ? "rgba(0, 0, 0, 0.2)" // Black border with opacity in light mode
              : "rgba(248, 154, 28, 0.2)" // Aurelius Gold border with opacity in dark mode
            : "transparent",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo with Web Developer subtitle - BIGGER LOGO & SPACED TEXT */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity duration-200"
          >
            <EnhancedLogo size="w-[85px] h-[85px]" />
            <div className="flex flex-col items-start -ml-[20px]">
              <span
                className="text-lg leading-tight transition-colors duration-300"
                style={{
                  color: isPastHero
                    ? isLightMode
                      ? "#000000" // black
                      : "#ffffff" // white
                    : "#ffffff", // white
                  letterSpacing: "0.1em"
                }}
              >
                ISSAC GONZALEZ
              </span>
              <span
                className="text-xs uppercase transition-colors duration-300"
                style={{
                  color: isPastHero
                    ? isLightMode
                      ? "#000000" // black
                      : "#9CA3AF" // gray-400
                    : "#9CA3AF", // gray-400
                  letterSpacing: "0.1em"
                }}
              >
                WEB DEVELOPER
              </span>
            </div>
          </button>

          {/* NAVIGATION MOVED MORE TO THE RIGHT */}
          <div className="flex items-center gap-8 ml-auto">
            {/* Desktop Navigation with Active States - Pushed Right */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative text-sm tracking-wide uppercase transition-colors duration-200 pb-1"
                  style={{
                    color: isPastHero
                      ? isLightMode
                        ? "#000000" // black for both active and inactive
                        : activeSection === item.id
                          ? "#F89A1C" // aurelius-gold for active
                          : "#ffffff" // white for inactive
                      : isLightMode
                        ? "#ffffff" // white for both active and inactive in hero
                        : activeSection === item.id
                          ? "#F89A1C" // aurelius-gold for active
                          : "#D1D5DB", // gray-300 for inactive
                  }}
                  onMouseEnter={(e) => {
                    if (isPastHero) {
                      if (isLightMode) {
                        e.currentTarget.style.color = "#666666"; // gray on hover
                      } else {
                        e.currentTarget.style.color = "#F89A1C"; // aurelius-gold on hover
                      }
                    } else {
                      if (isLightMode) {
                        e.currentTarget.style.color = "#E5E7EB"; // gray-200 on hover
                      } else {
                        e.currentTarget.style.color = "#F89A1C"; // aurelius-gold on hover
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isPastHero
                      ? isLightMode
                        ? "#000000" // black
                        : activeSection === item.id
                          ? "#F89A1C" // aurelius-gold for active
                          : "#ffffff" // white for inactive
                      : isLightMode
                        ? "#ffffff" // white
                        : activeSection === item.id
                          ? "#F89A1C" // aurelius-gold for active
                          : "#D1D5DB"; // gray-300 for inactive
                  }}
                >
                  {item.label}
                  {/* Active underline */}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{
                        backgroundColor: isPastHero
                          ? isLightMode
                            ? "#000000" // black
                            : "#F89A1C" // aurelius-gold
                          : isLightMode
                            ? "#ffffff" // white
                            : "#F89A1C", // aurelius-gold
                      }}
                      layoutId="activeUnderline"
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Right Side Controls */}
            <div className="flex items-center gap-4">
              <AccessibilityToggle />

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 transition-colors duration-200"
                style={{
                  color: isPastHero
                    ? isLightMode
                      ? "#000000" // black
                      : "#ffffff" // white
                    : isLightMode
                      ? "#ffffff" // white
                      : "#ffffff", // white
                }}
                onMouseEnter={(e) => {
                  if (isPastHero) {
                    if (isLightMode) {
                      e.currentTarget.style.color = "#666666"; // gray
                    } else {
                      e.currentTarget.style.color = "#F89A1C"; // aurelius-gold
                    }
                  } else {
                    if (isLightMode) {
                      e.currentTarget.style.color = "#E5E7EB"; // gray-200
                    } else {
                      e.currentTarget.style.color = "#F89A1C"; // aurelius-gold
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isPastHero
                    ? isLightMode
                      ? "#000000" // black
                      : "#ffffff" // white
                    : isLightMode
                      ? "#ffffff" // white
                      : "#ffffff"; // white
                }}
                onClick={() =>
                  setIsMobileMenuOpen(!isMobileMenuOpen)
                }
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-65 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Full Screen Background */}
            <motion.div
              className="absolute inset-0 mobile-nav-backdrop"
              style={{
                backgroundColor: isLightMode
                  ? "#f2b43b"
                  : "#000000", // Yellow in light, Black in dark
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Navigation Content */}
            <motion.div
              ref={menuRef}
              className="relative h-full flex flex-col justify-center items-center px-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Navigation Menu */}
              <nav className="flex flex-col items-center space-y-12">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="mobile-nav-item group relative flex flex-col items-center transition-all duration-300 cursor-pointer outline-none focus:outline-none focus-visible:focus-visible"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + index * 0.1,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Navigate to ${item.label} section`}
                  >
                    {/* Label */}
                    <span
                      className="text-2xl tracking-wider uppercase transition-all duration-300"
                      style={{
                        color:
                          activeSection === item.id
                            ? isLightMode
                              ? "#000000"
                              : "#F89A1C"
                            : isLightMode
                              ? "#000000"
                              : "#ffffff",
                        fontWeight:
                          activeSection === item.id ? 600 : 400,
                      }}
                    >
                      {item.label}
                    </span>

                    {/* Active Indicator Line */}
                    {activeSection === item.id && (
                      <motion.div
                        className="mobile-nav-active-indicator mt-4 h-1 rounded-full"
                        style={{
                          backgroundColor: isLightMode
                            ? "#000000"
                            : "#F89A1C",
                          width: "80px",
                        }}
                        layoutId="mobileActiveIndicator"
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
                        }}
                      />
                    )}

                    {/* Hover Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                      style={{
                        backgroundColor: isLightMode
                          ? "#000000"
                          : "#F89A1C",
                      }}
                    />
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}