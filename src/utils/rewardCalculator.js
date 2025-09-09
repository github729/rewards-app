export const rewardCalculator = (amount) => {
  let points = 0;
  if (amount > 100) {
    points = (amount - 100) * 2 + 50;
  } else if (amount > 50) {
    points = amount - 50;
  }
  return points;
}