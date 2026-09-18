import { motion, AnimatePresence } from 'motion/react';
import { SlideData } from '../data/slides';
import {
  User,
  ListOrdered,
  Frown,
  Tv,
  Eye,
  Brain,
  Ghost,
  ShieldCheck,
  Users,
  MessageCircle
} from 'lucide-react';

interface Props {
  slide: SlideData;
}

export function Mascot({ slide }: Props) {
  const getMascotInfo = (slide: SlideData) => {
    if (slide.type === 'video' || slide.id === 4) {
      return {
        Icon: Tv,
        label: "Phóng sự VTV1",
        animation: { scale: [1, 1.08, 1], transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' } }
      };
    }

    switch (slide.id) {
      case 1: 
        return { 
          Icon: User, 
          label: "Xin chào",
          animation: { y: [-5, 5, -5], transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' } } 
        };
      case 2: 
        return { 
          Icon: ListOrdered, 
          label: "Lộ trình",
          animation: { y: [-3, 3, -3], transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' } } 
        };
      case 3: 
        return { 
          Icon: Frown, 
          label: "Nguy hiểm",
          animation: { x: [-3, 3, -3, 3, 0], transition: { repeat: Infinity, duration: 0.5, repeatDelay: 2 } } 
        };
      case 5: 
        return { 
          Icon: Eye, 
          label: "Bị theo dõi",
          animation: { scaleY: [1, 0.1, 1], transition: { repeat: Infinity, duration: 4, times: [0, 0.05, 1] } } 
        };
      case 6: 
        return { 
          Icon: Brain, 
          label: "Quá tải",
          animation: { scale: [1, 1.15, 1], transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' } } 
        };
      case 7: 
        return { 
          Icon: Ghost, 
          label: "Brainrot",
          animation: { y: [-10, 10, -10], rotate: [-10, 10, -10], transition: { repeat: Infinity, duration: 4 } } 
        };
      case 8: 
        return { 
          Icon: ShieldCheck, 
          label: "Bảo vệ",
          animation: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } } 
        };
      case 9: 
        return { 
          Icon: Users, 
          label: "Kết nối",
          animation: { y: [-5, 5, -5], transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' } } 
        };
      case 10: 
        return { 
          Icon: MessageCircle, 
          label: "Hỏi đáp",
          animation: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' } } 
        };
      default: 
        return { 
          Icon: User, 
          label: "AI",
          animation: { y: [-5, 5, -5] } 
        };
    }
  };

  const { Icon, label, animation } = getMascotInfo(slide);

  return (
    <div className="absolute top-8 right-8 z-50 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center space-y-3"
        >
          <motion.div
            animate={animation as any}
            className="relative w-16 h-16 rounded-full glass-panel flex items-center justify-center border-2 backdrop-blur-xl"
            style={{ 
              borderColor: `var(--color-neon-${slide.accentColor})`,
              boxShadow: `0 0 20px var(--color-neon-${slide.accentColor}), inset 0 0 10px var(--color-neon-${slide.accentColor})`
            }}
          >
            {/* Inner glow effect */}
            <div 
              className="absolute inset-0 rounded-full opacity-50 blur-md"
              style={{ backgroundColor: `var(--color-neon-${slide.accentColor})` }}
            />
            <Icon className="relative z-10 w-8 h-8 text-white drop-shadow-lg" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-[10px] font-display font-bold uppercase tracking-widest bg-black/60 px-3 py-1.5 rounded-full border backdrop-blur-md"
            style={{ 
              color: `var(--color-neon-${slide.accentColor})`,
              borderColor: `var(--color-neon-${slide.accentColor})`,
              boxShadow: `0 0 10px var(--color-neon-${slide.accentColor})`
            }}
          >
            {label}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
