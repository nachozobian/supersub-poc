import { useEffect, useRef, useState } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  startTime?: number;
  onReady?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const YouTubePlayer = ({ videoId, startTime = 0, onReady }: YouTubePlayerProps) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(videoId);

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsApiLoaded(true);
      };
    } else {
      setIsApiLoaded(true);
    }
  }, []);

  // Initialize player when API is loaded
  useEffect(() => {
    if (!isApiLoaded || !containerRef.current) return;

    // Destroy existing player
    if (playerRef.current?.destroy) {
      playerRef.current.destroy();
    }

    // Clear container
    containerRef.current.innerHTML = '';

    // Create new player
    playerRef.current = new window.YT.Player(containerRef.current, {
      height: '100%',
      width: '100%',
      videoId: currentVideoId,
      playerVars: {
        start: startTime,
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: () => {
          console.log('YouTube player ready for video:', currentVideoId);
          onReady?.();
        },
        onError: (event: any) => {
          console.error('YouTube player error:', event);
        }
      },
    });

    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [isApiLoaded, currentVideoId, startTime, onReady]);

  // Handle videoId changes
  useEffect(() => {
    if (videoId !== currentVideoId) {
      console.log('Changing video from', currentVideoId, 'to', videoId);
      setCurrentVideoId(videoId);
    }
  }, [videoId, currentVideoId]);

  const seekTo = (seconds: number) => {
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(seconds, true);
    }
  };

  // Expose seekTo method to parent components
  useEffect(() => {
    if (window) {
      (window as any).seekToTime = seekTo;
    }
  }, []);

  return (
    <div className="w-full h-full bg-muted rounded-lg overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      {!isApiLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
          Loading YouTube Player...
        </div>
      )}
    </div>
  );
};