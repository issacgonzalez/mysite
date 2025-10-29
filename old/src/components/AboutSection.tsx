import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';

export function AboutSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  
  // Theme detection for gradient overlay
  const [isLightMode, setIsLightMode] = useState(false);

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

  return (
    <section 
      id="about"
      ref={sectionRef}
      className="min-h-screen bg-black light:bg-venetian-lace py-24 relative overflow-hidden transition-colors duration-700"
    >
      {/* Gradient Transition Overlay - Seamlessly receives from Hero section */}
      <div
        className="absolute top-0 left-0 w-full h-24 z-5 pointer-events-none"
        style={{
          background: isLightMode 
            ? 'linear-gradient(to bottom, #f2b43b 0%, rgba(242, 180, 59, 0.8) 40%, rgba(242, 180, 59, 0.4) 70%, transparent 100%)'
            : 'linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.8) 40%, rgba(0, 0, 0, 0.4) 70%, transparent 100%)'
        }}
      />


      <div className="section-container relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section title - Centered */}
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl text-white mb-4">
              ABOUT
            </h2>
            <div className={`w-24 h-1 mx-auto ${isLightMode ? 'bg-fiery-glow' : 'bg-aurelius-gold'}`} />
          </motion.div>

          {/* Full width text content */}
          <motion.div
            className="max-w-4xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-8 text-center">
              <p className="text-2xl md:text-3xl text-gray-300 leading-relaxed">
                I'm a <span className="text-aurelius-gold">Web Developer</span> who 
                loves building things that look good and work well. Over the past 10+ years, I've designed and 
                developed Custom Built Websites, streamlined user experiences, and helped brands improve 
                engagement and performance online.
              </p>
              
              <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
                I'm hands-on with everything from front-end development and UI design to A/B testing and 
                optimization. My goal is always to create websites that not only meet business goals but 
                also feel intuitive and enjoyable to use.
              </p>

              <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                When I'm not working on client projects, I'm usually experimenting with new design ideas, 
                learning emerging web technologies, or creating art and visuals that push my creative boundaries.
              </p>
            </div>

            {/* Call to action */}
            <motion.div
              className="flex justify-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.a
                href="#contact"
                className="group inline-flex items-center text-aurelius-gold hover:text-white transition-all duration-300 text-xl px-8 py-4 border border-aurelius-gold/30 hover:border-aurelius-gold rounded-lg backdrop-blur-sm relative shadow-lg hover:shadow-aurelius-gold/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {/* Button content with proper contrast for each theme */}
                <span className={`relative z-20 transition-colors duration-300 font-medium ${
                  isLightMode 
                    ? 'group-hover:text-black' 
                    : 'group-hover:text-white'
                }`}>
                  Let's create something extraordinary
                </span>
                <motion.svg 
                  className={`w-6 h-6 ml-3 relative z-20 transition-all duration-300 ${
                    isLightMode 
                      ? 'group-hover:text-black' 
                      : 'group-hover:text-white'
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.a>
            </motion.div>
          </motion.div>

        </div>
      </div>
      
      {/* Additional floating pixels for About section */}
      <div className="absolute inset-0 pointer-events-none z-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`about-pixel-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              backgroundColor: isLightMode 
                ? 'rgba(0, 0, 0, 0.8)' 
                : 'rgba(248, 154, 28, 0.7)',
              imageRendering: 'pixelated',
              boxShadow: isLightMode 
                ? '0 0 8px rgba(0, 0, 0, 0.4)'
                : '0 0 10px rgba(248, 154, 28, 0.5)',
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, Math.sin(i) * 30, 0],
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.8, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    </section>
  );
}