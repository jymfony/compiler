const ExpressionInterface = require('./ExpressionInterface');

class AwaitExpression extends implementationOf(ExpressionInterface) {
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
    compile(compiler) {
        compiler._emit('await ');
        compiler.compileNode(this._expression);
    }
}

module.exports = AwaitExpression;
