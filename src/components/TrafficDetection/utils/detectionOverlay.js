import * as cocoSsd from "@tensorflow-models/coco-ssd";

const watchObjects = ["car", "bus", "truck", "motorcycle"];

const detectionOverlay = (canvas, video, numberCallBack) => {
  let model = null;
  let videoLoaded = false;
  video.addEventListener("loadeddata", event => {
    videoLoaded = true;
    checkAllLoaded();
  });
  cocoSsd.load().then(m => {
    model = m;
    checkAllLoaded();
  });

  const checkAllLoaded = () => {
    // Which ever is the last to load triggers the detection
    if (model && videoLoaded) {
      detectFrame(model);
    }
  };

  const detectFrame = model => {
    model.detect(video).then(predictions => {
      renderPredictions(predictions);
      requestAnimationFrame(() => {
        detectFrame(model);
      });
    });
  };

  const renderPredictions = predictions => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let vehicles = 0;
    predictions.forEach(prediction => {
      if (watchObjects.includes(prediction.class)) {
        vehicles += 1;
        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        const width = prediction.bbox[2];
        const height = prediction.bbox[3];
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        ctx.strokeStyle = "rgb(0, 38, 255)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        ctx.strokeRect(centerX, centerY, 1, 1);
      } else {
        console.log("Non-vehicle object found: ", prediction.class);
      }
    });
    if (numberCallBack) {
      numberCallBack(vehicles);
    }
  };
};

export default detectionOverlay;
