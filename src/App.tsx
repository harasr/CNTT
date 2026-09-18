import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Maximize, Volume2, VolumeX, Clapperboard } from 'lucide-react';
import { slides } from './data/slides';
import { Slide } from './components/Slide';
import { Navigation } from './components/Navigation';
import { Mascot } from './components/Mascot';
import { VideoClarityFilter } from './components/VideoClarityFilter';
import { IntroVideoScreen } from './components/IntroVideoScreen';

const SOUNDTRACK_FILE = '/tracks/babyshark.mp3';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startPresentation = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.log("Fullscreen not supported or blocked", err);
    }
    setHasStarted(true);
    setShowIntro(true);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    // Start background soundtrack once intro finishes and Slide 1 appears
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const restartIntro = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setShowIntro(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  }, [currentSlideIndex]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  }, [currentSlideIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted || showIntro) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, showIntro, nextSlide, prevSlide, toggleMute]);

  // Automatically pause background music during video slides or intro, resume on normal slides
  useEffect(() => {
    if (!audioRef.current || !hasStarted) return;
    if (showIntro) {
      audioRef.current.pause();
      return;
    }

    const currentSlide = slides[currentSlideIndex];
    if (currentSlide?.type === 'video') {
      audioRef.current.pause();
    } else {
      if (!isMuted) {
        audioRef.current.play().catch((e) => console.log('Audio resume error:', e));
      }
    }
  }, [currentSlideIndex, hasStarted, showIntro, isMuted]);

  return (
    <>
      <VideoClarityFilter />
      <audio ref={audioRef} src={SOUNDTRACK_FILE} loop />
      
      {!hasStarted ? (
        <main className="relative w-full h-screen bg-[#050508] overflow-hidden text-white flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80')] bg-cover opacity-20 blur-sm" />
          
          <motion.div 
            className="relative z-10 glass-panel p-8 sm:p-12 rounded-3xl flex flex-col items-center justify-center max-w-2xl text-center shadow-[0_0_50px_rgba(0,243,255,0.2)] border border-white/10 mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-glow-cyan mb-6 uppercase tracking-tight">
              MẶT TRÁI CỦA CÔNG NGHỆ THÔNG TIN
            </h1>
            <p className="text-base sm:text-lg text-gray-300 mb-8 font-light max-w-lg">
              Nhấn để vào chế độ toàn màn hình, bắt đầu bằng Video Mở Đầu Cyberpunk và chuyển cảnh mượt mà vào bài thuyết trình.
            </p>
            <motion.button
              onClick={startPresentation}
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0,243,255,0.7)' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 px-8 py-4 bg-cyan-500/20 border border-cyan-400 rounded-full text-cyan-50 font-bold uppercase tracking-wider transition-all"
            >
              <Maximize className="w-5 h-5" />
              <span>Bắt đầu toàn màn hình</span>
            </motion.button>
          </motion.div>
        </main>
      ) : showIntro ? (
        <IntroVideoScreen onComplete={handleIntroComplete} />
      ) : (
        <main className="relative w-full h-screen bg-[#050508] overflow-hidden text-white">
          <Mascot slide={slides[currentSlideIndex]} />

          {/* Audio Control & Replay Intro */}
          <div className="absolute top-8 left-8 z-50 flex items-center space-x-2.5">
            <button 
              onClick={toggleMute}
              className="p-2 sm:px-3 sm:py-2 rounded-full glass-panel hover:bg-white/10 transition-all text-white/80 hover:text-white flex items-center space-x-2 border border-white/10 shadow-lg"
              title="Bật/Tắt nhạc (Phím M)"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              <span className="text-xs font-mono uppercase tracking-wider text-gray-300 hidden sm:inline">
                {isMuted ? 'Tắt tiếng' : 'Bật nhạc'}
              </span>
            </button>

            <button
              onClick={restartIntro}
              className="p-2 sm:px-3 sm:py-2 rounded-full glass-panel hover:bg-white/15 transition-all text-gray-300 hover:text-cyan-300 flex items-center space-x-1.5 border border-white/10 shadow-lg group text-xs font-mono"
              title="Xem lại video mở đầu Intro Kling AI"
            >
              <Clapperboard className="w-4 h-4 text-cyan-400" />
              <span className="hidden lg:inline text-[11px] text-gray-300 group-hover:text-white">
                Intro Video
              </span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            <Slide 
              key={currentSlideIndex} 
              slide={slides[currentSlideIndex]} 
            />
          </AnimatePresence>
          
          <Navigation 
            currentSlide={currentSlideIndex} 
            totalSlides={slides.length} 
            onNext={nextSlide} 
            onPrev={prevSlide} 
          />
        </main>
      )}
    </>
  );
}


