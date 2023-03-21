const ExpressionInterface = require('./ExpressionInterface');

class BinaryExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {string} operator
     * @param {ExpressionInterface} left
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
         * @type {ExpressionInterface}
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
     * @returns {string}
     */
    get operator() {
        return this._operator;
    }

    /**
     * @returns {ExpressionInterface}
     */
    get left() {
        return this._left;
    }

    /**
     * @returns {ExpressionInterface}
     */
    get right() {
        return this._right;
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        this._left.prepare(compiler);
        this._right.prepare(compiler);
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._left);
        compiler._emit(' ' + this._operator + ' ');
        compiler.compileNode(this._right);
    }
}

module.exports = BinaryExpression;
