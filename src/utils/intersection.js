const intersect2 = (list1, list2) => list1.filter((x) => list2.some((y) => y === x));

const intersection = (list1, list2, ...lists) =>
  list2 === undefined ? list1 : intersection(intersect2(list1, list2), ...lists);

module.exports = intersection;
