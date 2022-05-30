const { randIntBetween } = require('./randIntBetween');

const scrambleArray = (nums, buffer = []) => {
  const randInt = randIntBetween(0, nums.length);

  if (!buffer.includes(randInt)) buffer.push(randInt);
  if (buffer.length >= nums.length) return buffer;

  return scrambleArray(nums, buffer);
};

module.exports = { scrambleArray };
