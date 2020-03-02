const Docblock = require('./Docblock');
const StatementInterface = require('./StatementInterface');

class BlockStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {StatementInterface[]} body
     */
    __construct(location, body) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {StatementInterface[]}
         *
         * @private
         */
        this._body = body;
    }

    /**
     * Gets the block statements array.
     *
     * @return {StatementInterface[]}
     */
    get statements() {
        return this._body;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('{\n');
        for (const statement of this._body) {
            if (statement instanceof Docblock) {
                continue;
            }

            compiler.compileNode(statement);
            compiler._emit(';\n');
        }
        compiler._emit('}\n');
    }
}

module.exports = BlockStatement;
