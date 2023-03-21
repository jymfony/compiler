const Generator = require('../src/SourceMap/Generator');

export default class NullGenerator extends Generator {
    toString() {
        return '';
    }

    toJSON() {
        return {};
    }
}
