const PatternInterface = require('./PatternInterface');

class AssignmentPattern extends implementationOf(PatternInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {PatternInterface|ExpressionInterface} left
     * @param {ExpressionInterface} right
     */
    __construct(location, left, right) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {PatternInterface}
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
    prepare(compiler) {
        this._left.prepare(compiler);
        this._right.prepare(compiler);
    }

    /**
     * @inheritdoc
     */
    get names() {
        return this._left.names;
    }

    /**
     * Gets the left hand of the pattern.
     *
     * @returns {PatternInterface}
     */
    get left() {
        return this._left;
    }

    /**
     * Gets the right hand of the pattern.
     *
     * @returns {ExpressionInterface}
     */
    get right() {
        return this._right;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._left);
        compiler._emit(' = ');
        compiler.compileNode(this._right);
    }
}

module.exports = AssignmentPattern;
