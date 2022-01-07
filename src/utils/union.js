module.exports = (...lists) => {
  const list = lists.reduce((list, next) => list.concat(next), []);
  return Array.from(new Set(list));
};
