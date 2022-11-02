let typeId = Math.round(Math.random() * 1000000);

module.exports.getNextTypeId = function getNextTypeId() {
    return typeId++;
};
