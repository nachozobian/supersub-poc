import { useEffect, useRef, useState } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  videoUrl?: string;
  startTime?: number;
  onReady?: () => void;
}

export const YouTubePlayer = ({ videoId, videoUrl, startTime = 0, onReady }: YouTubePlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Construir la URL del iframe
  const getIframeSrc = () => {
    const baseUrl = `https://www.youtube.com/embed/${videoId}`;
    const params = new URLSearchParams({
      autoplay: '0',
      controls: '1',
      modestbranding: '1',
      rel: '0',
      start: startTime.toString(),
    });
    return `${baseUrl}?${params.toString()}`;
  };

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      onReady?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [videoId, startTime, onReady]);

  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden relative">
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Loading video...</p>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 text-white z-10">
          <div className="text-center p-4">
            <div className="text-red-400 mb-2">⚠️</div>
            <p className="text-sm mb-2">Error loading video</p>
            <p className="text-xs text-red-300 mt-1">
              Video is not available or does not allow embedded playback
            </p>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={getIframeSrc()}
        title={`YouTube video ${videoId}`}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => {
          setIsLoading(false);
          setHasError(false);
          onReady?.();
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
      
    </div>
  );
};