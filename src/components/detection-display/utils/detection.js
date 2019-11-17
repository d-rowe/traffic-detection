import * as cocoSsd from "@tensorflow-models/coco-ssd";
import centroidMatchID from "./match";
import {
  getRegisteredVehicles,
  registerVehicle,
  updateVehicle,
  deregisterOldVehicles
} from "./vehicles";

// TODO create drawing module

const watchObjects = ["car", "bus", "truck", "motorcycle"];
let frame = 0;

const detection = (canvas, video) => {
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 2;
  const { videoHeight, videoWidth } = video;
  const canvasHeight = ctx.canvas.height;
  const canvasWidth = ctx.canvas.width;
  const scale = canvasHeight / videoHeight;
  cocoSsd.load().then(model => {
    detectFrame(model);
  });

  const detectFrame = model => {
    model.detect(video).then(predictions => {
      renderPredictions(predictions);
      requestAnimationFrame(() => {
        detectFrame(model);
        frame += 1;

        // Remove vehicles that haven't been updated in the past 15 frames
        deregisterOldVehicles(frame, 15);
      });
    });
  };

  const renderPredictions = predictions => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    predictions.forEach(prediction => {
      const objectName = prediction.class;
      if (watchObjects.includes(objectName)) {
        const x = prediction.bbox[0] * scale;
        const y = prediction.bbox[1] * scale;
        const width = prediction.bbox[2] * scale;
        const height = prediction.bbox[3] * scale;
        const [cX, cY] = [x + width / 2, y + height / 2];

        // Ignore preditions that are more that 20% the width of the view,
        // these are almost always false predictions
        if (width < videoWidth * 0.2 && height > 10) {
          let bbox = [x, y, width, height];

          // Check for match in registeredVehicles
          // TODO use vehicle uid instead of index for matchID
          let matchID = centroidMatchID([cX, cY], getRegisteredVehicles());
          if (matchID !== -1) {
            updateVehicle(matchID, bbox, frame);
          } else {
            registerVehicle(bbox, frame);
          }
        }
      }
    });

    // draw registeredVehicles bboxes
    getRegisteredVehicles().forEach(vehicle => {
      if (vehicle.frame === frame) {
        ctx.strokeStyle = "#fc9403";
      } else {
        ctx.strokeStyle = "#fcc603";
      }
      const { bbox } = vehicle;
      ctx.strokeRect(...bbox);

      vehicle.centroidHistory.forEach((centroidSnapshot, i) => {
        if (i > 0) {
          let prevCentroidSnapshot = vehicle.centroidHistory[i - 1];
          const age = frame - prevCentroidSnapshot.frame;
          const maxAge = 25;
          let alpha;
          if (age > maxAge) {
            alpha = 0;
          } else {
            alpha = (maxAge - age) / maxAge;
          }
          ctx.strokeStyle = `rgba(0, 255, 68, ${alpha}`;
          ctx.beginPath();
          ctx.moveTo(...centroidSnapshot.point);
          ctx.lineTo(...prevCentroidSnapshot.point);
          ctx.stroke();
        }
      });
    });
  };
};

export default detection;
