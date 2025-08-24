import { useEffect, useRef } from 'react';

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
  const currentVideoIdRef = useRef<string>(videoId);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    function initializePlayer() {
      if (containerRef.current && window.YT?.Player) {
        // Destroy existing player if it exists
        if (playerRef.current?.destroy) {
          playerRef.current.destroy();
        }
        
        // Clear the container
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        
        // Create new player
        playerRef.current = new window.YT.Player(containerRef.current, {
          height: '100%',
          width: '100%',
          videoId,
          playerVars: {
            start: startTime,
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: () => {
              onReady?.();
            },
          },
        });
        
        currentVideoIdRef.current = videoId;
      }
    }

    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, startTime, onReady]);

  // Handle videoId changes
  useEffect(() => {
    if (currentVideoIdRef.current !== videoId && playerRef.current) {
      // If videoId changed and player exists, load new video
      if (playerRef.current.loadVideoById) {
        playerRef.current.loadVideoById({
          videoId: videoId,
          startSeconds: startTime
        });
        currentVideoIdRef.current = videoId;
      }
    }
  }, [videoId, startTime]);

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
    </div>
  );
};