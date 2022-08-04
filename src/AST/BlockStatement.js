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
     * @inheritdoc
     */
    get shouldBeClosed() {
        return false;
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
        compiler.indentationLevel++;
        compiler._emit('{');
        compiler.newLine();
        for (const [ i, statement ] of __jymfony.getEntries(this._body)) {
            if (statement instanceof Docblock) {
                continue;
            }

            compiler.compileNode(statement);

            if (! (statement instanceof StatementInterface) || statement.shouldBeClosed) {
                compiler._emit(';');
                if (i !== this._body.length - 1) {
                    compiler.newLine();
                }
            }
        }

        compiler.indentationLevel--;
        compiler.newLine();
        compiler._emit('}');
    }
}

module.exports = BlockStatement;
