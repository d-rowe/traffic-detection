import distance from "./distance";

// TODO check if centroid is within registeredVehicles bbox
const centroidMatchID = (centroid, registeredVehicles) => {
  let matchDist = 75;
  let minDistance = { index: -1, dist: 99999 };
  registeredVehicles.forEach((vehicle, i) => {
    let [vX, vY] = vehicle.vector;
    let [cX, cY] = vehicle.centroid;
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

export default centroidMatchID;
