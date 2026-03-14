export function getStarPointsForStars(stars: number) {
  if (stars >= 3) return 220;
  if (stars === 2) return 140;
  if (stars === 1) return 80;
  return 0;
}

export function getRankFromPoints(totalStarPoints: number) {
  if (totalStarPoints >= 1800) return "Galaxy Captain";
  if (totalStarPoints >= 1200) return "Rocket Leader";
  if (totalStarPoints >= 700) return "Comet Chaser";
  if (totalStarPoints >= 250) return "Star Starter";
  return "Launch Pad";
}
