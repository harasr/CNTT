import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
}

export function Navigation({ currentSlide, totalSlides, onNext, onPrev }: Props) {
  return (
    <div className="fixed bottom-8 left-0 w-full flex items-center justify-between px-8 md:px-16 z-50 pointer-events-none">
      
      {/* Progress indicator */}
      <div className="flex items-center space-x-3 pointer-events-auto">
        <span className="text-sm font-display font-bold text-gray-400">
          {String(currentSlide + 1).padStart(2, '0')}
        </span>
        <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ boxShadow: '0 0 10px #00f3ff' }}
          />
        </div>
        <span className="text-sm font-display font-medium text-gray-600">
          {String(totalSlides).padStart(2, '0')}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4 pointer-events-auto">
        <button
          onClick={onPrev}
          disabled={currentSlide === 0}
          className={`p-3 rounded-full glass-panel transition-all duration-300 ${
            currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:shadow-[0_0_15px_rgba(0,243,255,0.4)]'
          }`}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
          className={`p-3 rounded-full glass-panel transition-all duration-300 ${
            currentSlide === totalSlides - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:shadow-[0_0_15px_rgba(0,243,255,0.4)]'
          }`}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
      
    </div>
  );
}
