import React, { useRef } from "react";
import ReactPlayer from "react-player";
import detection from "./detection";
import "./style.css";

const DetectionDisplay = ({ url, width, height }) => {
  const canvasRef = useRef(null);

  const onStart = () =>
    detection(
      document.getElementById("detection-canvas"),
      document.getElementById("player-container").firstChild
    );

  return (
    <div style={{ width, height, position: "relative" }}>
      <ReactPlayer
        className="abs"
        id="player-container"
        controls={false}
        playing={true}
        url={url}
        width={width}
        height={height}
        onStart={onStart}
      />
      <canvas
        className="abs"
        id="detection-canvas"
        ref={canvasRef}
        width={width}
        height={height}
        style={{ position: "absolute", left: 0, pointerEvents: "" }}
      />
    </div>
  );
};

export default DetectionDisplay;
