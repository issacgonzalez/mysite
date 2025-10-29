import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  Briefcase,
  GraduationCap,
  Zap,
  Rocket,
  ExternalLink,
  Download,
} from "lucide-react";

const ExperienceItem = ({
  title,
  company,
  period,
  description,
  technologies,
  index,
}: {
  title: string;
  company: string;
  period: string;
  description: string[];
  technologies: string[];
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

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

  return (
    <motion.div
      className="relative mb-12 group"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Timeline dot */}
      <motion.div
        className="absolute left-0 top-2 w-4 h-4 bg-aurelius-gold rounded-full border-4 border-black light:border-background z-10 transition-colors duration-300"
        animate={{
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Timeline line */}
      <div className="absolute left-2 top-6 w-0.5 h-full bg-gradient-to-b from-aurelius-gold via-aurelius-gold/50 to-transparent" />

      {/* Content - REVERTED TO ORIGINAL STYLING */}
      <div className="ml-12 relative">
        <motion.div
          className="border border-gray-800/50 light:border-border rounded-lg p-6 relative overflow-hidden transition-all duration-300"
          whileHover={{
            scale: 1.02,
            borderColor: "var(--aurelius-gold)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="relative z-10 mb-4">
            <motion.h3
              className="text-xl text-white light:text-foreground mb-1 transition-colors duration-300"
              whileHover={{ color: "var(--aurelius-gold)" }}
            >
              {title}
            </motion.h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <motion.p
                className="text-aurelius-gold transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                {company}
              </motion.p>
              <span className="text-gray-400 light:text-muted-foreground text-sm transition-colors duration-300">
                {period}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="relative z-10 mb-4">
            {description.map((item, i) => (
              <motion.p
                key={i}
                className="text-gray-300 light:text-muted-foreground mb-2 leading-relaxed transition-colors duration-300"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + i * 0.1 }}
                viewport={{ once: true }}
              >
                • {item}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const EducationItem = ({
  degree,
  school,
  period,
  details,
  index,
}: {
  degree: string;
  school: string;
  period: string;
  details?: string[];
  index: number;
}) => {
  return (
    <motion.div
      className="relative p-6 border border-gray-800/50 light:border-border rounded-lg transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{
        scale: 1.02,
        borderColor: "var(--aurelius-gold)",
      }}
    >
      <h3 className="text-lg text-white light:text-foreground mb-1 transition-colors duration-300">
        {degree}
      </h3>
      <p className="text-aurelius-gold mb-1">{school}</p>
      <p className="text-gray-400 light:text-muted-foreground text-sm mb-3 transition-colors duration-300">
        {period}
      </p>
      {details && (
        <ul className="text-gray-300 light:text-muted-foreground text-sm space-y-1 transition-colors duration-300">
          {details.map((detail, i) => (
            <li key={i}>• {detail}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

const SkillCategory = ({
  title,
  skills,
  index,
}: {
  title: string;
  skills: string[];
  index: number;
}) => {
  const [isLightMode, setIsLightMode] = useState(false);

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

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <motion.h3
        className="text-lg text-aurelius-gold mb-4 relative inline-block"
        whileHover={{ scale: 1.05 }}
      >
        {title}
        <motion.div
          className={`absolute bottom-0 left-0 h-0.5 ${isLightMode ? "bg-fiery-glow" : "bg-aurelius-gold"}`}
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{
            delay: index * 0.1 + 0.3,
            duration: 0.8,
          }}
          viewport={{ once: true }}
        />
      </motion.h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {skills.map((skill, i) => (
          <motion.div
            key={i}
            className="text-gray-300 light:text-muted-foreground text-sm py-2 px-3 border border-gray-700 light:border-border rounded transition-all duration-300"
            whileHover={{
              scale: 1.05,
              borderColor: "var(--aurelius-gold)",
              color: "var(--aurelius-gold)",
            }}
            transition={{ duration: 0.2 }}
          >
            {skill}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const ProjectItem = ({
  title,
  description,
  url,
  category,
  index,
}: {
  title: string;
  description: string;
  url: string;
  category: string;
  index: number;
}) => {
  return (
    <motion.div
      className="relative p-6 border border-gray-800/50 light:border-border rounded-lg group transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{
        scale: 1.02,
        borderColor: "var(--aurelius-gold)",
      }}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <motion.h3
            className="text-lg text-white light:text-foreground group-hover:text-aurelius-gold transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            {title}
          </motion.h3>
          <motion.span
            className="text-xs text-aurelius-gold border border-aurelius-gold/30 px-2 py-1 rounded"
            whileHover={{ scale: 1.1 }}
          >
            {category}
          </motion.span>
        </div>

        <p className="text-gray-300 light:text-muted-foreground mb-4 text-sm leading-relaxed transition-colors duration-300">
          {description}
        </p>

        <motion.a
          href={`https://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-aurelius-gold hover:text-aurelius-gold-light transition-colors duration-300 text-sm"
          whileHover={{ scale: 1.05, x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <ExternalLink size={16} />
          {url}
        </motion.a>
      </div>
    </motion.div>
  );
};

export function ResumeSection() {
  const [activeTab, setActiveTab] = useState<
    "experience" | "education" | "skills" | "projects"
  >("experience");
  const [isLightMode, setIsLightMode] = useState(false);

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

  // Your actual resume experience
  const experience = [
    {
      title: "Front-End Dev Specialist",
      company: "General Services Administration (GSA)",
      period: "Oct 2024 - April 2025",
      description: [
        "Provide support for content management and content design across GSA web properties",
        "Update and maintain website content, including checking links, adding/removing files, and refreshing explore pages",
        "Conduct comprehensive quality assurance reviews to identify and correct errors in spelling, punctuation, and adherence to web style guidelines",
        "Ensure all user interfaces meet Section 508 Accessibility and W3C standards for cross-browser and mobile compatibility",
        "Follow established usability, accessibility, and style-guide protocols, incorporating web content best practices",
      ],
      technologies: [
        "HTML",
        "CSS",
        "JavaScript",
        "Section 508",
        "W3C Standards",
        "ADA Compliance",
        "Drupal",
      ],
    },
    {
      title: "Senior Front End Web Developer",
      company: "Academic Partnerships",
      period: "Oct 2018 - May 2024",
      description: [
        "Built and maintained custom WordPress websites that enhanced functionality, user engagement, and lead generation across multiple higher education brands.",
        "Collaborated with cross-functional teams using C#, JavaScript, PHP, and modern front-end frameworks to create interactive and accessible user experiences.",
        "Led the migration of legacy ASP.NET and static sites to WordPress environments, improving performance, usability, and long-term maintainability.",
        "Implemented SASS-based styling architecture and component-driven development to standardize design systems, streamline maintenance, and support scalable multi-site deployments.",
        "Executed front-end initiatives under tight deadlines while maintaining rigorous quality assurance, performance optimization, and cross-browser compatibility.",
        "Applied A/B testing and data-driven optimization strategies to improve conversions and user satisfaction.",
        "Designed responsive, accessible email templates that increased engagement and supported marketing initiatives.",
        "Partnered with UX designers and content teams to ensure Section 508 compliance, consistent branding, and seamless integration with enterprise content management systems.",
      ],
      technologies: [
        "WordPress",
        "C#",
        "JavaScript",
        "PHP",
        "A/B Testing",
        "Email Design",
        "Cross-browser QA",
        "Git",
        "Email Campaigns",
      ],
    },
    {
      title: "Front End Web Developer",
      company: "Jacober Creative",
      period: "Jan 2010 - Aug 2018",
      description: [
        "Built and maintained client websites, converting Photoshop designs into precise HTML and CSS",
        "Integrated CMS for new and existing sites, streamlining content management for clients",
        "Trained staff on CMS usage to boost workflow efficiency and reduce reliance on external support",
        "Performed quality assurance and debugging to fix browser issues and improve site performance",
        "Created weekly email campaigns for local businesses, increasing engagement and sales",
      ],
      technologies: [
        "HTML",
        "CSS",
        "Photoshop",
        "CMS Integration",
        "Email Campaigns",
        "Quality Assurance",
      ],
    },
  ];

  const education = [
    {
      degree: "Trusted Tester Certification",
      school: "U.S. Department of Homeland Security",
      period: "December 2024",
      details: [
        "Specialized certification in Section 508 accessibility testing",
        "Expert-level training in ADA compliance and web accessibility standards",
        "Advanced skills in assistive technology testing and evaluation",
      ],
    },
    {
      degree: "Digital Marketing",
      school: "Miami Institute of Art and Design",
      period: "October 2005 - January 2007",
      details: [
        "Comprehensive program in digital marketing strategies and design",
        "Focus on creative design principles and marketing applications",
        "Hands-on experience with industry-standard design tools and methodologies",
      ],
    },
  ];

  const skillCategories = [
    {
      title: "Languages & Frameworks",
      skills: [
        "HTML",
        "CSS",
        "SASS",
        "JavaScript",
        "jQuery",
        "PHP",
        "C#",
        "React",
        "Node.js",
        "Tailwind CSS",
      ],
    },
    {
      title: "CMS Platforms",
      skills: [
        "WordPress",
        "Drupal",
        "Shopify",
        "Custom CMS Builds",
      ],
    },
    {
      title: "Tools & Workflows",
      skills: [
        "Git",
        "npm",
        "Gulp",
        "Visual Studio",
        "Webflow",
        "ADA Compliance",
        "Section 508",
        "W3C Standards",
      ],
    },
    {
      title: "Design & Creative",
      skills: [
        "Figma",
        "Photoshop",
        "Illustrator",
        "InDesign",
        "XD",
        "Premiere Pro",
        "After Effects",
      ],
    },
  ];

  const projects = [
    // University Projects - Sorted by name
    {
      title: "Arkansas State MBA Program",
      description:
        "Advanced MBA program landing page with interactive elements and lead generation optimization.",
      url: "degree.astate.edu/online/bus-mba-asp2-230310",
      category: "University",
    },
    {
      title: "Arkansas State University",
      description:
        "Complete university website redesign focusing on user experience and academic program presentation.",
      url: "degree.astate.edu",
      category: "University",
    },
    {
      title: "Lamar Business Programs",
      description:
        "Specialized landing pages for business administration and accounting programs with optimized conversion paths.",
      url: "degree.lamar.edu/online/bus-busadmin-sap1-210702/",
      category: "University",
    },
    {
      title: "Lamar University",
      description:
        "Built and maintained university degree program pages with comprehensive information architecture and responsive design.",
      url: "degree.lamar.edu",
      category: "University",
    },
    {
      title: "Texas A&M International",
      description:
        "Modern university website with focus on online education programs and student engagement.",
      url: "online.tamiu.edu",
      category: "University",
    },
    {
      title: "University of Texas at Arlington",
      description:
        "Comprehensive university website with advanced online degree program pages and student resources.",
      url: "uta.edu",
      category: "University",
    },
    // Local Business Projects - Sorted by name
    {
      title: "Artesano",
      description:
        "Artisan marketplace platform showcasing handcrafted goods with e-commerce integration and artist portfolio management.",
      url: "artesano.net",
      category: "Local business",
    },
    {
      title: "Exodus Construction",
      description:
        "Professional construction company website featuring project galleries, service portfolios, and client testimonials with responsive design.",
      url: "exodusconstruction.net",
      category: "Local business",
    },
    {
      title: "Pizza Rox",
      description:
        "Dynamic pizza restaurant website with online ordering system, menu management, and customer engagement features.",
      url: "pizzarox.com",
      category: "Local business",
    },
  ];

  const tabs = [
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Zap },
    { id: "projects", label: "Projects", icon: Rocket },
    {
      id: "education",
      label: "Education",
      icon: GraduationCap,
    },
  ] as const;

  return (
    <section
      id="resume"
      className="relative min-h-screen bg-black light:bg-background py-20 overflow-hidden transition-colors duration-300"
    >
      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          {/* FIXED: Flipped colors - PROFESSIONAL is now white/black, EXPERIENCE is gold */}
          <motion.h2 className="text-5xl md:text-6xl lg:text-7xl tracking-tighter mb-6 text-white light:text-foreground transition-colors duration-300">
            PROFESSIONAL
          </motion.h2>

          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl tracking-tighter mb-6 bg-gradient-to-r from-aurelius-gold via-aurelius-gold-light to-aurelius-gold bg-clip-text text-transparent"
            style={{
              backgroundSize: "200% 200%",
            }}
            animate={{
              backgroundPosition: [
                "0% 50%",
                "100% 50%",
                "0% 50%",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            EXPERIENCE
          </motion.h2>

          {/* HR Line to match other sections */}
          <motion.div
            className={`w-24 h-1 mx-auto mb-8 ${isLightMode ? "bg-fiery-glow" : "bg-aurelius-gold"}`}
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <motion.p
            className="text-xl text-gray-300 light:text-muted-foreground max-w-2xl mx-auto transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
          >
            A comprehensive overview of my professional journey,
            skills, and educational background in digital
            innovation.
          </motion.p>
        </motion.div>

        {/* Tab Navigation - Mobile: 2x2 Grid, Desktop: Horizontal Row */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:flex border border-gray-800 light:border-border rounded-lg p-2 gap-1 md:gap-0 transition-colors duration-300">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`px-4 md:px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center md:justify-start gap-2 ${
                  activeTab === tab.id
                    ? "bg-aurelius-gold text-black"
                    : "text-gray-300 light:text-muted-foreground hover:text-aurelius-gold"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={16} />
                <span className="hidden sm:inline md:inline">
                  {tab.label}
                </span>
                <span className="sm:hidden">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === "experience" && (
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {experience.map((exp, index) => (
                  <ExperienceItem
                    key={index}
                    {...exp}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="max-w-3xl mx-auto">
              <div className="grid gap-6">
                {education.map((edu, index) => (
                  <EducationItem
                    key={index}
                    {...edu}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {skillCategories.map((category, index) => (
                  <SkillCategory
                    key={index}
                    {...category}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <ProjectItem
                    key={index}
                    {...project}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Download Resume CTA */}
         <a href="https://drive.google.com/file/d/140L7CC5qGopTNZ79LAabxiut9Hpf-Aa7/view?usp=sharing" target="_blank">
          <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
        >
            <motion.button
              className="group relative px-8 py-4 bg-transparent border-2 border-aurelius-gold text-aurelius-gold"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <span className="relative z-20 text-base tracking-wider font-medium transition-colors duration-500 flex items-center gap-2">
                <Download size={16} />
               DOWNLOAD FULL RESUME
              </span>
            </motion.button>
          </motion.div>
         </a>
      </div>
    </section>
  );
}