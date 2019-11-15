import * as cocoSsd from "@tensorflow-models/coco-ssd";
import matchPoint from "./tracking/matching";

// TODO code split
const watchObjects = ["car", "bus", "truck", "motorcycle, person"];

const detection = (canvas, video) => {
  let uid = 0;
  let frame = 0;
  let registeredVehicles = [];

  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 1.5;
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
      });
    });
  };

  const renderPredictions = predictions => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // Remove vehicles registed more than 15 frames old
    registeredVehicles = registeredVehicles.filter(
      veh => frame - veh.frame <= 15
    );

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
        if (width < videoWidth * 0.2) {
          let bbox = [x, y, width, height];
          let matchIndex = matchPoint([cX, cY], registeredVehicles);
          if (matchIndex !== -1) {
            let currentRegVeh = registeredVehicles[matchIndex];
            let history = currentRegVeh.history;
            history.push([cX, cY]);
            let cUID = currentRegVeh.uid;
            registeredVehicles[matchIndex] = {
              uid: cUID,
              frame,
              bbox,
              centroid: [cX, cY],
              history
            };
          } else {
            registeredVehicles.push({
              uid,
              frame,
              bbox,
              centroid: [x, y],
              history: [[x, y]]
            });
            uid += 1;
          }
        }
      }
    });

    // draw registeredVehicles bboxes
    registeredVehicles.forEach(veh => {
      if (veh.frame === frame) {
        ctx.strokeStyle = "#fc9403";
      } else {
        ctx.strokeStyle = "#fcc603";
      }
      const { bbox } = veh;
      ctx.strokeRect(...bbox);
      const [cX, cY] = veh.centroid;
      ctx.beginPath();
      ctx.arc(cX, cY, 1, 0, 2 * Math.PI);
      ctx.stroke();

      // console.log(veh.history);
      veh.history.forEach((point, i) => {
        if (i > 0) {
          let lPoint = veh.history[i - 1];
          ctx.strokeStyle = `rgba(28, 252, 3, ${0.2}`;
          ctx.beginPath();
          ctx.moveTo(...point);
          ctx.lineTo(...lPoint);
          ctx.stroke();
        }
      });
    });
  };
};

export default detection;
