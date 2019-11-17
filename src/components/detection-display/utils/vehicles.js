let registered = [];
let uid = 0;

//   uid
//   frame
//   bbox
//   centroid
//   centroidHistory
//   vector

export const registerVehicle = (bbox, frame) => {
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
};

export const deregisterOldVehicles = (frame, frameLimit) => {
  registered = registered.filter(
    vehicle => frame - vehicle.frame <= frameLimit
  );
};

export const getRegisteredVehicles = () => registered;
