import * as cocoSsd from "@tensorflow-models/coco-ssd";

const watchObjects = ["car", "bus", "truck", "motorcycle, person"];

const detection = (canvas, video) => {
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "red";
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
        if (width < videoWidth * 0.2) {
          ctx.strokeRect(x, y, width, height);
          ctx.beginPath();
          ctx.arc(cX, cY, 2, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    });
  };
};

export default detection;
