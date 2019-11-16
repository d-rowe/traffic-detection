import * as cocoSsd from "@tensorflow-models/coco-ssd";
import centroidMatchID from "./match";

// TODO split out registeredVehicles logic to another module

const watchObjects = ["car", "bus", "truck", "motorcycle"];
let registeredVehicles = [];
let currentVehicleUID = 0;
let frame = 0;

// Remove vehicles who haven't been updated in n frames
const removeOldVehicles = ageLimit => {
  registeredVehicles = registeredVehicles.filter(
    vehicle => frame - vehicle.frame <= ageLimit
  );
};

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
        removeOldVehicles(15);
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
          let matchID = centroidMatchID([cX, cY], registeredVehicles);
          if (matchID !== -1) {
            let vehicle = registeredVehicles[matchID];
            let centroidHistory = vehicle.centroidHistory;
            let prevCentroid = vehicle.centroid;
            let [pX, pY] = prevCentroid;

            let vector = [cX - pX, cY - pY];

            centroidHistory.push({ point: [cX, cY], frame });
            let cUID = vehicle.uid;
            registeredVehicles[matchID] = {
              uid: cUID,
              frame,
              bbox,
              centroid: [cX, cY],
              centroidHistory,
              vector
            };
          } else {
            registeredVehicles.push({
              uid: currentVehicleUID,
              frame,
              bbox,
              centroid: [x, y],
              centroidHistory: [{ point: [x, y], frame }],
              vector: [0, 0]
            });
            currentVehicleUID += 1;
          }
        }
      }
    });

    // draw registeredVehicles bboxes
    registeredVehicles.forEach(vehicle => {
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
