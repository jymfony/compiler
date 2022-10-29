const Identifier = require('../AST/Identifier');

const identifier = new Identifier(null, 'undefined');

class Undefined {
    /**
     * Creates a new "undefined" identifier.
     *
     * @returns {Identifier}
     */
    static create() {
        return identifier;
    }
}

module.exports = Undefined;
