const ExpressionInterface = require('./ExpressionInterface');

class YieldExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ExpressionInterface} argument
     * @param {boolean} delegate
     */
    __construct(location, argument, delegate) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._argument = argument;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._delegate = delegate;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('yield ');
        if (this._delegate) {
            compiler._emit('* ');
        }

        if (null !== this._argument) {
            compiler.compileNode(this._argument);
        }
    }
}

module.exports = YieldExpression;
