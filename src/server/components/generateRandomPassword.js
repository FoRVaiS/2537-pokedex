const { generateRandomString } = require('./generateRandomString');

const generateRandomPassword = (length = 16, opts = {}) => {
  const { letters = true, numbers = false, symbols = false } = opts;

  if (typeof length !== 'number' || length < 0 || length % 1 !== 0) throw new TypeError('length must be an integer greater or equal to 0');
  if (typeof letters !== 'boolean') throw new TypeError('letters option must be a boolean');
  if (typeof numbers !== 'boolean') throw new TypeError('numbers option must be a boolean');
  if (typeof symbols !== 'boolean') throw new TypeError('symbols option must be a boolean');

  const lettersSet = letters ? 'abcedfghijklmnopqrstuvwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ' : '';
  const numbersSet = numbers ? '0123456789' : '';
  const symbolsSet = symbols ? '[]+=?!' : '';

  return generateRandomString(lettersSet + numbersSet + symbolsSet, length);
};

module.exports = { generateRandomPassword };
