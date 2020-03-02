const ExpressionInterface = require('./ExpressionInterface');

class ParenthesizedExpression extends implementationOf(ExpressionInterface) {
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
     * Gets the expression inside the parenthesis.
     *
     * @return {ExpressionInterface}
     */
    get expression() {
        return this._expression;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('(');
        compiler.compileNode(this._expression);
        compiler._emit(')');
    }
}

module.exports = ParenthesizedExpression;
