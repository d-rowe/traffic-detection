const distance = (coord1, coord2) => {
  const [x1, y1] = coord1;
  const [x2, y2] = coord2;
  const xDist = Math.abs(x1 - x2);
  const yDist = Math.abs(y1 - y2);
  const c = Math.sqrt(xDist ** 2 + yDist ** 2);
  return c;
};

export default distance;
