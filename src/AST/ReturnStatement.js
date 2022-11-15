const StatementInterface = require('./StatementInterface');

class ReturnStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {null|ExpressionInterface} argument
     */
    __construct(location, argument = null) {
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
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        if (null !== this._argument) {
            this._argument.prepare(compiler);
        }
    }

    /**
     * @inheritdoc
     */
    get shouldBeClosed() {
        return true;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('return');
        if (null !== this._argument) {
            compiler._emit(' ');
            compiler.compileNode(this._argument);
        }
    }
}

module.exports = ReturnStatement;
