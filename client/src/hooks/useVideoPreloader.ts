import { useEffect, useState } from "react";

/**
 * Hook to preload game videos for instant playback
 * Preloads win, lose, and demo videos when the game starts
 */
export function useVideoPreloader(gameStarted: boolean) {
  const [videosPreloaded, setVideosPreloaded] = useState(false);

  useEffect(() => {
    if (!gameStarted || videosPreloaded) return;

    const videoSources = [
      "/videos/Win.mp4",
      "/videos/Lost.mp4",
      "/videos/flippo-demo.mp4",
      "/videos/tappo-demo.mp4",
      "/videos/simono-demo.mp4",
    ];

    let loadedCount = 0;
    const totalVideos = videoSources.length;

    // Preload videos using fetch API for better reliability
    const preloadPromises = videoSources.map((src) =>
      fetch(src)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.blob();
        })
        .then(() => {
          loadedCount++;
          if (loadedCount === totalVideos) {
            setVideosPreloaded(true);
          }
        })
        .catch((error) => {
          console.warn(`Failed to preload video: ${src}`, error);
          loadedCount++;
          if (loadedCount === totalVideos) {
            setVideosPreloaded(true);
          }
        })
    );

    // Wait for all videos to load or fail
    Promise.allSettled(preloadPromises);

    // No cleanup needed for fetch-based preloading
  }, [gameStarted, videosPreloaded]);

  return videosPreloaded;
}
