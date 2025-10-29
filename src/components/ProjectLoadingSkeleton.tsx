import { memo } from 'react';
import { motion } from 'motion/react';

interface ProjectLoadingSkeletonProps {
  count?: number;
  isLightMode?: boolean;
}

export const ProjectLoadingSkeleton = memo(({ count = 9, isLightMode = false }: ProjectLoadingSkeletonProps) => {
  return (
    <>
      {/* Loading Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <div className={`h-12 md:h-16 w-32 mx-auto mb-4 rounded skeleton-loader ${
            isLightMode ? 'bg-macadamia-beige' : 'bg-gray-800'
          }`} />
          <div className={`h-12 md:h-16 w-48 mx-auto mb-8 rounded skeleton-loader ${
            isLightMode ? 'bg-fiery-glow/20' : 'bg-aurelius-gold/20'
          }`} />
        </div>
        
        <div className={`h-6 w-96 max-w-full mx-auto mb-4 rounded skeleton-loader ${
          isLightMode ? 'bg-macadamia-beige' : 'bg-gray-700'
        }`} />
        <div className={`h-6 w-80 max-w-full mx-auto mb-8 rounded skeleton-loader ${
          isLightMode ? 'bg-macadamia-beige' : 'bg-gray-700'
        }`} />
        
        <div className={`w-24 h-0.5 mx-auto rounded skeleton-loader ${
          isLightMode ? 'bg-fiery-glow/30' : 'bg-aurelius-gold/30'
        }`} />
      </motion.div>

      {/* Loading Categories */}
      <motion.div
        className="flex justify-center mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="flex gap-4 flex-wrap justify-center">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={`h-12 rounded-lg skeleton-loader ${
                index === 0 
                  ? isLightMode 
                    ? 'w-16 bg-fiery-glow/20' 
                    : 'w-16 bg-aurelius-gold/20'
                  : isLightMode
                    ? 'w-20 bg-macadamia-beige'
                    : 'w-20 bg-gray-700'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Loading Projects Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <ProjectCardSkeleton
            key={index}
            index={index}
            isLightMode={isLightMode}
          />
        ))}
      </motion.div>
    </>
  );
});

const ProjectCardSkeleton = memo(({ index, isLightMode }: { index: number; isLightMode: boolean }) => {
  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      style={{
        minHeight: '400px',
        overflow: 'visible'
      }}
    >
      {/* Main Card Container */}
      <div className="relative w-full min-h-[400px]" style={{ overflow: 'visible' }}>
        {/* Image Skeleton */}
        <div className="flex justify-center py-4">
          <div className={`relative h-80 w-4/5 rounded-lg skeleton-loader ${
            isLightMode ? 'bg-macadamia-beige' : 'bg-gray-800'
          }`} />
        </div>

        {/* Ribbon Skeleton */}
        <div 
          className={`absolute left-0 rounded-r skeleton-loader ${
            isLightMode ? 'bg-fiery-glow/30' : 'bg-aurelius-gold/30'
          }`}
          style={{
            top: '175px',
            width: '280px',
            height: '70px',
            zIndex: 2000
          }}
        >
          {/* Ribbon content skeleton */}
          <div className="flex flex-col justify-center h-full px-5">
            <div className={`h-3 w-16 mb-2 rounded skeleton-loader ${
              isLightMode ? 'bg-black/20' : 'bg-white/20'
            }`} />
            <div className={`h-4 w-32 rounded skeleton-loader ${
              isLightMode ? 'bg-black/30' : 'bg-white/30'
            }`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ProjectLoadingSkeleton.displayName = 'ProjectLoadingSkeleton';
ProjectCardSkeleton.displayName = 'ProjectCardSkeleton';
