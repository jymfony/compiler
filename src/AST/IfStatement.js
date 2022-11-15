const BlockStatement = require('./BlockStatement');
const ExpressionInterface = require('./ExpressionInterface');
const ExpressionStatement = require('./ExpressionStatement');
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
        this._consequent = consequent instanceof ExpressionInterface ? new ExpressionStatement(null, consequent) : consequent;

        /**
         * @type {StatementInterface}
         *
         * @private
         */
        this._alternate = alternate instanceof ExpressionInterface ? new ExpressionStatement(null, alternate) : alternate;
    }

    /**
     * @inheritdoc
     */
    get shouldBeClosed() {
        return false;
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        this._test.prepare(compiler);
        this._consequent.prepare(compiler);
        if (null !== this._alternate) {
            this._alternate.prepare(compiler);
        }
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
        if (this._consequent.shouldBeClosed) {
            compiler._emit(';');
        }

        if (null !== this._alternate) {
            if (! (this._consequent instanceof BlockStatement)) {
                if (this._consequent.shouldBeClosed) {
                    compiler.newLine();
                }
                compiler._emit('else ');
            } else {
                compiler._emit(' else ');
            }

            compiler.compileNode(this._alternate);
            if (this._alternate.shouldBeClosed) {
                compiler._emit(';');
                compiler.newLine();
            }
        } else {
            compiler.newLine();
        }
    }
}

module.exports = IfStatement;
