const StatementInterface = require('./StatementInterface');

class ThrowStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ExpressionInterface} expression
     */
    __construct(location, expression) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._expression = expression;
    }

    /**
     * @inheritdoc
     */
    get shouldBeClosed() {
        return true;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('throw ');
        compiler.compileNode(this._expression);
    }
}

module.exports = ThrowStatement;
