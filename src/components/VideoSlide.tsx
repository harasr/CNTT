import React, { useState, useEffect, useRef } from 'react';
import { SlideData } from '../data/slides';
import { loadVideo, saveVideo, KEY_VTV } from '../lib/videoStorage';

interface Props {
  slide: SlideData;
  isActive?: boolean;
}

export function VideoSlide({ slide: _slide, isActive = true }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  // Pause when not active, resume when active
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isActive]);

  // Load video from IndexedDB or check public/video.mp4
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const storedUrl = await loadVideo(KEY_VTV);
        if (storedUrl && isMounted) {
          setVideoSrc(storedUrl);
          return;
        }

        const base = import.meta.env.BASE_URL || '/';
        const normalizedBase = base.endsWith('/') ? base : `${base}/`;
        const possiblePaths = [
          `${normalizedBase}video.mp4`,
          '/video.mp4',
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
        console.log('Video check:', err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle video auto-play when entering slide
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        console.log('Video auto-play prevented:', e);
      });
    }
  }, [videoSrc]);

  // Handle drag & drop upload
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) return;
    try {
      await saveVideo(file, KEY_VTV);
      fetch('/api/upload-video?type=video', {
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
      console.error('Error saving video:', e);
    }
  };

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center select-none"
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
          onClick={handleTogglePlay}
        />
      ) : (
        <div className="text-gray-500 text-xs font-mono">
          Đang tải video phóng sự...
        </div>
      )}
    </div>
  );
}
