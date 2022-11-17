const StatementInterface = require('./StatementInterface');

class TryStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {BlockStatement} block
     * @param {CatchClause} handler
     * @param {BlockStatement} finalizer
     */
    __construct(location, block, handler, finalizer) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {BlockStatement}
         *
         * @private
         */
        this._block = block;

        /**
         * @type {CatchClause}
         *
         * @private
         */
        this._handler = handler;

        /**
         * @type {BlockStatement}
         *
         * @private
         */
        this._finalizer = finalizer;
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        this._block.prepare(compiler);
        if (null !== this._handler) {
            this._handler.prepare(compiler);
        }
        if (null !== this._finalizer) {
            this._finalizer.prepare(compiler);
        }
    }

    /**
     * @inheritdoc
     */
    get shouldBeClosed() {
        return false;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('try ');
        compiler.compileNode(this._block);

        if (null !== this._handler) {
            compiler.compileNode(this._handler);
        }

        if (null !== this._finalizer) {
            compiler._emit(' finally ');
            compiler.compileNode(this._finalizer);
        }
    }
}

module.exports = TryStatement;
