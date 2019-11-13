import React from "react";
import TrafficDetection from "./components/TrafficDetection/TrafficDetection";
import "./App.css";

const App = () => (
  <div className="App">
    <header className="App-header">
      <TrafficDetection url="https://58cc2dce193dd.streamlock.net/live/Rainier_S_Henderson_NS.stream/playlist.m3u8" />
    </header>
  </div>
);

export default App;
