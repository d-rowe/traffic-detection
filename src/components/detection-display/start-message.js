import React from "react";
import { Button } from "semantic-ui-react";
import "./style.css";

const StartMessage = ({ startCallback }) => (
  <div className="start-message">
    <h6>
      This real-time detection will need to download a small {"(<1MB)"} object
      detection model and stream live video. This is not recommended if you are
      on mobile data. This can also be resource intensive. If your computer or
      phone is a potato, it may get quite hot.
    </h6>

    <Button
      primary
      style={{ width: "6em" }}
      onClick={() => startCallback(true)}
    >
      Start
    </Button>
  </div>
);

export default StartMessage;
