import { useEffect, useRef, useState } from 'react';
import { FaCompress, FaExpand, FaPause, FaPlay, FaStepBackward, FaStepForward, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

const VideoPlayer = ({ src, title, onProgress, onComplete }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onProgress) {
        onProgress(video.currentTime / video.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) {
        onComplete();
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'escape':
          if (isFullscreen) {
            e.preventDefault();
            exitFullscreen();
          }
          break;
        case 'arrowleft':
          e.preventDefault();
          skipBackward();
          break;
        case 'arrowright':
          e.preventDefault();
          skipForward();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowup':
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case 'arrowdown':
          e.preventDefault();
          adjustVolume(-0.1);
          break;
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onProgress, onComplete, isFullscreen]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls && isPlaying) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    setShowControls(true);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    video.currentTime = Math.max(0, video.currentTime - 10);
    setShowControls(true);
  };

  const skipForward = () => {
    const video = videoRef.current;
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
    setShowControls(true);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * duration;
    video.currentTime = seekTime;
    setShowControls(true);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
    setShowControls(true);
  };

  const adjustVolume = (delta) => {
    const newVolume = Math.max(0, Math.min(1, volume + delta));
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
    setShowControls(true);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (isMuted) {
      video.volume = volume > 0 ? volume : 0.5;
      setIsMuted(false);
      if (volume === 0) setVolume(0.5);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
    setShowControls(true);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  };

  const enterFullscreen = () => {
    const container = containerRef.current;
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative group bg-black rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => !isFullscreen && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full cursor-pointer"
        src={src}
        title={title}
        onClick={togglePlay}
      />
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      
      {/* Overlay Controls */}
      <div className={`absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 ${
        showControls || !isPlaying ? 'bg-opacity-30' : 'bg-opacity-0'
      }`}>
        {/* Center Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition-all ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
        </button>

        {/* Bottom Controls */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
        }`}>
          {/* Progress Bar */}
          <div className="mb-4">
            <div
              className="w-full h-2 bg-gray-600 rounded-full cursor-pointer hover:h-3 transition-all"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              {/* Skip Backward */}
              <button 
                onClick={skipBackward} 
                className="hover:text-blue-300 transition-colors"
                title="Skip backward 10s"
              >
                <FaStepBackward />
              </button>
              
              {/* Play/Pause */}
              <button onClick={togglePlay} className="hover:text-blue-300 transition-colors">
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              
              {/* Skip Forward */}
              <button 
                onClick={skipForward} 
                className="hover:text-blue-300 transition-colors"
                title="Skip forward 10s"
              >
                <FaStepForward />
              </button>
              
              {/* Volume Controls */}
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="hover:text-blue-300 transition-colors">
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              {/* Keyboard shortcuts info */}
              <div className="text-xs text-gray-300 hidden lg:block">
                <span className="mr-3">Space: Play/Pause</span>
                <span className="mr-3">←→: Skip 10s</span>
                <span className="mr-3">↑↓: Volume</span>
                <span className="mr-3">F: Fullscreen</span>
                <span>M: Mute</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <button 
                onClick={toggleFullscreen} 
                className="hover:text-blue-300 transition-colors"
                title={isFullscreen ? "Exit fullscreen (ESC)" : "Enter fullscreen (F)"}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer; 