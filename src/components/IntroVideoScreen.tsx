import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { loadVideo, saveVideo, KEY_INTRO } from '../lib/videoStorage';

interface Props {
  onComplete: () => void;
}

export function IntroVideoScreen({ onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Load intro video from IndexedDB or check public/intro.mp4
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const storedUrl = await loadVideo(KEY_INTRO);
        if (storedUrl && isMounted) {
          setVideoSrc(storedUrl);
          return;
        }

        const base = import.meta.env.BASE_URL || '/';
        const normalizedBase = base.endsWith('/') ? base : `${base}/`;
        const possiblePaths = [
          `${normalizedBase}intro.mp4`,
          '/intro.mp4',
        ];
        for (const path of possiblePaths) {
          try {
            const res = await fetch(path, { method: 'HEAD' });
            if (res.ok && isMounted) {
              setVideoSrc(path);
              break;
            }
          } catch {
            // continue
          }
        }
      } catch (err) {
        console.log('Intro video auto-load check:', err);
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
      playPromise.catch((e) => {
        console.log('Autoplay prevented:', e);
      });
    }
  }, [videoSrc]);

  // Handle invisible drag & drop upload
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) return;
    try {
      await saveVideo(file, KEY_INTRO);
      fetch('/api/upload-video?type=intro', {
        method: 'POST',
        body: file,
      }).catch(() => {});

      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      if (videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    } catch (e) {
      console.error('Error saving intro video:', e);
    }
  };

  const finishIntro = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  // Keyboard shortcut Esc or Enter to skip intro early, Space to pause/resume
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        finishIntro();
      } else if (e.key === ' ' && videoRef.current) {
        e.preventDefault();
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isExiting]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isExiting ? 0 : 1,
          scale: isExiting ? 1.05 : 1,
          filter: isExiting ? 'brightness(2) blur(6px)' : 'none'
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center select-none"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        }}
      >
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            playsInline
            className="w-full h-full object-cover bg-black"
            onEnded={finishIntro}
            onClick={() => {
              if (videoRef.current) {
                if (videoRef.current.paused) videoRef.current.play();
                else videoRef.current.pause();
              }
            }}
          />
        ) : (
          <div className="text-gray-500 text-xs font-mono">
            Đang tải video mở đầu...
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
