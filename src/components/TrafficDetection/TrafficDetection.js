import React, { useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import detectionOverlay from "./utils/detectionOverlay";

const WIDTH = 500;
const HEIGHT = 500 * (9 / 16); // Keep 16:9 aspect ratio

const TrafficDetection = ({ url }) => {
  let lastVehicles = 0;
  const numVehicleChange = vehicles => {
    if (vehicles !== lastVehicles) {
      lastVehicles = vehicles;
      console.log(vehicles);
    }
  };

  useEffect(() => {
    // TODO get hls.js to take refs
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");

    detectionOverlay(canvas, video, numVehicleChange);
  });

  return (
    <div>
      <div
        className="traffic-detection"
        width={WIDTH}
        height={HEIGHT}
        style={{ position: "relative", width: WIDTH, height: HEIGHT }}
      >
        <VideoPlayer url={url} width={WIDTH} height={HEIGHT} />
        <canvas
          id="canvas"
          width={WIDTH}
          height={HEIGHT}
          style={{ position: "absolute", left: 0 }}
        />
      </div>
    </div>
  );
};

export default TrafficDetection;
