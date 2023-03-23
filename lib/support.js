module.exports = {
    generateMappingsBTree: () => {
        const { Mapping } = require('.');
        return new BTree(Mapping.compareByGeneratedPositionsDeflated);
    },
};
