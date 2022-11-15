const NodeInterface = require('./NodeInterface');
const ObjectMember = require('./ObjectMember');

class SpreadElement extends implementationOf(NodeInterface, ObjectMember) {
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
    prepare(compiler) {
        this._expression.prepare(compiler);
    }

    /**
     * Gets the spread element expression.
     *
     * @returns {ExpressionInterface}
     */
    get expression() {
        return this._expression;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('...');
        compiler.compileNode(this._expression);
    }
}

module.exports = SpreadElement;
