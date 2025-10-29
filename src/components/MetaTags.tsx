import { Helmet } from 'react-helmet-async';
import { Project } from './data/projectsData';
import logo from "@/assets/3e86aa81af9c5b0aa8b596a81d9f4369488b7118.png";

interface MetaTagsProps {
  page?: 'home' | 'project' | 'all-projects' | 'dynamic-convergence';
  project?: Project | null;
  ogImage?: string;
}

export function MetaTags({ page = 'home', project, ogImage }: MetaTagsProps) {
  // Default meta information
  const defaultTitle = "Issac Gonzalez - Web Developer Portfolio";
  const defaultDescription = "Professional web developer portfolio showcasing innovative projects, creative design solutions, and cutting-edge web applications.";
  const defaultOgImage = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop"; // Coding workspace image
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // Dynamic content based on page type
  let title = defaultTitle;
  let description = defaultDescription;
  let ogImageUrl = ogImage || defaultOgImage;
  let canonicalUrl = siteUrl;
  let pageType = 'website';

  if (page === 'project' && project) {
    title = `${project.title} - Issac Gonzalez Portfolio`;
    description = project.description || `View ${project.title}, a web development project by Issac Gonzalez showcasing ${project.category} expertise.`;
    canonicalUrl = `${siteUrl}#project-${project.id}`;
    pageType = 'article';
  } else if (page === 'all-projects') {
    title = "All Projects - Issac Gonzalez Portfolio";
    description = "Explore the complete collection of web development projects by Issac Gonzalez, featuring innovative design solutions and cutting-edge applications.";
    canonicalUrl = `${siteUrl}#portfolio`;
  } else if (page === 'dynamic-convergence') {
    title = "Dynamic Convergences - Issac Gonzalez";
    description = "Experience interactive dynamic convergences - an experimental digital art piece by Issac Gonzalez.";
    canonicalUrl = `${siteUrl}#dynamic-convergences`;
  }

  // Structured Data (JSON-LD)
  const getStructuredData = () => {
    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Issac Gonzalez",
      "jobTitle": "Web Developer",
      "url": siteUrl,
      "sameAs": [
        // Add social media links here when available
      ],
      "description": defaultDescription
    };

    if (page === 'project' && project) {
      return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": project.title,
        "description": project.description,
        "creator": {
          "@type": "Person",
          "name": "Issac Gonzalez"
        },
        "dateCreated": project.year,
        "genre": project.category,
        "url": canonicalUrl
      };
    }

    if (page === 'home') {
      return {
        ...baseStructuredData,
        "@type": ["Person", "WebSite"],
        "WebSite": {
          "@type": "WebSite",
          "name": "Issac Gonzalez Portfolio",
          "url": siteUrl,
          "description": defaultDescription,
          "author": {
            "@type": "Person",
            "name": "Issac Gonzalez"
          }
        }
      };
    }

    return baseStructuredData;
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="author" content="Issac Gonzalez" />
      <meta name="keywords" content="web developer, portfolio, React, JavaScript, TypeScript, web design, frontend development, UI/UX, Issac Gonzalez" />
      <meta name="generator" content="" />
      
      {/* Favicon */}
      <link rel="icon" type="image/png" href={logo} />
      <link rel="apple-touch-icon" href={logo} />
      <link rel="shortcut icon" href={logo} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={pageType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Issac Gonzalez Portfolio" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      
      {/* Additional Meta Tags for Projects */}
      {page === 'project' && project && (
        <>
          <meta property="article:author" content="Issac Gonzalez" />
          <meta property="article:published_time" content={project.year} />
          <meta property="article:tag" content={project.category} />
        </>
      )}
      
      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
    </Helmet>
  );
}
