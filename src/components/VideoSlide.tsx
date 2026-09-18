import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Upload, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';
import { SlideData } from '../data/slides';
import { loadVideo, saveVideo, KEY_VTV } from '../lib/videoStorage';

interface Props {
  slide: SlideData;
  isActive: boolean;
}

export function VideoSlide({ slide, isActive }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoSrc, setVideoSrc] = useState<string>('/video.mp4');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isUltraSharp, setIsUltraSharp] = useState<boolean>(true);
  const [objectFit, setObjectFit] = useState<'cover' | 'contain'>('cover');

  // Load saved video from IndexedDB if available
  useEffect(() => {
    let active = true;
    loadVideo(KEY_VTV).then((storedUrl) => {
      if (storedUrl && active) {
        setVideoSrc(storedUrl);
        setHasError(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Control autoplay when slide is active and pause when switching away
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasError(false);
          })
          .catch((err) => {
            console.log('Autoplay prevented or video failed:', err);
            setIsPlaying(false);
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, videoSrc]);

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(() => setIsPlaying(true));
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) return;
    try {
      await saveVideo(file);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setHasError(false);
      if (videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.currentTime = 0;
        videoRef.current.play().then(() => setIsPlaying(true));
      }
    } catch (e) {
      console.error('Error saving video:', e);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center select-none"
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={onDrop}
    >
      {/* Hidden file input */}
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

      {/* Main Fullscreen Video with HD+ Clarity Filters */}
      <video
        ref={videoRef}
        src={videoSrc}
        className={`w-full h-full bg-black transition-all duration-300 ${
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
        playsInline
        onError={() => setHasError(true)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={handleTogglePlay}
      />

      {/* Upload Drag/Drop Overlay if video is missing or errored */}
      {(hasError || isDragOver) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-xl border-2 border-dashed border-cyan-500/50 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/30 text-cyan-400">
            <Upload className="w-10 h-10 animate-bounce" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wider text-white mb-3">
            Tải video VTV1 lên slide
          </h2>
          
          <p className="text-gray-300 max-w-lg mb-8 text-sm md:text-base leading-relaxed">
            Kéo thả trực tiếp file video bạn vừa tải vào đây, hoặc nhấn nút bên dưới để chọn file. Video sẽ được lưu tự động và tự phát toàn màn hình khi tới slide này.
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(0,243,255,0.6)] transition-all flex items-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Chọn file video từ thiết bị</span>
          </button>

          <div className="mt-6 flex items-center space-x-2 text-xs text-gray-500">
            <AlertCircle className="w-4 h-4 text-cyan-400" />
            <span>(Hoặc bạn cũng có thể lưu file video vào thư mục public/video.mp4)</span>
          </div>
        </motion.div>
      )}

      {/* Top Left VTV Broadcast Badge & Clarity Controls */}
      <div className="absolute top-8 left-28 z-20 flex items-center space-x-2.5">
        <div className="flex items-center space-x-2.5 glass-panel px-3 py-1.5 rounded-full border border-red-500/40 text-xs font-display font-bold uppercase tracking-widest text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span>VTV1 • Phóng sự Hitech</span>
        </div>

        {/* Ultra Sharp HD+ Toggle */}
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
          <span className="hidden sm:inline">HD+ Siêu nét: {isUltraSharp ? 'BẬT' : 'TẮT'}</span>
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

      {/* Change Video Helper Button on Top Right (near mascot) */}
      {!hasError && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute top-8 right-28 z-20 glass-panel px-3 py-1.5 rounded-full border border-white/20 text-xs text-gray-300 hover:text-white hover:border-cyan-400 transition-all opacity-60 hover:opacity-100 flex items-center space-x-1.5"
          title="Chọn hoặc đổi file video khác"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Đổi video</span>
        </button>
      )}

      {/* Bottom Gradient Overlay with Slide Summary & Media Controls */}
      <div className="absolute bottom-0 left-0 w-full z-20 bg-gradient-to-t from-black via-black/85 to-transparent pt-20 pb-16 px-6 md:px-14 2xl:px-16 pointer-events-none">
        <div className="max-w-6xl 2xl:max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          
          <div className="space-y-1.5 pointer-events-auto max-w-2xl">
            <div className="inline-block text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              Góc nhìn thực tế • Cybercrime & AI
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-wide leading-snug">
              {slide.title}
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base font-light italic text-glow-cyan leading-relaxed">
              {slide.highlightMessage || slide.subtitle}
            </p>
          </div>

          {/* Video Quick Controls */}
          <div className="flex items-center space-x-2.5 pointer-events-auto self-start md:self-end shrink-0">
            <button
              onClick={handleTogglePlay}
              className="p-2.5 rounded-full glass-panel hover:bg-white/20 transition-all text-white border border-white/20 hover:border-cyan-400 shadow-md"
              title={isPlaying ? 'Tạm dừng video' : 'Tiếp tục phát'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button
              onClick={handleRestart}
              className="p-2.5 rounded-full glass-panel hover:bg-white/20 transition-all text-white border border-white/20 hover:border-cyan-400 shadow-md"
              title="Phát lại từ đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleMute}
              className="p-2.5 rounded-full glass-panel hover:bg-white/20 transition-all text-white border border-white/20 hover:border-cyan-400 shadow-md"
              title={isMuted ? 'Bật tiếng video' : 'Tắt tiếng video'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
