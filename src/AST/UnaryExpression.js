const ExpressionInterface = require('./ExpressionInterface');

class UnaryExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {string} operator
     * @param {ExpressionInterface} argument
     */
    __construct(location, operator, argument) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {string}
         *
         * @private
         */
        this._operator = operator;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._argument = argument;
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        this._argument.prepare(compiler);
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit(this._operator + ' ');
        compiler.compileNode(this._argument);
    }
}

module.exports = UnaryExpression;
