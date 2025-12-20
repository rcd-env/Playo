import { useEffect, useState } from "react";

/**
 * Hook to preload game result videos for instant playback
 * Preloads both win and lose videos when the game starts
 */
export function useVideoPreloader(gameStarted: boolean) {
  const [videosPreloaded, setVideosPreloaded] = useState(false);

  useEffect(() => {
    if (!gameStarted || videosPreloaded) return;

    const videos = [
      { src: "/videos/Win.mp4", element: null as HTMLVideoElement | null },
      { src: "/videos/Lost.mp4", element: null as HTMLVideoElement | null },
    ];

    let loadedCount = 0;

    // Preload both videos
    videos.forEach((video, index) => {
      const videoElement = document.createElement("video");
      videoElement.src = video.src;
      videoElement.preload = "auto";
      videoElement.muted = true; // Muted videos can autoplay without user interaction

      videos[index].element = videoElement;

      videoElement.onloadeddata = () => {
        loadedCount++;
        if (loadedCount === videos.length) {
          setVideosPreloaded(true);
          console.log("🎬 Game videos preloaded successfully");
        }
      };

      videoElement.onerror = () => {
        console.warn(`Failed to preload video: ${video.src}`);
        loadedCount++;
        if (loadedCount === videos.length) {
          setVideosPreloaded(true);
        }
      };
    });

    // Cleanup
    return () => {
      videos.forEach(({ element }) => {
        if (element) {
          element.src = "";
          element.load();
        }
      });
    };
  }, [gameStarted, videosPreloaded]);

  return videosPreloaded;
}
