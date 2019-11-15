import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import detection from "./detection";
import { Loader } from "semantic-ui-react";
import StartMessage from "./start-message";
import "./style.css";

// TODO use refs
const DetectionDisplay = ({ url, width, height }) => {
  const canvasRef = useRef(null);
  const [start, setStart] = useState(false);
  const [playing, setPlaying] = useState(false);

  const onStart = () => {
    setPlaying(true);
    detection(
      document.getElementById("detection-canvas"),
      document.getElementById("player-container").firstChild
    );
  };

  return (
    <div style={{ width, height }} className="detection-background">
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* Loader */}
        {start && !playing ? (
          <div className="abs" style={{ width, height }}>
            <div className="start-message">
              <Loader active size="large">
                Loading
              </Loader>
            </div>
          </div>
        ) : null}
        {/* Video player */}
        {start ? (
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
        ) : null}
        {/* Object detection overlay */}
        {start ? (
          <canvas
            className="abs"
            id="detection-canvas"
            ref={canvasRef}
            width={width}
            height={height}
            style={{ position: "absolute", left: 0, pointerEvents: "" }}
          />
        ) : null}
        {/* Start message */}
        {!start ? <StartMessage startCallback={setStart} /> : null}
      </div>
    </div>
  );
};

export default DetectionDisplay;
