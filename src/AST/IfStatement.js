const StatementInterface = require('./StatementInterface');

class IfStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ExpressionInterface} test
     * @param {StatementInterface} consequent
     * @param {StatementInterface} alternate
     */
    __construct(location, test, consequent, alternate = null) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._test = test;

        /**
         * @type {StatementInterface}
         *
         * @private
         */
        this._consequent = consequent;

        /**
         * @type {StatementInterface}
         *
         * @private
         */
        this._alternate = alternate;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('if (');
        compiler.compileNode(this._test);
        compiler._emit(') ');
        compiler.compileNode(this._consequent);
        compiler._emit('\n');

        if (null !== this._alternate) {
            compiler._emit(' else ');
            compiler.compileNode(this._alternate);
        }
    }
}

module.exports = IfStatement;
