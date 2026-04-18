import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, styled, Typography, CircularProgress } from "@mui/material";
import { PlayArrow, VolumeOff, VolumeUp, Replay } from "@mui/icons-material";

const VideoContainer = styled(Box)({
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  cursor: "pointer",
  width: "100%",
  margin: "0 auto",
  borderRadius: "20px",
});

const VideoInner = styled(Box)({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const VideoElement = styled("video")({
  display: "block",
  width: "100%",
  height: "100%",
  backgroundColor: "#000",
});

const VideoOverlay = styled(Box)(({ isplaying }) => ({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
}));

const PlayButton = styled(Box)({
  pointerEvents: "auto",
  width: 80,
  height: 80,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.95)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.2s ease, background 0.2s ease",
  "&:hover": {
    transform: "scale(1.1)",
    background: "rgba(255,255,255,1)",
  },
});

const LoadingSpinner = styled(CircularProgress)({
  color: "#ffffff",
});

const VideoPlayer = ({
  videoUrl = "https://drbskhealthcare.com/uploads/intro-video.mp4",
  autoPlay = true,
  showControls = false,
  fullWidth = true,
  showPlayButton = true,
  containerProps = {},
  videoProps = {},
  showMuteButton = true,
  mobileHeight = "auto",
  desktopHeight = "85vh",
  mobileMaxHeight = "none",
  desktopMaxHeight = "85vh",
  loop = true, // Loop prop add kiya
}) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [containerHeight, setContainerHeight] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const autoplayAttempted = useRef(false);
  const playPromise = useRef(null);
  const stallTimeout = useRef(null);
  const retryTimeout = useRef(null);

  // Check if device is desktop
  useEffect(() => {
    const checkDevice = () => {
      const isDesktopView = window.innerWidth >= 900;
      setIsDesktop(isDesktopView);
    };
    
    checkDevice();
    window.addEventListener("resize", checkDevice);
    
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  // Video loading aur height calculation
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleVideoMetadata = () => {
      const vw = vid.videoWidth;
      const vh = vid.videoHeight;
      
      if (!vw || !vh) return;

      // Height calculation
      if (!isDesktop) {
        const container = containerRef.current;
        const cw = container ? container.clientWidth : window.innerWidth;
        const desiredHeight = Math.round((cw * vh) / vw);
        setContainerHeight(desiredHeight);
      }

      // Video styling based on device
      vid.style.objectFit = isDesktop ? "cover" : "contain";
      setVideoLoaded(true);
      setHasError(false);
      
      // Video setup - IMPORTANT: pehle setup phir autoplay
      vid.muted = isMuted;
      vid.playsInline = true;
      vid.preload = "auto";
      vid.loop = loop; // Loop property set karo
    };

    // Video canplaythrough event - yeh better hai canplay se
    const handleVideoCanPlayThrough = () => {
      setIsBuffering(false);
      
      if (autoPlay && isMuted && !autoplayAttempted.current) {
        autoplayAttempted.current = true;
        
        // Small delay for better autoplay success
        setTimeout(() => {
          if (vid.paused) {
            // Pehle currentTime 0 karo
            vid.currentTime = 0;
            
            playPromise.current = vid.play();
            
            if (playPromise.current !== undefined) {
              playPromise.current
                .then(() => {
                  console.log("Autoplay successful");
                  setIsPlaying(true);
                  setIsBuffering(false);
                })
                .catch(error => {
                  console.log("Autoplay failed:", error);
                  setIsBuffering(false);
                  
                  // Agar NotAllowedError hai to user interaction wait karo
                  if (error.name === 'NotAllowedError') {
                    console.log("Autoplay blocked by browser policy");
                    // User interaction ka wait karo
                  }
                });
            }
          }
        }, 300);
      }
    };

    // Event listeners - canplaythrough use karo
    vid.addEventListener("loadedmetadata", handleVideoMetadata);
    vid.addEventListener("canplaythrough", handleVideoCanPlayThrough);
    vid.addEventListener("progress", () => setIsBuffering(false));
    vid.addEventListener("seeking", () => setIsBuffering(true));
    vid.addEventListener("waiting", () => setIsBuffering(true));

    // Agar video already loaded hai
    if (vid.readyState >= 4) {
      handleVideoMetadata();
      handleVideoCanPlayThrough();
    }

    return () => {
      vid.removeEventListener("loadedmetadata", handleVideoMetadata);
      vid.removeEventListener("canplaythrough", handleVideoCanPlayThrough);
      vid.removeEventListener("progress", () => setIsBuffering(false));
      vid.removeEventListener("seeking", () => setIsBuffering(true));
      vid.removeEventListener("waiting", () => setIsBuffering(true));
    };
  }, [autoPlay, isMuted, isDesktop, loop]);

  // Video play state aur buffer monitoring
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsBuffering(false);
      setHasError(false);
    };

    const handlePlaying = () => {
      setIsPlaying(true);
      setIsBuffering(false);
      
      // Clear stall timeout
      if (stallTimeout.current) {
        clearTimeout(stallTimeout.current);
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      setIsBuffering(false);
    };

    const handleEnded = () => {
      if (loop) {
        // Agar loop enabled hai to wapas play karo
        vid.currentTime = 0;
        vid.play().catch(e => console.log("Loop play failed:", e));
      } else {
        setIsPlaying(false);
      }
      setIsBuffering(false);
    };

    const handleError = (e) => {
      console.error("Video error:", e);
      setIsPlaying(false);
      setIsBuffering(false);
      setHasError(true);
      
      // Retry logic
      if (retryCount < 3) {
        retryTimeout.current = setTimeout(() => {
          console.log(`Retrying video playback (attempt ${retryCount + 1})`);
          setRetryCount(prev => prev + 1);
          vid.load();
        }, 2000);
      }
    };

    const handleStalled = () => {
      console.log("Video stalled");
      setIsBuffering(true);
      
      // Agar 3 seconds se zyada stall ho raha hai to retry karo
      stallTimeout.current = setTimeout(() => {
        if (vid.paused || vid.ended) return;
        
        const currentTime = vid.currentTime;
        const buffered = vid.buffered;
        
        // Check if buffered enough
        if (buffered.length > 0) {
          const bufferedEnd = buffered.end(buffered.length - 1);
          if (bufferedEnd - currentTime < 2) {
            // Buffer kam hai, try to play from current position
            console.log("Low buffer, trying to recover...");
            vid.currentTime = currentTime;
            vid.play().catch(e => console.log("Stall recovery failed:", e));
          }
        }
      }, 3000);
    };

    const handleTimeUpdate = () => {
      // Buffer monitoring
      if (vid.buffered.length > 0) {
        const currentTime = vid.currentTime;
        const bufferedEnd = vid.buffered.end(vid.buffered.length - 1);
        const bufferAhead = bufferedEnd - currentTime;
        
        // Agar buffer kam hai to buffering status dikhao
        if (bufferAhead < 1 && !vid.paused && !vid.ended) {
          setIsBuffering(true);
        } else {
          setIsBuffering(false);
        }
      }
    };

    vid.addEventListener("play", handlePlay);
    vid.addEventListener("playing", handlePlaying);
    vid.addEventListener("pause", handlePause);
    vid.addEventListener("ended", handleEnded);
    vid.addEventListener("error", handleError);
    vid.addEventListener("stalled", handleStalled);
    vid.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      vid.removeEventListener("play", handlePlay);
      vid.removeEventListener("playing", handlePlaying);
      vid.removeEventListener("pause", handlePause);
      vid.removeEventListener("ended", handleEnded);
      vid.removeEventListener("error", handleError);
      vid.removeEventListener("stalled", handleStalled);
      vid.removeEventListener("timeupdate", handleTimeUpdate);
      
      // Cleanup timeouts
      if (stallTimeout.current) {
        clearTimeout(stallTimeout.current);
      }
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
      }
      if (playPromise.current) {
        playPromise.current.catch(() => {});
      }
    };
  }, [retryCount, loop]);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!isDesktop && videoLoaded) {
        const vid = videoRef.current;
        const container = containerRef.current;
        if (!vid || !container || !vid.videoWidth || !vid.videoHeight) return;
        
        const vw = vid.videoWidth;
        const vh = vid.videoHeight;
        const cw = container.clientWidth;
        const desiredHeight = Math.round((cw * vh) / vw);
        setContainerHeight(desiredHeight);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isDesktop, videoLoaded]);

  // Play/pause toggle
  const handleTogglePlay = (e) => {
    const vid = videoRef.current;
    if (!vid) return;
    
    e.stopPropagation();
    
    if (vid.paused || vid.ended) {
      setIsBuffering(true);
      playPromise.current = vid.play();
      
      playPromise.current
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch(error => {
          console.log("Play failed:", error);
          setIsBuffering(false);
          
          // Mute karke phir try karo
          if (!vid.muted) {
            vid.muted = true;
            setIsMuted(true);
            vid.play()
              .then(() => {
                setIsPlaying(true);
                setIsBuffering(false);
              })
              .catch(e => {
                console.log("Muted play also failed:", e);
                setIsBuffering(false);
              });
          }
        });
    } else {
      vid.pause();
      setIsPlaying(false);
      setIsBuffering(false);
    }
  };

  // Retry video loading
  const handleRetry = (e) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    
    setHasError(false);
    setIsBuffering(true);
    setRetryCount(0);
    
    // Force reload video
    vid.load();
    
    // Small delay before trying to play
    setTimeout(() => {
      vid.play()
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch(error => {
          console.log("Retry play failed:", error);
          setIsBuffering(false);
        });
    }, 1000);
  };

  // Mute toggle
  const toggleMute = (e) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    
    const newMutedState = !vid.muted;
    vid.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  // Device specific styles
  const getContainerStyles = () => {
    const baseStyles = {
      width: fullWidth ? "100%" : "auto",
      ...containerProps?.sx
    };

    if (isDesktop) {
      return {
        ...baseStyles,
        height: desktopHeight,
        maxHeight: desktopMaxHeight,
        minHeight: "400px",
      };
    } else {
      if (containerHeight) {
        return {
          ...baseStyles,
          height: `${containerHeight}px`,
          maxHeight: mobileMaxHeight,
        };
      } else {
        return {
          ...baseStyles,
          height: mobileHeight,
          maxHeight: mobileMaxHeight,
        };
      }
    }
  };

  return (
    <VideoContainer
      ref={containerRef}
      onClick={handleTogglePlay}
      sx={getContainerStyles()}
    >
      <VideoInner>
        <VideoElement
          ref={videoRef}
          poster=""
          preload="auto"
          controls={showControls}
          playsInline
          autoPlay={autoPlay}
          muted={isMuted}
          loop={loop} // Loop attribute add karo
          style={{
            objectFit: isDesktop ? "cover" : "contain"
          }}
          {...videoProps}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </VideoElement>
      </VideoInner>

      {/* Loading/Buffering Spinner */}
      {isBuffering && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 5,
          }}
        >
          <LoadingSpinner size={60} />
        </Box>
      )}

      {/* Error State */}
      {hasError && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            zIndex: 5,
            color: "white",
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Video Playback Error
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            {retryCount >= 3 
              ? "Unable to play video. Please check your connection."
              : "Having trouble playing the video."
            }
          </Typography>
          {retryCount < 3 && (
            <PlayButton onClick={handleRetry}>
              <Replay sx={{ fontSize: 32, color: "#2C2C2C" }} />
            </PlayButton>
          )}
        </Box>
      )}

      {showPlayButton && !hasError && !isBuffering && (
        <VideoOverlay isplaying={isPlaying ? 1 : 0}>
          {!isPlaying && (
            <PlayButton onClick={handleTogglePlay}>
              <PlayArrow sx={{ fontSize: 32, color: "#2C2C2C" }} />
            </PlayButton>
          )}
        </VideoOverlay>
      )}

      {showMuteButton && !hasError && (
        <Box
          onClick={toggleMute}
          sx={{
            position: "absolute",
            right: 12,
            bottom: 12,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            transition: "background 0.2s ease, transform 0.2s ease",
            "&:hover": {
              background: "rgba(0,0,0,0.8)",
              transform: "scale(1.1)",
            },
          }}
        >
          {isMuted ? (
            <VolumeOff sx={{ fontSize: 20 }} />
          ) : (
            <VolumeUp sx={{ fontSize: 20 }} />
          )}
        </Box>
      )}
    </VideoContainer>
  );
};

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string,
  autoPlay: PropTypes.bool,
  showControls: PropTypes.bool,
  fullWidth: PropTypes.bool,
  showPlayButton: PropTypes.bool,
  showMuteButton: PropTypes.bool,
  containerProps: PropTypes.object,
  videoProps: PropTypes.object,
  mobileHeight: PropTypes.string,
  desktopHeight: PropTypes.string,
  mobileMaxHeight: PropTypes.string,
  desktopMaxHeight: PropTypes.string,
  loop: PropTypes.bool, // Loop prop add kiya
};

VideoPlayer.defaultProps = {
  videoUrl: "https://drbskhealthcare.com/uploads/intro-video.mp4",
  autoPlay: true,
  showControls: false,
  fullWidth: true,
  showPlayButton: true,
  showMuteButton: true,
  containerProps: {},
  videoProps: {},
  mobileHeight: "auto",
  desktopHeight: "85vh",
  mobileMaxHeight: "none",
  desktopMaxHeight: "85vh",
  loop: true, // Default loop true kiya
};

export default VideoPlayer;


