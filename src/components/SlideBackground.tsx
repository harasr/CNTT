import { motion } from 'motion/react';
import { bgVariants } from '../lib/animations';

interface Props {
  imageUrl: string;
  splitTheme?: boolean;
}

export function SlideBackground({ imageUrl, splitTheme }: Props) {
  return (
    <motion.div
      variants={bgVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute inset-0 z-0 overflow-hidden"
    >
      <img
        src={imageUrl}
        alt="Background"
        className="absolute w-full h-full object-cover"
      />
      
      {/* Base Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Optional Split Theme (Warm vs Cold) for Slide 1 */}
      {splitTheme ? (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/50 via-black/40 to-blue-900/60 mix-blend-multiply" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#050508]" />
      )}
      
      {/* Tech Grid Overlay Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </motion.div>
  );
}
