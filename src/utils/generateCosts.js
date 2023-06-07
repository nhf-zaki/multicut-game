function generateCosts(data) {
  const updatedData = {
    ...data,
    links: data.links.map((link) => ({
      ...link,
      cost: getRandomCost(),
    })),
  };

  return updatedData;
}

function getRandomCost() {
  let positiveCostPercentage = Math.random() * 21 + 55; // Random value between 55 and 75

  let isPositive = Math.random() < positiveCostPercentage / 100;

  if (!isPositive) {
    return -Math.floor(Math.random() * 10) - 1; // Generate a random negative cost from -1 to -10
  }

  return Math.floor(Math.random() * 10) + 1; // Generate a random positive cost from 1 to 10
}

export default generateCosts;
