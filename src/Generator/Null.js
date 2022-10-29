const NullLiteral = require('../AST/NullLiteral');

class Null {
    /**
     * Creates a new "null".
     *
     * @returns {NullLiteral}
     */
    static create() {
        return new NullLiteral(null);
    }
}

module.exports = Null;
