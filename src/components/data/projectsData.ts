import lamarHeroImage from "@/assets/1f01804b7476e2b99aa0486154dfcb2676daa967.png";
import vixenParallaxHero from "@/assets/f4988d593e5d0a5a5c6b3d3f197e085c27f519bb.png";
import arkansasStateHeroImage from "@/assets/4f4b0723283e65a70e32f4e82d1ac7afaa29ad47.png";
import texasAMInternationalHeroImage from "@/assets/14a10daf6e8aac2b19bfebf5923d40008e6ddc6f.png";
import utaHeroImage from "@/assets/6dda4674f46466ee6ae6d23a36158ef2bf86c812.png";
import pizzaRoxHeroImage from "@/assets/5cabc62aee9b68097042853eb4755041c014d4b8.png";
import artesanoHeroImage from "@/assets/5a9e341f80b08d29e35e6b75f11bb9369d6ad195.png";
import exodusHeroImage from "@/assets/e7b2c25d53575b986e6d55f65fa7821672046c7a.png";

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  url?: string;
  image?: string;
}

// Category order for sorting
const categoryOrder = {
  "Fitness & Wellness": 1,
  "Education": 2,
  "Local Business": 3
};

// Raw projects data
const rawProjects: Project[] = [
  {
    id: 1,
    title: "Lamar University",
    category: "Education",
    description: "Complete digital transformation of university degree program pages with advanced search capabilities, interactive program pathways, and seamless enrollment integration.",
    tech: ["WordPress", "PHP", "JavaScript", "CSS", "MySQL"],
    url: "degree.lamar.edu",
    image: lamarHeroImage
  },
  {
    id: 2,
    title: "Vixen Workout",
    category: "Fitness & Wellness",
    description: "Revolutionary fitness platform combining immersive workout experiences with cutting-edge web technologies. Features dynamic motion design and community engagement tools.",
    tech: ["React", "Node.js", "WebGL", "Motion Design"],
    url: "vixenworkout.com",
    image: vixenParallaxHero
  },
  {
    id: 3,
    title: "Arkansas State University",
    category: "Education", 
    description: "Modern university website redesign focusing on user experience and academic program presentation. Implemented comprehensive content management system.",
    tech: ["WordPress", "PHP", "JavaScript", "CSS"],
    url: "https://degree.astate.edu",
    image: arkansasStateHeroImage
  },
  {
    id: 4,
    title: "Texas A&M International",
    category: "Education",
    description: "Modern university platform focusing on online education programs and student engagement. Features advanced program finder and application management system.",
    tech: ["WordPress", "PHP", "JavaScript", "CSS"],
    url: "online.tamiu.edu",
    image: texasAMInternationalHeroImage
  },
  {
    id: 5,
    title: "Exodus Construction",
    category: "Local Business",
    description: "Professional construction company website featuring dynamic project galleries, service portfolios, client testimonials, and responsive design optimized for lead generation.",
    tech: ["PHP", "JavaScript", "CSS", "MySQL"],
    url: "exodusconstruction.net",
    image: exodusHeroImage
  },
  {
    id: 6,
    title: "Pizza Rox",
    category: "Local Business",
    description: "Dynamic restaurant website with integrated online ordering system, interactive menu management, customer engagement features, and mobile-optimized design.",
    tech: ["WordPress", "PHP", "JavaScript", "CSS"],
    url: "pizzarox.com",
    image: pizzaRoxHeroImage
  },
  {
    id: 7,
    title: "Artesano",
    category: "Local Business", 
    description: "Sophisticated artisan marketplace showcasing handcrafted goods with integrated e-commerce functionality, artist portfolio management, and immersive product galleries.",
    tech: ["Shopify", "Liquid", "JavaScript", "CSS", "Shopify API"],
    url: "https://artesano.net",
    image: artesanoHeroImage
  },
  {
    id: 8,
    title: "UTA",
    category: "Education",
    description: "Comprehensive online education platform for University of Texas at Arlington, featuring academic partnerships, program discovery tools, and streamlined enrollment pathways for distance learners.",
    tech: ["WordPress", "PHP", "JavaScript", "CSS", "Academic CRM"],
    url: "academicpartnerships.uta.edu",
    image: utaHeroImage
  }
];

// Sort projects by category (Fitness & Wellness, Education, Local Business), then alphabetically within each category
export const allProjects: Project[] = rawProjects.sort((a, b) => {
  const categoryA = categoryOrder[a.category as keyof typeof categoryOrder] || 999;
  const categoryB = categoryOrder[b.category as keyof typeof categoryOrder] || 999;
  
  // First sort by category
  if (categoryA !== categoryB) {
    return categoryA - categoryB;
  }
  
  // Then sort alphabetically within the same category
  return a.title.localeCompare(b.title);
});
