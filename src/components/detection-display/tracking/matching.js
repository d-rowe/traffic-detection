import distance from "./distance";

// TODO match distance is porportional to bounding box size
const matchPoint = (centroid, registeredVehicles) => {
  let matchDist = 75;
  let minDistance = { index: 0, dist: 99999 };
  registeredVehicles.forEach((veh, i) => {
    let [vX, vY] = veh.vector;
    let [cX, cY] = veh.centroid;
    let futureCentroid = [cX + vX, cY + vY];
    let dist = distance(centroid, futureCentroid);
    if (dist < minDistance.dist) {
      minDistance = { index: i, dist };
    }
  });

  if (minDistance.dist <= matchDist) {
    return minDistance.index; // return index of registeredVehicle match
  } else {
    return -1;
  }
};

export default matchPoint;
