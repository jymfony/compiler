const ExpressionInterface = require('./ExpressionInterface');

class AssignmentExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {string} operator
     * @param {PatternInterface|ExpressionInterface} left
     * @param {ExpressionInterface} right
     */
    __construct(location, operator, left, right) {
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
         * @type {PatternInterface|ExpressionInterface}
         *
         * @private
         */
        this._left = left;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._right = right;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._left);
        compiler._emit(' ' + this._operator + ' ');
        compiler.compileNode(this._right);
    }

    /**
     * Gets the assignment operator.
     *
     * @returns {string}
     */
    get operator() {
        return this._operator;
    }

    /**
     * Gets the left hand of the expression.
     *
     * @returns {PatternInterface|ExpressionInterface}
     */
    get left() {
        return this._left;
    }

    /**
     * Gets the right hand of the expression.
     *
     * @returns {ExpressionInterface}
     */
    get right() {
        return this._right;
    }
}

module.exports = AssignmentExpression;
