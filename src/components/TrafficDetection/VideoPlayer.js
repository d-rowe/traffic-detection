import React, { useEffect } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ url, width, height }) => {
  useEffect(() => {
    const video = document.getElementById("video");
    if (Hls.isSupported()) {
      const config = { liveDurationInfinity: true, enableWorker: false };
      const hls = new Hls(config);
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    }
    // If hls.js is not supported, but browser has built-in hls support
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.addEventListener("loadedmetadata", function() {
        video.play();
      });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <video
      id="video"
      width={width}
      height={height}
      style={{ position: "absolute", left: 0 }}
    />
  );
};

export default VideoPlayer;
