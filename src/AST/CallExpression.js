const ExpressionInterface = require('./ExpressionInterface');
const Function = require('./Function');

class CallExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ExpressionInterface} callee
     * @param {(ExpressionInterface|SpreadElement)[]} args
     * @param {boolean} [optional = false]
     */
    __construct(location, callee, args, optional = false) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._callee = callee;

        /**
         * @type {(ExpressionInterface|SpreadElement)[]}
         *
         * @private
         */
        this._args = args;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._optional = optional;
    }

    /**
     * @inheritdoc
     */
    get shouldBeClosed() {
        return true;
    }

    /**
     * Gets the callee expression.
     *
     * @returns {ExpressionInterface}
     */
    get callee() {
        return this._callee;
    }

    /**
     * Gets the arguments.
     *
     * @returns {(ExpressionInterface|SpreadElement)[]}
     */
    get args() {
        return this._args;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._callee);
        if (this._optional) {
            compiler._emit('?.');
        }

        Function.compileParams(compiler, this._args);
    }
}

module.exports = CallExpression;
