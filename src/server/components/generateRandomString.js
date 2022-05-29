const generateRandomString = (charset, length) => {
  if (!(Array.isArray(charset) && charset.filter(char => typeof char !== 'string').length === 0) && typeof charset !== 'string') throw new TypeError('charset is required to be a string or an array of strings');
  if (typeof length !== 'number' || length < 0 || length % 1 !== 0) throw new TypeError('length must be an integer greater or equal to 0');

  return Array.from(Array(length))
    .map(() => Math.floor(Math.random() * charset.length))
    .map(index => charset.charAt(index))
    .join('');
};

module.exports = { generateRandomString }; 
