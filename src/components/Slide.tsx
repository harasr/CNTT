import { motion } from 'motion/react';
import { SlideData } from '../data/slides';
import { SlideBackground } from './SlideBackground';
import { VideoSlide } from './VideoSlide';
import { 
  slideMotionVariants,
  containerVariants, 
  titleRevealVariants, 
  itemFadeUpVariants,
  pointSlideInVariants,
  imageEntranceVariants,
  floatVariants 
} from '../lib/animations';

interface Props {
  slide: SlideData;
  isActive?: boolean;
}

export function Slide({ slide, isActive = true }: Props) {
  if (slide.type === 'video') {
    return <VideoSlide slide={slide} isActive={isActive} />;
  }

  const getGlowClass = (color: string) => {
    switch(color) {
      case 'cyan': return 'text-glow-cyan';
      case 'purple': return 'text-glow-purple';
      case 'orange': return 'text-glow-orange';
      default: return 'text-glow-cyan';
    }
  };

  const getAccentColor = (color: string) => {
    switch(color) {
      case 'cyan': return 'text-neon-cyan';
      case 'purple': return 'text-neon-purple';
      case 'orange': return 'text-neon-orange';
      default: return 'text-neon-cyan';
    }
  };

  return (
    <motion.div 
      variants={slideMotionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden py-12"
    >
      <SlideBackground imageUrl={slide.bgImage} splitTheme={slide.id === 1} />
      
      <motion.div 
        className="relative z-10 w-full max-w-5xl xl:max-w-6xl 2xl:max-w-[1480px] mx-auto px-6 md:px-12 2xl:px-16 flex flex-col justify-center my-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {slide.type === 'title' && (
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              className={`text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight uppercase mb-4 2xl:mb-6 ${slide.id === 1 ? 'glitch' : ''} ${getGlowClass(slide.accentColor)}`}
              data-text={slide.title}
              variants={titleRevealVariants}
            >
              {slide.title.split('\n').map((line, i) => (
                <span key={i} className="block leading-tight">{line}</span>
              ))}
            </motion.h1>
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-300 font-sans tracking-wide mb-8 max-w-2xl mx-auto leading-relaxed"
              variants={itemFadeUpVariants}
            >
              {slide.subtitle}
            </motion.p>
            {slide.presenter && (
              <motion.div 
                className="inline-block glass-panel px-6 py-2.5 rounded-full text-xs sm:text-sm md:text-base text-gray-300 font-medium tracking-wider uppercase border border-white/10 shadow-lg"
                variants={itemFadeUpVariants}
              >
                Trình bày: <span className="text-white font-semibold">{slide.presenter}</span>
              </motion.div>
            )}
          </div>
        )}

        {(slide.type === 'content' || slide.type === 'toc') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
            <div className="w-full lg:col-span-7 flex flex-col justify-center">
              <motion.div 
                className="w-12 h-1 mb-3 2xl:mb-4 rounded-full" 
                style={{ backgroundColor: `var(--color-neon-${slide.accentColor})`, boxShadow: `0 0 10px var(--color-neon-${slide.accentColor})` }}
                variants={itemFadeUpVariants}
              />
              <motion.h2 
                className={`text-2xl sm:text-3xl md:text-4xl 2xl:text-[42px] font-display font-bold uppercase mb-3 2xl:mb-5 leading-tight ${getGlowClass(slide.accentColor)}`}
                variants={titleRevealVariants}
              >
                {slide.title}
              </motion.h2>

              {slide.subtitle && (
                <motion.p className="text-sm sm:text-base 2xl:text-lg text-gray-300 mb-3 2xl:mb-5 font-light leading-snug" variants={itemFadeUpVariants}>
                  {slide.subtitle}
                </motion.p>
              )}
              
              {slide.points && (
                <ul className={slide.type === 'toc' ? "grid grid-cols-1 sm:grid-cols-2 gap-2.5 2xl:gap-3" : "space-y-2.5 2xl:space-y-3.5"}>
                  {slide.points.map((point, index) => (
                    <motion.li 
                      key={index}
                      className={`glass-card rounded-xl flex items-start space-x-3 border-l-4 ${
                        slide.type === 'toc' ? 'p-2.5 2xl:p-3 items-center' : 'p-3 2xl:p-3.5'
                      }`}
                      style={{ borderLeftColor: `var(--color-neon-${slide.accentColor})` }}
                      variants={pointSlideInVariants}
                    >
                      <span className={`text-base 2xl:text-lg font-display font-bold ${getAccentColor(slide.accentColor)} opacity-80 shrink-0`}>
                        0{index + 1}.
                      </span>
                      <p className={`text-gray-100 font-sans ${
                        slide.type === 'toc' ? 'text-xs sm:text-sm 2xl:text-base leading-snug font-medium' : 'text-xs sm:text-sm md:text-base 2xl:text-lg leading-relaxed'
                      }`}>
                        {point}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              )}

              {slide.highlightMessage && (
                <motion.div 
                  className="mt-3.5 2xl:mt-5 p-3 2xl:p-4 glass-panel rounded-xl text-xs sm:text-sm md:text-base 2xl:text-lg font-medium italic text-center border border-white/10"
                  variants={itemFadeUpVariants}
                  animate="animate"
                  // @ts-ignore
                  whileHover={{ scale: 1.01 }}
                >
                  <span className={getGlowClass(slide.accentColor)}>"{slide.highlightMessage}"</span>
                </motion.div>
              )}
            </div>

            {/* Right side floating visual or Content Image with entrance animation */}
            <div className="flex w-full lg:col-span-5 justify-center items-center mt-2 lg:mt-0">
              <motion.div
                variants={imageEntranceVariants}
                className="relative w-full max-w-sm md:max-w-md lg:max-w-none aspect-[16/10] xl:aspect-[4/3] 2xl:aspect-[16/10] max-h-[280px] xl:max-h-[340px] 2xl:max-h-[380px] flex items-center justify-center"
              >
                <motion.div 
                  className="absolute inset-0 rounded-2xl blur-3xl opacity-25 pointer-events-none" 
                  style={{ backgroundColor: `var(--color-neon-${slide.accentColor})` }}
                  animate={{ opacity: [0.18, 0.32, 0.18], scale: [0.95, 1.05, 0.95] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                />
                
                {slide.contentImage ? (
                  <div 
                    className="relative w-full h-full p-2 glass-panel rounded-2xl overflow-hidden border border-white/20 shadow-2xl group" 
                    style={{ boxShadow: `0 0 30px var(--color-neon-${slide.accentColor})35` }}
                  >
                    <img 
                      src={slide.contentImage} 
                      alt={slide.title}
                      className="w-full h-full object-cover rounded-xl brightness-100 contrast-105 transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none rounded-2xl" />
                  </div>
                ) : (
                  <div className="glass-panel w-52 h-52 rounded-full border border-white/20 backdrop-blur-2xl flex items-center justify-center p-6">
                    <div className="w-3/4 h-3/4 rounded-full border border-dashed border-white/30 animate-[spin_20s_linear_infinite]" />
                    <div className="absolute w-1/2 h-1/2 rounded-full border border-white/50 animate-[spin_15s_linear_infinite_reverse]" style={{ borderColor: `var(--color-neon-${slide.accentColor})` }} />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}

        {slide.type === 'end' && (
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className={`text-5xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight uppercase mb-4 ${getGlowClass(slide.accentColor)}`}
              variants={titleRevealVariants}
            >
              {slide.title}
            </motion.h1>
            <motion.p 
              className="text-base sm:text-xl md:text-2xl text-gray-300 font-sans tracking-wide mb-8"
              variants={itemFadeUpVariants}
            >
              {slide.subtitle}
            </motion.p>
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-panel"
              variants={itemFadeUpVariants}
              whileHover={{ scale: 1.1, boxShadow: `0 0 30px var(--color-neon-${slide.accentColor})` }}
            >
               <span className={`text-2xl ${getAccentColor(slide.accentColor)}`}>✦</span>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
