import React from "react";
import DetectionDisplay from "./components/detection-display/detection-display";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <DetectionDisplay
          width={640}
          height={360}
          url="https://58cc2dce193dd.streamlock.net/live/15_NW_Market_EW.stream/playlist.m3u8"
        />
      </header>
    </div>
  );
};

export default App;
