export default class NullGenerator {
    free() {}
    constructor() {}
    addMapping() {}
    applyMapping() {}
    set sourceContent(_) { }

    toString() {
        return '';
    }

    toJSON() {
        return {};
    }
}
