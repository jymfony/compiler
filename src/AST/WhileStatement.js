const StatementInterface = require('./StatementInterface');

class WhileStatement extends implementationOf(StatementInterface) {
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
        compiler._emit('while (');
        compiler.compileNode(this._test);
        compiler._emit(')');

        compiler.compileNode(this._body);
    }
}

module.exports = WhileStatement;
