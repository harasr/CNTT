import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  FastForward, 
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { loadVideo, saveVideo, KEY_INTRO } from '../lib/videoStorage';

interface Props {
  onComplete: () => void;
}

export function IntroVideoScreen({ onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  
  // Clarity and display settings
  const [isUltraSharp, setIsUltraSharp] = useState<boolean>(true);
  const [objectFit, setObjectFit] = useState<'cover' | 'contain'>('cover');
  const [hasCheckedStorage, setHasCheckedStorage] = useState<boolean>(false);

  // Load intro video from IndexedDB or check /intro.mp4
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const storedUrl = await loadVideo(KEY_INTRO);
        if (storedUrl && isMounted) {
          setVideoSrc(storedUrl);
          setHasCheckedStorage(true);
          return;
        }

        // Test if /intro.mp4 is available in public folder
        const headRes = await fetch('/intro.mp4', { method: 'HEAD' });
        if (headRes.ok && isMounted) {
          setVideoSrc('/intro.mp4');
        }
      } catch (err) {
        console.log('Intro video auto-load check:', err);
      } finally {
        if (isMounted) setHasCheckedStorage(true);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle video auto-play when videoSrc is ready
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.log('Intro video autoplay prevented:', e);
          setIsPlaying(false);
        });
    }
  }, [videoSrc]);

  // Handle file upload/selection
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) return;
    try {
      await saveVideo(file, KEY_INTRO);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      if (videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.currentTime = 0;
        videoRef.current.play().then(() => setIsPlaying(true));
      }
    } catch (e) {
      console.error('Error saving intro video:', e);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 0;
    setCurrentTime(current);
    setDuration(total);
    if (total > 0) {
      setProgress((current / total) * 100);
    }
  };

  const handleEnded = () => {
    finishIntro();
  };

  const finishIntro = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 650);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Keyboard shortcut Esc or Space or Right Arrow to skip intro
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        finishIntro();
      } else if (e.key === ' ' && videoSrc) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [videoSrc, isExiting]);

  return (
    <AnimatePresence>
      <motion.div
        key="intro-screen"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isExiting ? 0 : 1,
          scale: isExiting ? 1.06 : 1,
          filter: isExiting ? 'brightness(2.2) contrast(1.2) blur(8px)' : 'none'
        }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center select-none"
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        {/* Video Player */}
        {videoSrc ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              src={videoSrc}
              playsInline
              className={`w-full h-full transition-all duration-300 ${
                objectFit === 'cover' ? 'object-cover' : 'object-contain'
              }`}
              style={{
                filter: isUltraSharp 
                  ? 'url(#video-ultra-sharp) contrast(1.08) saturate(1.12) brightness(1.02)' 
                  : 'none',
                imageRendering: isUltraSharp ? '-webkit-optimize-contrast' : 'auto',
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
              }}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onClick={togglePlay}
            />

            {/* Subtle Vignette for Cinema Experience */}
            <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-black/20 to-black/70" />

            {/* Top Bar Controls */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center space-x-3 pointer-events-auto">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="tracking-wider uppercase font-bold">Intro • The Dark Side of IT</span>
                </div>

                {/* Ultra Sharp HD+ Indicator / Toggle */}
                <button
                  onClick={() => setIsUltraSharp(!isUltraSharp)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center space-x-1.5 border backdrop-blur-md ${
                    isUltraSharp
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                      : 'bg-black/50 border-white/20 text-gray-400 hover:text-white'
                  }`}
                  title="Bật/Tắt chế độ siêu nét AI cho video"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>HD+ Siêu nét: {isUltraSharp ? 'BẬT' : 'TẮT'}</span>
                </button>

                {/* Fit / Cover Toggle */}
                <button
                  onClick={() => setObjectFit(objectFit === 'cover' ? 'contain' : 'cover')}
                  className="px-3 py-1.5 rounded-full bg-black/50 border border-white/20 hover:border-cyan-400 text-xs font-mono text-gray-300 hover:text-white transition-all backdrop-blur-md flex items-center space-x-1.5"
                  title="Chuyển đổi giữa Toàn màn hình (Fill 16:9) và Giữ tỉ lệ gốc (Fit)"
                >
                  {objectFit === 'cover' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{objectFit === 'cover' ? '16:9 Fill' : 'Fit'}</span>
                </button>
              </div>

              {/* Skip Intro to Slide 1 Button */}
              <div className="flex items-center space-x-3 pointer-events-auto">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-full bg-black/60 border border-white/20 hover:border-cyan-400 text-xs font-mono text-gray-300 hover:text-white transition-all backdrop-blur-md flex items-center space-x-1.5"
                  title="Thay đổi file video Intro khác"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đổi video</span>
                </button>

                <button
                  onClick={finishIntro}
                  className="px-5 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(0,243,255,0.6)] transition-all flex items-center space-x-2"
                >
                  <span>Vào Slide 1</span>
                  <FastForward className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Progress Bar & Time */}
            <div className="absolute bottom-6 left-8 right-8 z-20 flex flex-col space-y-2 pointer-events-auto">
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                <div className="flex items-center space-x-3">
                  <button onClick={togglePlay} className="text-white hover:text-cyan-400 transition-colors">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={toggleMute} className="text-white hover:text-cyan-400 transition-colors">
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                  </button>
                  <span>
                    {Math.floor(currentTime)}s / {Math.floor(duration || 0)}s
                  </span>
                </div>
                <div className="text-cyan-400/80 italic text-xs">
                  Nhấn <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Esc</kbd> để vào Slide 1 ngay
                </div>
              </div>

              {/* Glow Progress Line */}
              <div 
                className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer backdrop-blur"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickPos = (e.clientX - rect.left) / rect.width;
                  if (videoRef.current && duration > 0) {
                    videoRef.current.currentTime = clickPos * duration;
                  }
                }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-cyan-300 shadow-[0_0_10px_#00f3ff]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Empty / Upload State if video is not yet attached */
          <div className="relative z-10 max-w-2xl w-full mx-6 p-8 md:p-12 glass-panel rounded-3xl border border-cyan-500/40 text-center shadow-[0_0_60px_rgba(0,243,255,0.25)] flex flex-col items-center">
            
            {/* KlingAI Cyber Beam Animation Preview */}
            <div className="relative w-28 h-28 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center mb-6 overflow-hidden shadow-[0_0_30px_rgba(0,243,255,0.3)]">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
              />
              <Upload className="w-12 h-12 text-cyan-400 animate-bounce" />
            </div>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-mono text-cyan-300 mb-4 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Video Mở đầu Toàn màn hình</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white mb-3">
              Tải Video Kling AI Vào Slide
            </h2>

            <p className="text-gray-300 text-sm md:text-base font-light max-w-lg mb-8 leading-relaxed">
              Kéo thả trực tiếp file video bạn vừa tạo vào đây, hoặc nhấn nút bên dưới để chọn file từ máy tính. Video sẽ tự phát ngay khi bạn vào chế độ toàn màn hình và tự chuyển tiếp mượt mà vào Slide 1.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold uppercase tracking-wider text-sm shadow-[0_0_25px_rgba(0,243,255,0.6)] transition-all flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Chọn file video từ máy</span>
              </button>

              <button
                onClick={finishIntro}
                className="px-6 py-3.5 rounded-full glass-panel hover:bg-white/15 text-gray-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-all border border-white/20"
              >
                Vào thẳng Slide 1 →
              </button>
            </div>

            <p className="text-[12px] text-gray-500 mt-6 font-mono">
              (Hoặc bạn cũng có thể lưu file video vào thư mục <code className="text-cyan-400">public/intro.mp4</code>)
            </p>
          </div>
        )}

        {/* Drag Overlay Prompt */}
        {isDragOver && (
          <div className="absolute inset-0 z-50 bg-cyan-950/80 backdrop-blur-md border-4 border-dashed border-cyan-400 flex flex-col items-center justify-center text-cyan-300">
            <Upload className="w-16 h-16 animate-bounce mb-4 text-cyan-400" />
            <h3 className="text-2xl font-display font-bold uppercase tracking-wider">Thả file video Intro vào đây</h3>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
