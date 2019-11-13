import objectDetector from "@cloud-annotations/object-detection";

const watchObjects = ["car", "bus", "motorcycle"];

const detectionOverlay = (canvas, video, numberCallBack) => {
  objectDetector
    .load(process.env.PUBLIC_URL + "/model_web")
    .then(model => detectFrame(model));

  const detectFrame = async model => {
    const predictions = await model.detect(video);
    renderPredictions(predictions);
    requestAnimationFrame(() => {
      detectFrame(model);
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
        ctx.strokeStyle = "rgb(0, 38, 255)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
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
