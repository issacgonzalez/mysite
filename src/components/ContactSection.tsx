import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function ContactSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isLightMode, setIsLightMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    try {
      console.log('Submitting contact form:', { name: formData.name, email: formData.email });
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-928859b8/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('Response result:', result);

      if (response.ok && result.success) {
        setSubmitMessage({ type: 'success', text: result.message });
        setFormData({ name: '', email: '', message: '' }); // Clear form
        
        // Clear success message after 5 seconds
        setTimeout(() => setSubmitMessage(null), 5000);
      } else {
        console.error('Form submission failed:', result);
        
        // Show detailed error for API key issues
        let errorMessage = result.message || result.details || result.error || 'Failed to send message. Please try again.';
        
        // Add debug info to console for admin
        if (result.debugInfo) {
          console.error('🔧 ADMIN DEBUG:', result.debugInfo);
        }
        
        setSubmitMessage({ 
          type: 'error', 
          text: errorMessage
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitMessage({ 
        type: 'error', 
        text: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      label: 'Email',
      value: 'issacngonzalez@gmail.com',
      link: 'mailto:issacngonzalez@gmail.com'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
        </svg>
      ),
      label: 'LinkedIn',
      value: '/in/gonzalezissac',
      link: 'https://www.linkedin.com/in/gonzalezissac/'
    }
  ];

  return (
    <section 
      id="contact"
      ref={sectionRef}
      className="min-h-screen bg-black light:bg-white py-24 relative overflow-hidden transition-colors duration-300"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-3 light:opacity-2">
        <div 
          className="absolute inset-0 animate-grid-pulse" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(248, 154, 28, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(248, 154, 28, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-8">
          {/* Section header */}
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl text-white light:text-black mb-6 transition-colors duration-300">
              READY TO
            </h2>
            <h2 className="text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-aurelius-gold to-aurelius-gold-light -mt-4 mb-8">
              COLLABORATE?
            </h2>
            <p className="text-lg text-gray-400 light:text-gray-600 max-w-2xl mx-auto transition-colors duration-300">
              Have an idea you're passionate about? I'd love to hear about it. 
              Let's bring your vision to life together.
            </p>
            <div className={`w-24 h-1 mx-auto mt-6 ${isLightMode ? 'bg-fiery-glow' : 'bg-aurelius-gold'}`} />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact form - REVERTED TO FLAT DESIGN */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-xl text-aurelius-gold mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6">
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-700 light:border-gray-300 text-white light:text-black placeholder-gray-500 light:placeholder-gray-400 focus:border-aurelius-gold focus:outline-none transition-colors duration-200"
                      required
                    />
                  </motion.div>

                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-700 light:border-gray-300 text-white light:text-black placeholder-gray-500 light:placeholder-gray-400 focus:border-aurelius-gold focus:outline-none transition-colors duration-200"
                      required
                    />
                  </motion.div>

                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-700 light:border-gray-300 text-white light:text-black placeholder-gray-500 light:placeholder-gray-400 focus:border-aurelius-gold focus:outline-none transition-colors duration-200 resize-none"
                      required
                    />
                  </motion.div>
                </div>

                {/* Success/Error Message */}
                {submitMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border ${
                      submitMessage.type === 'success' 
                        ? 'bg-green-900/20 border-green-500/30 text-green-400' 
                        : 'bg-red-900/20 border-red-500/30 text-red-400'
                    }`}
                  >
                    {submitMessage.text}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`group relative px-8 py-4 bg-aurelius-gold text-black overflow-hidden transition-opacity ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 group-hover:text-black transition-colors duration-300 flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        SENDING...
                      </>
                    ) : (
                      'SEND MESSAGE'
                    )}
                  </span>
                </motion.button>
              </form>
            </motion.div>

            {/* Contact methods - REVERTED TO FLAT DESIGN */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl text-aurelius-gold mb-6">Get In Touch</h3>
              
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <motion.a
                    key={method.label}
                    href={method.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center py-4 border-b border-gray-800/30 light:border-gray-200/50 hover:border-aurelius-gold/50 transition-all duration-200"
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="text-gray-500 light:text-gray-600 mr-4 group-hover:text-aurelius-gold transition-colors duration-200">
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white light:text-black group-hover:text-aurelius-gold transition-colors duration-200 text-sm font-medium">
                        {method.label}
                      </h4>
                      <p className="text-gray-400 light:text-gray-600 group-hover:text-aurelius-gold-light transition-colors duration-200 text-sm">
                        {method.value}
                      </p>
                    </div>
                    <svg 
                      className="w-4 h-4 text-gray-600 light:text-gray-400 group-hover:text-aurelius-gold group-hover:translate-x-1 transition-all duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </motion.a>
                ))}
              </div>

              {/* Availability info - REVERTED TO FLAT STYLE */}
              <motion.div
                className="mt-8 p-4 border-l-2 border-aurelius-gold/30"
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <p className="text-aurelius-gold text-sm leading-relaxed">
                  Currently available for freelance projects and full-time opportunities. 
                  Based in the US, working globally across all timezones.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Additional floating pixels for Contact section */}
      <div className="absolute inset-0 pointer-events-none z-1">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={`contact-pixel-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              backgroundColor: isLightMode 
                ? 'rgba(0, 0, 0, 0.8)' 
                : 'rgba(248, 154, 28, 0.7)',
              imageRendering: 'pixelated',
              boxShadow: isLightMode 
                ? '0 0 10px rgba(0, 0, 0, 0.5)'
                : '0 0 12px rgba(248, 154, 28, 0.6)',
            }}
            animate={{
              y: [0, -65, 0],
              x: [0, Math.tan(i) * 20, 0],
              opacity: [0.4, 0.9, 0.4],
              scale: [1, 1.9, 1],
              rotate: [0, -360]
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    </section>
  );
}
