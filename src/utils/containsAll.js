module.exports = (target, subject) =>
  subject.every((item) => target.some((_item) => _item === item));
