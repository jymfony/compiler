const BlockStatement = require('./BlockStatement');
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
        if (! (this._consequent instanceof BlockStatement)) {
            compiler.indentationLevel++;
            compiler.newLine();
            compiler.indentationLevel--;
        }

        compiler.compileNode(this._consequent);

        if (null !== this._alternate) {
            if (! (this._consequent instanceof BlockStatement)) {
                compiler.newLine();
                compiler._emit('else ');
            } else {
                compiler._emit(' else ');
            }

            compiler.compileNode(this._alternate);
        }
    }
}

module.exports = IfStatement;
