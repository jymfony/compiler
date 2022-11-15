const ExpressionInterface = require('./ExpressionInterface');

class UpdateExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {string} operator
     * @param {ExpressionInterface} argument
     * @param {boolean} prefix
     */
    __construct(location, operator, argument, prefix) {
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

        /**
         * @type {boolean}
         *
         * @private
         */
        this._prefix = prefix;
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
        if (this._prefix) {
            compiler._emit(this._operator);
        }

        compiler.compileNode(this._argument);

        if (! this._prefix) {
            compiler._emit(this._operator);
        }
    }
}

module.exports = UpdateExpression;
