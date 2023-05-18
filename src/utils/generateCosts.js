function generateCosts(data) {
  const updatedData = {
    ...data,
    links: data.links.map((link) => ({
      ...link,
      cost: getRandomCost(),
    })),
  };

  console.log(updatedData);

  return updatedData;
}

function getRandomCost() {
  let cost = Math.floor(Math.random() * 21) - 10; // Generate random value from -10 to 10

  while (cost === 0) {
    // Exclude 0 as a possible value
    cost = Math.floor(Math.random() * 21) - 10;
  }

  return cost;
}

export default generateCosts;
