const StatementInterface = require('./StatementInterface');

class LabeledStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {Identifier} label
     * @param {StatementInterface} statement
     */
    __construct(location, label, statement) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {Identifier}
         *
         * @private
         */
        this._label = label;

        /**
         * @type {StatementInterface}
         *
         * @private
         */
        this._statement = statement;
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        this._statement.prepare(compiler);
    }

    /**
     * @inheritdoc
     */
    get shouldBeClosed() {
        return this._statement.shouldBeClosed;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._label);
        compiler._emit(': ');
        compiler.compileNode(this._statement);
    }
}

module.exports = LabeledStatement;
