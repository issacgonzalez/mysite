import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "motion/react";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Users,
  Target,
  Globe,
  ChevronDown,
  Play,
  CheckCircle,
  Code,
  Lightbulb,
  TrendingUp,
  Home,
  FolderOpen,
} from "lucide-react";
import logo from "@/assets/3e86aa81af9c5b0aa8b596a81d9f4369488b7118.png";
import vixenHero from "@/assets/0347e3e27379b7cbd4ba23903a5d3e62c50c2c42.png";
import vixenCommunity from "@/assets/9dbc372cb6710b4b7cb5080efab7475239153866.png";
import vixenShowcase from "@/assets/fcf063029f830b0e40f53273e44df7731a1d6ba5.png";
import vixenParallaxHero from "@/assets/f4988d593e5d0a5a5c6b3d3f197e085c27f519bb.png";
import lamarHeroImage from "@/assets/1f01804b7476e2b99aa0486154dfcb2676daa967.png";
import lamarBrowserMockup from "@/assets/1cabe1b6eb814ecca80aef5ff5850b8e59d450b4.png";
import lamarFullPageDesign from "@/assets/52d3c3bc61cf292848f3f0127c73cb13cbd92564.png";
import arkansasStateHeroImage from "@/assets/4f4b0723283e65a70e32f4e82d1ac7afaa29ad47.png";
import arkansasStateParallaxHero from "@/assets/86087f2e064bcc79a86d456b1098dfa485a7c41b.png";
import texasAMInternationalHeroImage from "@/assets/14a10daf6e8aac2b19bfebf5923d40008e6ddc6f.png";
import utaHeroImage from "@/assets/6dda4674f46466ee6ae6d23a36158ef2bf86c812.png";
import pizzaRoxHeroImage from "@/assets/5cabc62aee9b68097042853eb4755041c014d4b8.png";
import artesanoHeroImage from "@/assets/5a9e341f80b08d29e35e6b75f11bb9369d6ad195.png";
import exodusHeroImage from "@/assets/e7b2c25d53575b986e6d55f65fa7821672046c7a.png";
import { ImageWithFallback } from "./my-assets/ImageWithFallback";
import { Header } from "./Header";
import { MetaTags } from "./MetaTags";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./ui/breadcrumb";

import type { Project } from "./data/projectsData";
import { allProjects } from "./data/projectsData";

interface ProjectPageProps {
  project: Project | null;
  isVisible: boolean;
  onClose: () => void;
  onProjectSelect?: (project: Project) => void;
  onViewAllProjects?: () => void;
}

// Enhanced Logo Component with Header Hover State - Fixed Centering
const EnhancedLogo = ({
  size = "w-10 h-10",
  className = "",
}: {
  size?: string;
  className?: string;
}) => (
  <div
    className={`flex justify-center items-center ${className}`}
  >
    <motion.div
      className="relative"
      whileHover={{
        rotate: [0, -2, 2, 0],
        scale: 1.05,
      }}
      transition={{ duration: 0.5 }}
    >
      {/* Multiple Glow Layers */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle, rgba(248, 154, 28, 0.35) 0%, rgba(245, 158, 11, 0.25) 40%, transparent 70%)",
          filter: "blur(8px)",
          transform: "scale(2.5)",
        }}
        animate={{
          scale: [2.5, 2.8, 2.5],
          opacity: [0.3, 0.55, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-full opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle, rgba(248, 154, 28, 0.55) 0%, rgba(245, 158, 11, 0.35) 30%, transparent 60%)",
          filter: "blur(4px)",
          transform: "scale(2)",
        }}
        animate={{
          scale: [2, 2.2, 2],
          opacity: [0.4, 0.75, 0.4],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-full opacity-100 transition-opacity duration-200"
        style={{
          background:
            "radial-gradient(circle, rgba(248, 154, 28, 0.75) 0%, rgba(245, 158, 11, 0.55) 20%, transparent 40%)",
          filter: "blur(2px)",
          transform: "scale(1.5)",
        }}
        animate={{
          scale: [1.5, 1.7, 1.5],
          opacity: [0.5, 0.95, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      />

      {/* Logo Image with Enhanced Glow */}
      <motion.img
        src={logo}
        alt="Logo"
        className={`${size} object-contain relative z-10`}
        style={{
          filter:
            "drop-shadow(0 0 8px rgba(248, 154, 28, 0.45)) drop-shadow(0 0 16px rgba(245, 158, 11, 0.25))",
        }}
        animate={{
          filter: [
            "drop-shadow(0 0 8px rgba(248, 154, 28, 0.45)) drop-shadow(0 0 16px rgba(245, 158, 11, 0.25))",
            "drop-shadow(0 0 12px rgba(248, 154, 28, 0.55)) drop-shadow(0 0 20px rgba(245, 158, 11, 0.35))",
            "drop-shadow(0 0 8px rgba(248, 154, 28, 0.45)) drop-shadow(0 0 16px rgba(245, 158, 11, 0.25))",
          ],
        }}
        transition={{
          filter: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      {/* Orbiting Glow Particles */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-100 transition-opacity duration-500"
        animate={{ rotate: 360 }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div
          className="absolute top-0 left-1/2 w-1 h-1 bg-aurelius-gold rounded-full transform -translate-x-1/2 -translate-y-3"
          style={{
            boxShadow:
              "0 0 6px rgba(248, 154, 28, 0.75), 0 0 12px rgba(245, 158, 11, 0.35)",
            filter: "blur(0.5px)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-0.5 h-0.5 bg-aurelius-amber rounded-full transform -translate-x-1/2 translate-y-3"
          style={{
            boxShadow: "0 0 4px rgba(245, 158, 11, 0.75)",
            filter: "blur(0.5px)",
          }}
        />
      </motion.div>

      {/* Pulse Ring Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-100"
        animate={{
          scale: [1, 2.5, 1],
          opacity: [0, 0.25, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          delay: 1,
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
    </motion.div>
  </div>
);

export function ProjectPage({
  project,
  isVisible,
  onClose,
  onProjectSelect,
  onViewAllProjects,
}: ProjectPageProps) {
  const [showContent, setShowContent] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // CONTAINER-BASED PARALLAX - Using container scroll for proper project page behavior
  const { scrollY } = useScroll({ container: containerRef });

  // Optimized parallax transforms for 85vh hero section
  const yParallax = useTransform(scrollY, [0, 750], [0, -180]); // Optimized movement for 85vh hero
  const scaleParallax = useTransform(
    scrollY,
    [0, 550],
    [1, 1.15],
  ); // Perfect scale for 85% screen coverage
  const opacityParallax = useTransform(
    scrollY,
    [0, 650],
    [1, 0.8],
  ); // Smooth opacity transition for 85vh

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

  // Function to get parallax hero image for projects - UPDATED WITH NEW VIXEN IMAGE
  const getParallaxHeroImage = (project: Project) => {
    if (
      project.title.toLowerCase().includes("vixen") ||
      project.title.toLowerCase().includes("workout")
    ) {
      return vixenParallaxHero; // NEW VIXEN IMAGE
    } else if (project.title.toLowerCase().includes("lamar")) {
      return lamarHeroImage; // NEW LAMAR IMAGE
    } else if (
      project.title.toLowerCase().includes("arkansas")
    ) {
      return arkansasStateParallaxHero; // NEW ARKANSAS STATE PARALLAX HERO IMAGE
    } else if (
      project.title.toLowerCase().includes("texas a&m")
    ) {
      return texasAMInternationalHeroImage; // NEW TEXAS A&M INTERNATIONAL IMAGE
    } else if (
      project.title.toLowerCase().includes("uta") ||
      project.title.toLowerCase().includes("arlington")
    ) {
      return utaHeroImage; // NEW UTA IMAGE
    } else if (project.category === "University" || project.category === "Education") {
      return "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwbW9kZXJuJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzU1MzY5NDU1fDA&ixlib=rb-4.1.0&q=80&w=1080";
    } else if (
      project.title.toLowerCase().includes("exodus") ||
      project.title.toLowerCase().includes("construction")
    ) {
      return exodusHeroImage; // NEW EXODUS IMAGE
    } else if (
      project.title.toLowerCase().includes("pizza") ||
      project.title.toLowerCase().includes("restaurant")
    ) {
      return pizzaRoxHeroImage;
    } else if (
      project.title.toLowerCase().includes("artesano") ||
      project.title.toLowerCase().includes("marketplace")
    ) {
      return artesanoHeroImage; // NEW ARTESANO IMAGE
    } else {
      // Default business/tech image
      return "https://images.unsplash.com/photo-1557804506-669a67965ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG9mZmljZSUyMG1vZGVybiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NTUzOTk1MTl8MA&ixlib=rb-4.1.0&q=80&w=1080";
    }
  };

  // Enhanced project data with comprehensive information
  const getProjectDetails = (project: Project | null) => {
    if (!project) return null;

    // Enhanced data for Lamar University project
    if (project.id === 1) {
      return {
        title: "Lamar University Degree Programs",
        subtitle:
          "Transforming Academic Discovery Through Digital Innovation",
        category: "Higher Education • Web Development",
        year: "2023-2024",
        duration: "8 months",
        team: "Creative team of 8",
        role: "Frontend Developer",
        client: "Lamar University, Beaumont, Texas",
        projectUrl: "https://lamar.edu/degrees",

        overview:
          "Lamar University needed a comprehensive digital transformation of their partner sites and landing pages to better serve prospective students and enhance academic program discovery. The existing partner recruitment pages suffered from poor information architecture, limited search capabilities, and outdated user experience that was hindering partner engagement and student enrollment.",

        challenge:
          "The university's partner recruitment sites and landing pages were scattered across multiple systems, making it nearly impossible for partner organizations to effectively promote programs. With over 100+ degree programs across multiple colleges, the challenge was creating cohesive, branded partner sites and landing pages that could handle complex academic hierarchies while maintaining fast performance and seamless integration with partner workflows.",

        solution:
          "We developed a modern, component-based architecture using WordPress as the CMS with custom PHP development for creating dynamic partner sites and landing pages. The solution featured customizable partner-branded pages, advanced program finders optimized for partner audiences, and seamless integration with partner referral systems. The design emphasized mobile-first responsive layouts and accessibility-first architecture tailored for partner recruitment needs.",

        impact: [
          "Significantly increased program page engagement",
          "Improved application completion rates through streamlined user flows",
          "Enhanced mobile experience with high user satisfaction scores",
          "Reduced administrative workload through automated content management",
          "Achieved WCAG 2.1 AA accessibility compliance across all program pages",
          "Decreased page load times through performance optimization",
        ],

        features: [
          "Advanced Program Search & Filtering",
          "Interactive Degree Planning Tools",
          "Personalized Program Recommendations",
          "Virtual Campus Integration",
          "Student Success Analytics Dashboard",
          "Mobile-Responsive Design System",
          "Accessibility-First Architecture",
          "SEO-Optimized Content Structure",
        ],

        technologies: [
          {
            name: "WordPress",
            description:
              "Custom theme development with advanced post types",
          },
          {
            name: "PHP",
            description:
              "Backend logic and database integration",
          },
          {
            name: "JavaScript",
            description:
              "Interactive features and real-time search",
          },
          {
            name: "CSS",
            description:
              "Responsive design system and animations",
          },
          {
            name: "MySQL",
            description:
              "Database optimization and query performance",
          },
          {
            name: "REST API",
            description: "Integration with university systems",
          },
          {
            name: "Google Analytics",
            description:
              "User behavior tracking and optimization",
          },
          {
            name: "Accessibility Tools",
            description:
              "WCAG compliance and screen reader support",
          },
        ],

        images: {
          browserMockup: lamarBrowserMockup,
          fullPageDesign: lamarFullPageDesign,
        },
      };
    }

    // Enhanced data for Vixen Workout project with FULL IMAGE GALLERY
    if (project.id === 2) {
      return {
        title: "Vixen Workout",
        subtitle:
          "Feel Bigger Than Life - Revolutionary Fitness Platform",
        category: "Fitness & Wellness • Web Application",
        year: "2024",
        duration: "10 months",
        team: "Creative team of 6",
        role: "Frontend Developer",
        client: "VXN Fitness Studio, Miami",
        projectUrl: "https://vixenworkout.com",

        overview:
          "Vixen Workout needed a revolutionary digital platform that could capture the intensity and empowerment of their unique fitness philosophy. The challenge was creating an immersive web experience that would motivate users to push their limits while building a strong community of fierce, determined individuals who refuse to settle for ordinary.",

        challenge:
          "Traditional fitness websites fail to capture the raw energy and transformative power of high-intensity workouts. VXN needed a platform that could convey their 'Feel Bigger Than Life' philosophy through cutting-edge design, while providing practical tools for class booking, community engagement, and instructor showcases. The platform needed to work seamlessly across devices while maintaining the brand's bold, unapologetic aesthetic.",

        solution:
          "We developed a next-generation fitness platform using React and Node.js, featuring immersive WebGL animations, dynamic motion design, and real-time community features. The solution included virtual studio tours, interactive workout previews, seamless class booking integration, and a comprehensive instructor showcase system. The design emphasized bold typography, dramatic imagery, and fluid animations that embody the brand's transformative energy.",

        impact: [
          "Significantly increased class bookings",
          "Built thriving community of active members",
          "Achieved high user retention rate for premium membership",
          "Generated substantial increase in new member sign-ups",
          "Reduced administrative overhead through automation",
        ],

        features: [
          "Immersive Virtual Studio Experience",
          "Real-time Class Booking & Management",
          "Community Challenge Platform",
          "Interactive Instructor Profiles",
          "Live Workout Streaming Integration",
          "Personalized Fitness Journey Tracking",
          "Social Sharing & Achievement System",
          "Mobile-First Progressive Web App",
        ],

        technologies: [
          {
            name: "React",
            description:
              "Component-based UI with hooks and context",
          },
          {
            name: "WebGL",
            description:
              "3D graphics and immersive visual effects",
          },
          {
            name: "Motion Design",
            description: "Framer Motion for fluid animations",
          },
          {
            name: "Socket.io",
            description:
              "Real-time chat and live workout features",
          },
          {
            name: "Stripe API",
            description:
              "Secure payment processing and subscriptions",
          },
          {
            name: "Cloudinary",
            description:
              "Optimized media delivery and management",
          },
        ],

        images: {
          hero: vixenHero,
          community: vixenCommunity,
          showcase: vixenShowcase,
        },
      };
    }

    // Enhanced data for Arkansas State University project
    if (project.id === 3) {
      return {
        title: "Arkansas State University",
        subtitle:
          "Modern Academic Platform for Student Success",
        category: "Higher Education • Web Development",
        year: "2023",
        duration: "6 months",
        team: "Creative team of 5",
        role: "Frontend Developer",
        client: "Arkansas State University, Jonesboro, Arkansas",
        projectUrl: "https://degree.astate.edu",

        overview:
          "Arkansas State University needed modern partner sites and landing pages to better serve their recruitment partners and improve program visibility. The project focused on creating intuitive, accessible partner-branded pages that would enhance the partner recruitment experience while maintaining the university's brand identity.",

        challenge:
          "The university's existing partner recruitment sites and landing pages were difficult to navigate and lacked modern web standards. Partner organizations struggled to effectively promote programs through the university's digital channels, and the administrative team needed a more efficient system for creating and managing partner-specific landing pages.",

        solution:
          "We developed a comprehensive WordPress-based solution with custom PHP development for creating dynamic partner sites and landing pages. The platform features responsive design, partner-branded templates, and an intuitive content management system that empowers university staff to easily create and customize partner-specific pages while maintaining brand consistency.",

        impact: [
          "Improved user engagement and time on site",
          "Enhanced mobile experience for students",
          "Streamlined content management for administrators",
          "Better search engine visibility for programs",
          "Increased application inquiries from prospective students",
          "Modernized university's digital presence",
        ],

        features: [
          "Responsive Design System",
          "Advanced Content Management",
          "Program Search & Discovery",
          "Mobile-Optimized Experience",
          "SEO Implementation",
          "Accessibility Standards Compliance",
          "Performance Optimization",
          "User-Friendly Navigation",
        ],

        technologies: [
          {
            name: "WordPress",
            description:
              "Custom theme development with advanced post types",
          },
          {
            name: "PHP",
            description:
              "Backend logic and database integration",
          },
          {
            name: "JavaScript",
            description:
              "Interactive features and real-time search",
          },
          {
            name: "CSS",
            description:
              "Responsive design system and animations",
          },
          {
            name: "MySQL",
            description:
              "Database optimization and query performance",
          },
          {
            name: "REST API",
            description: "Integration with university systems",
          },
          {
            name: "Google Analytics",
            description:
              "User behavior tracking and optimization",
          },
          {
            name: "Accessibility Tools",
            description:
              "WCAG compliance and screen reader support",
          },
        ],

        images: {
          hero: arkansasStateHeroImage,
        },
      };
    }

    // Enhanced data for Artesano project
    if (project.id === 7) {
      return {
        title: "Artesano",
        subtitle: "Sophisticated Artisan Marketplace & E-Commerce Platform",
        category: "E-Commerce • Web Development",
        year: "2024",
        duration: "5 months",
        team: "Creative team of 3",
        role: "Frontend Developer",
        client: "Artesano Marketplace",
        projectUrl: "https://artesano.net",

        overview:
          "Artesano needed a sophisticated e-commerce platform to showcase handcrafted artisan goods and provide a seamless shopping experience. The project focused on creating an immersive digital marketplace that celebrates craftsmanship while delivering modern e-commerce functionality and artist portfolio management capabilities.",

        challenge:
          "Creating a platform that could effectively showcase diverse artisan products while maintaining a cohesive brand experience. The challenge involved integrating e-commerce functionality, artist portfolio management, and immersive product galleries in a way that felt authentic to the handcrafted nature of the goods while providing a modern, user-friendly shopping experience.",

        solution:
          "We developed a custom Shopify-based solution featuring integrated e-commerce functionality, dynamic artist portfolio management, and immersive product galleries. The platform emphasizes visual storytelling, responsive design, and seamless checkout experiences while celebrating the unique character of each handcrafted product.",

        impact: [
          "Successfully launched sophisticated marketplace platform",
          "Enhanced product discovery and browsing experience",
          "Streamlined artist portfolio management system",
          "Improved mobile shopping experience",
          "Integrated secure payment processing",
          "Established strong brand presence online",
        ],

        features: [
          "Custom E-Commerce Integration",
          "Artist Portfolio Management",
          "Immersive Product Galleries",
          "Responsive Design System",
          "Secure Payment Processing",
          "Mobile-Optimized Shopping",
          "SEO Implementation",
          "Brand Storytelling Features",
        ],

        technologies: [
          {
            name: "Shopify",
            description:
              "Custom theme development and e-commerce integration",
          },
          {
            name: "Liquid",
            description:
              "Shopify templating and dynamic content",
          },
          {
            name: "JavaScript",
            description:
              "Interactive features and shopping cart functionality",
          },
          {
            name: "CSS",
            description:
              "Responsive design and brand styling",
          },
          {
            name: "Shopify API",
            description:
              "Custom integrations and data management",
          },
        ],

        images: {
          hero: artesanoHeroImage,
        },
      };
    }

    // Enhanced data for Pizza Rox project
    if (project.id === 6) {
      return {
        title: "Pizza Rox",
        subtitle: "Dynamic Restaurant Website with Online Ordering",
        category: "Restaurant • Web Development",
        year: "2024",
        duration: "4 months",
        team: "Creative team of 3",
        role: "Frontend Developer",
        client: "Pizza Rox Restaurant",
        projectUrl: "https://pizzarox.com",

        overview:
          "Pizza Rox needed a dynamic restaurant website with integrated online ordering capabilities to enhance customer engagement and streamline their digital presence. The project focused on creating a mobile-optimized platform that showcases their menu while providing seamless ordering functionality.",

        challenge:
          "Creating a user-friendly online ordering system that could handle high traffic volumes while maintaining fast load times and a smooth user experience. The challenge involved integrating menu management, order processing, and customer engagement features in a way that reflected the restaurant's vibrant brand identity.",

        solution:
          "We developed a WordPress-based solution featuring integrated online ordering, interactive menu management, and customer engagement tools. The platform emphasizes mobile-first design, fast performance, and intuitive navigation while celebrating the restaurant's unique character and community focus.",

        impact: [
          "Successfully launched online ordering platform",
          "Enhanced customer engagement and ordering experience",
          "Streamlined menu management system",
          "Improved mobile browsing and ordering",
          "Increased online order volume",
          "Established strong digital brand presence",
        ],

        features: [
          "Online Ordering System",
          "Interactive Menu Management",
          "Mobile-Optimized Design",
          "Customer Engagement Tools",
          "Responsive Design System",
          "Performance Optimization",
          "SEO Implementation",
          "Brand Integration",
        ],

        technologies: [
          {
            name: "WordPress",
            description:
              "Custom theme development and content management",
          },
          {
            name: "PHP",
            description:
              "Backend logic and order processing",
          },
          {
            name: "JavaScript",
            description:
              "Interactive features and ordering functionality",
          },
          {
            name: "CSS",
            description:
              "Responsive design and brand styling",
          },
        ],

        images: {
          hero: pizzaRoxHeroImage,
        },
      };
    }

    // Enhanced data for Exodus Construction project
    if (project.id === 5) {
      return {
        title: "Exodus Construction",
        subtitle: "Professional Construction Company Website",
        category: "Construction • Web Development",
        year: "2024",
        duration: "4 months",
        team: "Creative team of 3",
        role: "Frontend Developer",
        client: "Exodus Construction",
        projectUrl: "https://exodusconstruction.net",

        overview:
          "Exodus Construction needed a professional website to showcase their construction projects and generate leads for their growing business. The project focused on creating a robust platform that highlights their portfolio, services, and client testimonials while providing an intuitive experience for potential clients.",

        challenge:
          "Creating a website that could effectively showcase diverse construction projects while maintaining fast load times and excellent mobile performance. The challenge involved integrating dynamic project galleries, service portfolios, and client testimonials in a way that builds trust and credibility while providing clear calls-to-action for lead generation.",

        solution:
          "We developed a custom solution featuring dynamic project galleries, comprehensive service portfolios, and integrated client testimonials. The platform emphasizes visual storytelling, responsive design, and lead generation optimization while showcasing the quality and range of their construction work.",

        impact: [
          "Successfully launched professional construction website",
          "Enhanced project showcase and portfolio presentation",
          "Streamlined lead generation and inquiry process",
          "Improved mobile browsing and user experience",
          "Increased client inquiries and business visibility",
          "Established strong digital brand presence",
        ],

        features: [
          "Dynamic Project Galleries",
          "Service Portfolio Management",
          "Client Testimonial Integration",
          "Mobile-Optimized Design",
          "Lead Generation Forms",
          "Responsive Design System",
          "Performance Optimization",
          "SEO Implementation",
        ],

        technologies: [
          {
            name: "PHP",
            description:
              "Backend logic and form processing",
          },
          {
            name: "JavaScript",
            description:
              "Interactive galleries and dynamic features",
          },
          {
            name: "CSS",
            description:
              "Responsive design and professional styling",
          },
          {
            name: "MySQL",
            description:
              "Database management and content storage",
          },
        ],

        images: {
          hero: exodusHeroImage,
        },
      };
    }

    // Enhanced data for Texas A&M International project
    if (project.id === 4) {
      return {
        title: "Texas A&M International University",
        subtitle:
          "Partner Sites and Landing Pages for Online Education Programs",
        category: "Higher Education • Web Development",
        year: "2023",
        duration: "6 months",
        team: "Creative team of 5",
        role: "Frontend Developer",
        client: "Texas A&M International University, Laredo, Texas",
        projectUrl: "https://online.tamiu.edu",

        overview:
          "Texas A&M International University needed modern partner sites and landing pages to expand their online education programs and strengthen partnerships with educational organizations. The project focused on creating customizable, partner-branded digital experiences that would enhance recruitment efforts while maintaining the university's academic reputation.",

        challenge:
          "The university's partner recruitment efforts lacked dedicated digital assets, making it difficult for partner organizations to effectively promote TAMIU programs. With multiple online degree programs and diverse partner organizations, the challenge was creating flexible, scalable partner sites and landing pages that could be customized for different audiences while maintaining brand consistency and academic credibility.",

        solution:
          "We developed a WordPress-based platform with custom PHP development specifically designed for creating partner sites and landing pages. The solution features partner-branded templates, customizable program showcases, advanced application funnels optimized for partner referrals, and seamless integration with the university's enrollment management system. The design emphasized mobile-first responsive layouts and conversion optimization.",

        impact: [
          "Successfully launched partner sites for multiple educational organizations",
          "Significantly increased partner-referred applications",
          "Improved conversion rates on partner landing pages",
          "Streamlined partner onboarding with self-service page creation tools",
          "Enhanced mobile experience with high user satisfaction scores",
          "Dramatically reduced partner site creation time",
        ],

        features: [
          "Partner-Branded Site Builder",
          "Customizable Landing Page Templates",
          "Advanced Program Showcases",
          "Partner Referral Tracking System",
          "Mobile-Responsive Design System",
          "Application Funnel Optimization",
          "Partner Analytics Dashboard",
          "SEO-Optimized Partner Pages",
        ],

        technologies: [
          {
            name: "WordPress",
            description:
              "Custom theme development with advanced post types",
          },
          {
            name: "PHP",
            description:
              "Backend logic and database integration",
          },
          {
            name: "JavaScript",
            description:
              "Interactive features and real-time search",
          },
          {
            name: "CSS",
            description:
              "Responsive design system and animations",
          },
          {
            name: "MySQL",
            description:
              "Database optimization and query performance",
          },
          {
            name: "REST API",
            description: "Integration with university systems",
          },
          {
            name: "Google Analytics",
            description:
              "User behavior tracking and optimization",
          },
          {
            name: "Accessibility Tools",
            description:
              "WCAG compliance and screen reader support",
          },
        ],

        images: {
          hero: texasAMInternationalHeroImage,
        },
      };
    }

    // Enhanced data for UTA project
    if (project.id === 8) {
      return {
        title: "University of Texas at Arlington",
        subtitle:
          "Academic Partnerships Platform for Online Education Excellence",
        category: "Higher Education • Web Development",
        year: "2024",
        duration: "7 months",
        team: "Creative team of 6",
        role: "Frontend Developer",
        client: "University of Texas at Arlington, Arlington, Texas",
        projectUrl: "https://academicpartnerships.uta.edu",

        overview:
          "The University of Texas at Arlington needed a comprehensive academic partnerships platform to expand their online education reach and connect with prospective students through strategic partner networks. The project focused on creating a sophisticated digital ecosystem that showcases UTA's online programs while providing seamless pathways for partner organizations to promote degree offerings and support student recruitment.",

        challenge:
          "UTA's academic partnerships lacked a centralized digital platform, making it difficult to coordinate with partner organizations and provide consistent information about online programs. With a diverse portfolio of online degrees and multiple partner relationships across the country, the challenge was creating a unified platform that could serve both prospective students and partner organizations while maintaining UTA's academic brand and ensuring compliance with educational standards.",

        solution:
          "We developed a WordPress-based platform with custom PHP development and integrated CRM functionality specifically designed for academic partnerships. The solution features comprehensive program catalogs, partner-branded landing pages, interactive program finders, automated lead routing to partners, and real-time enrollment tracking. The design emphasized mobile-first responsive layouts, accessibility compliance, and conversion optimization for diverse student audiences.",

        impact: [
          "Successfully launched unified academic partnerships platform",
          "Significantly increased partner-referred student enrollments",
          "Enhanced program discovery and exploration experience",
          "Streamlined partner collaboration and lead management",
          "Improved student application completion rates",
          "Established scalable foundation for partnership growth",
        ],

        features: [
          "Academic Partnership Management System",
          "Comprehensive Online Program Catalog",
          "Interactive Program Discovery Tools",
          "Partner-Branded Landing Pages",
          "Automated Lead Distribution System",
          "Student Journey Tracking Dashboard",
          "Mobile-Responsive Design System",
          "CRM Integration & Analytics",
        ],

        technologies: [
          {
            name: "WordPress",
            description:
              "Custom theme development with advanced post types",
          },
          {
            name: "PHP",
            description:
              "Backend logic and database integration",
          },
          {
            name: "JavaScript",
            description:
              "Interactive features and real-time search",
          },
          {
            name: "CSS",
            description:
              "Responsive design system and animations",
          },
          {
            name: "MySQL",
            description:
              "Database optimization and query performance",
          },
          {
            name: "REST API",
            description: "Integration with university systems",
          },
          {
            name: "Google Analytics",
            description:
              "User behavior tracking and optimization",
          },
          {
            name: "Accessibility Tools",
            description:
              "WCAG compliance and screen reader support",
          },
        ],

        images: {
          hero: utaHeroImage,
        },
      };
    }

    // Fallback for other projects
    return {
      title: project.title,
      subtitle: `A comprehensive ${project.category.toLowerCase()} solution`,
      category: project.category,
      year: project.category === "University" ? "2023" : "2024",
      duration:
        project.category === "University"
          ? "6 months"
          : "4 months",
      team:
        project.category === "University"
          ? "Creative team of 5-8"
          : "Creative team of 3-5",
      role: "Frontend Developer",
      client:
        project.category === "University"
          ? "Academic Institution"
          : "Local Business",
      projectUrl: project.url,

      overview:
        project.description +
        " This project involved comprehensive planning, design, and development phases to deliver a solution that meets both user needs and business objectives.",

      challenge: `The ${project.category.toLowerCase()} required a modern digital presence that could effectively communicate their value proposition while providing an exceptional user experience across all devices and platforms.`,

      solution:
        "We developed a custom solution focusing on user experience, performance, and scalability. The approach emphasized modern web standards, responsive design principles, and conversion optimization to achieve measurable business results.",

      impact: [
        "Significantly improved user engagement and satisfaction",
        "Enhanced online visibility and search rankings",
        "Streamlined user journeys and conversion processes",
        "Established strong digital foundation for future growth",
      ],

      features: [
        "Responsive Design System",
        "Performance Optimization",
        "SEO Implementation",
        "User Experience Enhancement",
      ],

      technologies: project.tech.map((tech) => ({
        name: tech,
        description: `Utilized for core development and implementation`,
      })),

      images: {
        hero: "https://images.unsplash.com/photo-1641238875178-b529cf9c77fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwbW9kZXJuJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzU1MTgwNzM4fDA&ixlib=rb-4.0.3&q=80&w=1080",
        students:
          "https://images.unsplash.com/photo-1701967341617-14499d8bf8c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwdGVjaG5vbG9neSUyMGNvbXB1dGVyfGVufDF8fHx8MTc1NTIyMjIyOHww&ixlib=rb-4.0.3&q=80&w=1080",
        mockup:
          "https://images.unsplash.com/photo-1750056393331-82e69d28c9d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGRlc2lnbiUyMG1vY2t1cHN8ZW58MXx8fHwxNzU1MjIyMjMxfDA&ixlib=rb-4.0.3&q=80&w=1080",
      },
    };
  };

  const projectDetails = getProjectDetails(project);

  // Initialize page - NO LOADING SCREEN
  useEffect(() => {
    if (isVisible && project) {
      setShowContent(true);
      document.body.style.overflow = "hidden";
      // Scroll to top immediately
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    } else {
      setShowContent(false);
      document.body.style.overflow = "unset";
    }
  }, [isVisible, project]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) onClose();
    };

    if (isVisible) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isVisible, onClose]);

  // Removed loading complete handler - no longer needed

  const handleClose = () => {
    setShowContent(false);
    setTimeout(onClose, 300);
  };

  // Get previous and next projects
  const currentIndex = allProjects.findIndex(
    (p) => p.id === project?.id,
  );
  const previousProject =
    currentIndex > 0
      ? allProjects[currentIndex - 1]
      : allProjects[allProjects.length - 1];
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : allProjects[0];

  const handleProjectNavigation = (targetProject: Project) => {
    if (onProjectSelect) {
      setShowContent(false);
      setTimeout(() => {
        onProjectSelect(targetProject);
      }, 300);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!project || !projectDetails) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Dynamic Meta Tags for Project Page */}
          <MetaTags 
            page="project" 
            project={project}
            ogImage={getParallaxHeroImage(project)}
          />
          
          {/* Main Content - Fixed Background Colors */}
          <motion.div
            className="fixed inset-0 z-60 overflow-y-auto"
            style={{
              backgroundColor: isLightMode
                ? "#F7EDDA"
                : "#000000", // Fixed colors that don't change during scroll
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            ref={containerRef}
          >
            <AnimatePresence>
              {showContent && (
                <>
                  {/* Header - Theme Aware */}
                  <Header onNavigate={handleClose} />

                  {/* Enhanced Hero Section - 85% SCREEN HEIGHT FOR PERFECT VISIBILITY */}
                  <motion.section
                    className="relative h-[85vh] project-hero-large"
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    {/* Parallax Background Image */}
                    <motion.div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        y: yParallax,
                        scale: scaleParallax,
                        opacity: opacityParallax,
                      }}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url(${getParallaxHeroImage(project)})`,
                          filter:
                            "brightness(0.8) contrast(1.1)",
                        }}
                      />
                    </motion.div>

                    {/* Enhanced Gradient Overlays - Theme Aware */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent light:from-venetian-lace light:via-venetian-lace/40 light:to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 light:from-venetian-lace/60 light:via-transparent light:to-venetian-lace/80" />

                    {/* Hero Content - Lower Positioning with Overflow Visible */}
                    <div className="absolute left-0 right-0 z-10 project-hero-content">
                      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
                        {/* Project Category */}
                        <motion.p
                          className="text-aurelius-gold light:text-fiery-glow text-sm md:text-base mb-4 tracking-wider"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            delay: 0.6,
                            duration: 0.8,
                          }}
                        >
                          {projectDetails.category}
                        </motion.p>

                        {/* Project Title */}
                        <motion.h1
                          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white light:text-fence-green mb-6 leading-tight"
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            delay: 0.7,
                            duration: 0.8,
                          }}
                        >
                          {projectDetails.title}
                        </motion.h1>

                        {/* Project Subtitle */}
                        <motion.p
                          className="text-xl md:text-2xl text-gray-300 light:text-norfolk-green mb-8 max-w-3xl mx-auto leading-relaxed"
                          initial={{ y: 40, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            delay: 0.8,
                            duration: 0.8,
                          }}
                        >
                          {projectDetails.subtitle}
                        </motion.p>

                        {/* Project Meta */}
                        <motion.div
                          className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 light:text-norfolk-green mb-8"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            delay: 0.9,
                            duration: 0.8,
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {projectDetails.team}
                          </span>
                          <span className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            {projectDetails.role}
                          </span>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                          className="flex flex-col sm:flex-row gap-4 justify-center"
                          initial={{ y: 40, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            delay: 1,
                            duration: 0.8,
                          }}
                        >
                          {projectDetails.projectUrl && (
                            <a
                              href={projectDetails.projectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-aurelius-gold light:bg-fiery-glow text-black hover:bg-aurelius-gold-light light:hover:bg-pumpkin-vapor transition-all duration-300 rounded-lg group"
                            >
                              <Globe className="w-5 h-5" />
                              <span>View Live Project</span>
                              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                          )}
                          <button
                            onClick={() =>
                              scrollToSection("project-details")
                            }
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-aurelius-gold light:border-fiery-glow text-aurelius-gold light:text-fiery-glow hover:bg-aurelius-gold light:hover:bg-fiery-glow hover:text-black transition-all duration-300 rounded-lg"
                          >
                            <Play className="w-5 h-5" />
                            <span>Explore Project</span>
                          </button>
                        </motion.div>

                        {/* Scroll Indicator - Positioned Below Buttons in Document Flow - Desktop Only */}
                        <motion.div
                          className="hidden lg:flex justify-center"
                          style={{ marginTop: '120px' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                        >
                          <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                            className="text-white light:text-fence-green"
                          >
                            <ChevronDown className="w-6 h-6" />
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.section>

                  {/* Breadcrumb Navigation & Back Button - Sticky Below Header */}
                  <motion.div
                    className="sticky z-50 py-6 px-6 sm:px-8 bg-black light:bg-venetian-lace border-b border-gray-800 light:border-macadamia-beige backdrop-blur-md"
                    style={{ top: '125px' }}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <div className="max-w-6xl mx-auto">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        {/* Breadcrumb Navigation */}
                        <Breadcrumb>
                          <BreadcrumbList>
                            <BreadcrumbItem>
                              <BreadcrumbLink
                                onClick={handleClose}
                                className="cursor-pointer inline-flex items-center gap-1.5 text-gray-400 light:text-norfolk-green hover:text-aurelius-gold light:hover:text-fiery-glow transition-colors"
                              >
                                <Home className="w-3.5 h-3.5" />
                                <span>Home</span>
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-gray-600 light:text-norfolk-green" />
                            <BreadcrumbItem>
                              <BreadcrumbLink
                                onClick={onViewAllProjects}
                                className="cursor-pointer inline-flex items-center gap-1.5 text-gray-400 light:text-norfolk-green hover:text-aurelius-gold light:hover:text-fiery-glow transition-colors"
                              >
                                <FolderOpen className="w-3.5 h-3.5" />
                                <span>All Projects</span>
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-gray-600 light:text-norfolk-green" />
                            <BreadcrumbItem>
                              <BreadcrumbPage className="text-white light:text-fence-green">
                                {projectDetails.title}
                              </BreadcrumbPage>
                            </BreadcrumbItem>
                          </BreadcrumbList>
                        </Breadcrumb>

                        {/* Back Button */}
                        <button
                          onClick={onViewAllProjects}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-aurelius-gold light:text-fiery-glow hover:text-aurelius-gold-light light:hover:text-pumpkin-vapor transition-all duration-300 group"
                        >
                          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          <span>Back to All Projects</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Project Details Section */}
                  <motion.section
                    id="project-details"
                    className="py-20 bg-black light:bg-venetian-lace relative"
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <div className="max-w-6xl mx-auto px-6 sm:px-8">
                      {/* Section Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                        {/* Left Column - Project Overview */}
                        <div className="lg:col-span-8">
                          <motion.div
                            className="mb-12"
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                          >
                            <h2 className="text-3xl md:text-4xl text-white light:text-fence-green mb-6">
                              Project Overview
                            </h2>
                            <p className="text-lg text-gray-300 light:text-norfolk-green leading-relaxed">
                              {projectDetails.overview}
                            </p>
                          </motion.div>

                          {/* Challenge */}
                          <motion.div
                            className="mb-12"
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.8,
                              delay: 0.1,
                            }}
                          >
                            <h3 className="text-2xl text-aurelius-gold light:text-fiery-glow mb-4 flex items-center gap-3">
                              <Target className="w-6 h-6" />
                              The Challenge
                            </h3>
                            <p className="text-gray-300 light:text-norfolk-green leading-relaxed">
                              {projectDetails.challenge}
                            </p>
                          </motion.div>

                          {/* Solution */}
                          <motion.div
                            className="mb-12"
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.8,
                              delay: 0.2,
                            }}
                          >
                            <h3 className="text-2xl text-aurelius-gold light:text-fiery-glow mb-4 flex items-center gap-3">
                              <Lightbulb className="w-6 h-6" />
                              The Solution
                            </h3>
                            <p className="text-gray-300 light:text-norfolk-green leading-relaxed">
                              {projectDetails.solution}
                            </p>
                          </motion.div>

                          {/* Impact */}
                          <motion.div
                            className="mb-12"
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.8,
                              delay: 0.3,
                            }}
                          >
                            <h3 className="text-2xl text-aurelius-gold light:text-fiery-glow mb-6 flex items-center gap-3">
                              <TrendingUp className="w-6 h-6" />
                              Project Impact
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {projectDetails.impact.map(
                                (item, index) => (
                                  <motion.div
                                    key={index}
                                    className="flex items-start gap-3 p-4 bg-gray-900/50 light:bg-macadamia-beige/50 rounded-lg border border-gray-800 light:border-macadamia-beige"
                                    initial={{
                                      x: -20,
                                      opacity: 0,
                                    }}
                                    whileInView={{
                                      x: 0,
                                      opacity: 1,
                                    }}
                                    viewport={{ once: true }}
                                    transition={{
                                      duration: 0.6,
                                      delay: index * 0.1,
                                    }}
                                  >
                                    <CheckCircle className="w-5 h-5 text-aurelius-gold light:text-fiery-glow mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-300 light:text-norfolk-green text-sm leading-relaxed">
                                      {item}
                                    </span>
                                  </motion.div>
                                ),
                              )}
                            </div>
                          </motion.div>
                        </div>

                        {/* Right Column - Project Meta */}
                        <div className="lg:col-span-4">
                          <div className="sticky top-8 space-y-8">
                            {/* Key Features */}
                            <motion.div
                              className="bg-gray-900/50 light:bg-macadamia-beige/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 light:border-macadamia-beige"
                              initial={{ x: 40, opacity: 0 }}
                              whileInView={{ x: 0, opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.8,
                                delay: 0.1,
                              }}
                            >
                              <h4 className="text-lg text-white light:text-fence-green mb-4">
                                Key Features
                              </h4>
                              <div className="space-y-2">
                                {projectDetails.features.map(
                                  (feature, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 text-sm text-gray-300 light:text-norfolk-green"
                                    >
                                      <div className={`w-1.5 h-1.5 rounded-full ${isLightMode ? 'bg-fiery-glow' : 'bg-aurelius-gold'}`} />
                                      {feature}
                                    </div>
                                  ),
                                )}
                              </div>
                            </motion.div>

                            {/* Technologies */}
                            <motion.div
                              className="bg-gray-900/50 light:bg-macadamia-beige/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 light:border-macadamia-beige"
                              initial={{ x: 40, opacity: 0 }}
                              whileInView={{ x: 0, opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.8,
                                delay: 0.2,
                              }}
                            >
                              <h4 className="text-lg text-white light:text-fence-green mb-4 flex items-center gap-2">
                                <Code className="w-5 h-5" />
                                Technologies
                              </h4>
                              <div className="space-y-3">
                                {projectDetails.technologies.map(
                                  (tech, index) => (
                                    <div
                                      key={index}
                                      className="border-l-2 border-aurelius-gold light:border-fiery-glow pl-3"
                                    >
                                      <div className="text-sm text-white light:text-fence-green font-medium">
                                        {tech.name}
                                      </div>
                                      <div className="text-xs text-gray-400 light:text-norfolk-green mt-1">
                                        {tech.description}
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>

                  {/* Call to Action Section */}
                  <motion.section
                    className="py-20 bg-black light:bg-f2b43b border-t border-gray-800 light:border-fence-green/20"
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
                      <motion.h3
                        className="text-2xl md:text-3xl text-white light:text-fence-green mb-4"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        Ready to Work Together?
                      </motion.h3>
                      <motion.p
                        className="text-base md:text-lg text-gray-400 light:text-norfolk-green mb-8 max-w-xl mx-auto"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        Let's create something extraordinary. Every project starts with a conversation.
                      </motion.p>
                      <motion.button
                        onClick={() => {
                          handleClose();
                          setTimeout(() => {
                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                          }, 400);
                        }}
                        className="px-8 py-4 rounded-lg transition-all duration-300 bg-aurelius-gold light:bg-fiery-glow text-black light:text-white hover:bg-aurelius-gold-light light:hover:bg-pumpkin-vapor"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Get In Touch
                      </motion.button>
                    </div>
                  </motion.section>

                  {/* Project Navigation */}
                  <motion.section
                    className="py-16 bg-gray-950 light:bg-macadamia-beige border-t border-gray-800 light:border-fence-green/20"
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="max-w-6xl mx-auto px-6 sm:px-8">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        {/* Previous Project */}
                        <motion.button
                          onClick={() =>
                            handleProjectNavigation(
                              previousProject,
                            )
                          }
                          className="group flex items-center gap-4 p-6 bg-gray-900 light:bg-venetian-lace rounded-lg border border-gray-800 light:border-macadamia-beige hover:border-aurelius-gold light:hover:border-fiery-glow transition-all duration-300 w-full md:w-auto"
                          whileHover={{ x: -5 }}
                        >
                          <ArrowLeft className="w-5 h-5 text-aurelius-gold light:text-fiery-glow group-hover:-translate-x-1 transition-transform" />
                          <div className="text-left">
                            <p className="text-xs text-gray-400 light:text-norfolk-green uppercase tracking-wider">
                              Previous
                            </p>
                            <p className="text-white light:text-fence-green font-medium">
                              {previousProject.title}
                            </p>
                          </div>
                        </motion.button>

                        {/* View All Projects */}
                        <motion.button
                          onClick={onViewAllProjects}
                          className="px-6 py-3 text-aurelius-gold light:text-fiery-glow border border-aurelius-gold light:border-fiery-glow rounded-lg hover:bg-aurelius-gold light:hover:bg-fiery-glow hover:text-black transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                        >
                          View All Projects
                        </motion.button>

                        {/* Next Project */}
                        <motion.button
                          onClick={() =>
                            handleProjectNavigation(nextProject)
                          }
                          className="group flex items-center gap-4 p-6 bg-gray-900 light:bg-venetian-lace rounded-lg border border-gray-800 light:border-macadamia-beige hover:border-aurelius-gold light:hover:border-fiery-glow transition-all duration-300 w-full md:w-auto"
                          whileHover={{ x: 5 }}
                        >
                          <div className="text-right">
                            <p className="text-xs text-gray-400 light:text-norfolk-green uppercase tracking-wider">
                              Next
                            </p>
                            <p className="text-white light:text-fence-green font-medium">
                              {nextProject.title}
                            </p>
                          </div>
                          <ArrowLeft className="w-5 h-5 text-aurelius-gold light:text-fiery-glow rotate-180 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.section>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
