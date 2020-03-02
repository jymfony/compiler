const BlockStatement = require('./BlockStatement');
const StatementInterface = require('./StatementInterface');

class DoWhileStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ExpressionInterface} test
     * @param {StatementInterface} body
     */
    __construct(location, test, body) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._test = test;

        /**
         * @type {StatementInterface}
         *
         * @private
         */
        this._body = body;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('do');
        compiler.compileNode(this._body);
        if (! (this._body instanceof BlockStatement)) {
            compiler._emit(';\n');
        }

        compiler._emit('while (');
        compiler.compileNode(this._test);
        compiler._emit(')');
    }
}

module.exports = DoWhileStatement;
