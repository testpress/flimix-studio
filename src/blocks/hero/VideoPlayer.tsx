import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import { Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoplay = true,
  muted = true,
  loop = true,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(muted);
  
  // Error handling state and refs
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const baseDelay = 2000; // 2 second base delay

  // Robust error recovery with exponential backoff
  const attemptRecovery = (hls: Hls, errorType: string, errorDetails: any) => {
    if (retryCountRef.current >= maxRetries) {
      console.error(`Max retries (${maxRetries}) reached for ${errorType}. Giving up.`, errorDetails);
      hls.destroy();
      return;
    }

    const delay = baseDelay * Math.pow(2, retryCountRef.current); // Exponential backoff
    retryCountRef.current++;
    
    console.log(`Attempting recovery for ${errorType} in ${delay}ms (attempt ${retryCountRef.current}/${maxRetries})`);
    
    setTimeout(() => {
      try {
        switch (errorType) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            console.error(`Unknown error type: ${errorType}`);
            hls.destroy();
        }
      } catch (error) {
        console.error(`Recovery attempt failed:`, error);
        if (retryCountRef.current >= maxRetries) {
          hls.destroy();
        }
      }
    }, delay);
  };

  // Video initialization effect (runs only when src, autoplay, or loop change)
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!src || !videoElement) return;
    
    // Reset retry count for new video source
    retryCountRef.current = 0;
    
    videoElement.muted = isMuted;
    videoElement.autoplay = autoplay;
    videoElement.loop = loop;
    
    let hls: Hls | null = null;
    
    if (src.includes('.m3u8')) {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        
        hls.loadSource(src);
        hls.attachMedia(videoElement);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoplay) {
            videoElement.play().catch(err => console.error('HLS autoplay failed:', err));
          }
        });
        
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            console.error(`HLS fatal error: ${data.type}`, data.details);
            if (hls) {
              attemptRecovery(hls, data.type, data.details);
            }
          } else {
            console.warn(`HLS non-fatal error: ${data.type}`, data.details);
          }
        });
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = src;
        if (autoplay) {
          videoElement.play().catch(err => console.error('Native HLS autoplay failed:', err));
        }
      }
    } else {
      videoElement.src = src;
      if (autoplay) {
        videoElement.play().catch(err => console.error('Video autoplay failed:', err));
      }
    }
    
    return () => {
      if (hls) {
        hls.destroy();
      }
      if (videoElement) {
        videoElement.pause();
        videoElement.src = '';
        videoElement.load();
      }
    };
  }, [src, autoplay, loop]);

  // Separate effect for mute state (doesn't restart video)
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prevIsMuted => !prevIsMuted);
  };

  return (
    <div className="relative w-full h-full">
      <video 
        ref={videoRef}
        className={className}
        poster={poster}
        playsInline
        onClick={e => {
          e.stopPropagation();
          toggleMute();
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          cursor: 'pointer'
        }}
      />
      
      {/* Custom Mute/Unmute Button */}
      <button
        onClick={e => {
          e.stopPropagation();
          toggleMute();
        }}
        className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 z-10"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </div>
  );
};

export default VideoPlayer;
