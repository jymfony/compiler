const ExpressionInterface = require('./ExpressionInterface');

class ConditionalExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ExpressionInterface} test
     * @param {ExpressionInterface} consequent
     * @param {ExpressionInterface} alternate
     */
    __construct(location, test, consequent, alternate) {
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
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._consequent = consequent;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._alternate = alternate;
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        this._test.prepare(compiler);
        this._consequent.prepare(compiler);
        this._alternate.prepare(compiler);
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._test);
        compiler._emit(' ? ');
        compiler.compileNode(this._consequent);
        compiler._emit(' : ');
        compiler.compileNode(this._alternate);
    }
}

module.exports = ConditionalExpression;
