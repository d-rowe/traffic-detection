let registered = [];
let uid = 0;

const getCentroid = bbox => {
  const [x, y, width, height] = bbox;
  return [x + width / 2, y + height / 2];
};

const vehicles = {
  update: (index, bbox, frame) => {
    const vehicle = registered[index];
    const centroid = getCentroid(bbox);
    const [x, y] = centroid;
    const prevCentroid = vehicle.centroid;
    const [pX, pY] = prevCentroid;
    const vector = [x - pX, y - pY];
    vehicle.bbox = bbox;
    vehicle.centroid = centroid;
    vehicle.vector = vector;
    vehicle.centroidHistory.push({
      point: centroid,
      frame
    });
  },

  register: (bbox, frame) => {
    const [x, y, width, height] = bbox;
    const centroid = [x + width / 2, y + height / 2];
    const vehicle = {
      uid,
      frame,
      bbox,
      centroid,
      centroidHistory: [{ point: centroid, frame }],
      vector: [0, 0]
    };
    registered.push(vehicle);
    uid += 1;
  },

  deregisterOld: (frame, frameLimit) => {
    registered = registered.filter(
      vehicle => frame - vehicle.frame <= frameLimit
    );
  },

  all: () => registered
};

export default vehicles;
