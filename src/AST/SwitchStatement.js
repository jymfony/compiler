const StatementInterface = require('./StatementInterface');

class SwitchStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ExpressionInterface} discriminant
     * @param {SwitchCase[]} cases
     */
    __construct(location, discriminant, cases) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._discriminant = discriminant;

        /**
         * @type {SwitchCase[]}
         *
         * @private
         */
        this._cases = cases;
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        this._cases.forEach(c => c.prepare(compiler));
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
    compile(compiler) {
        compiler._emit('switch (');
        compiler.compileNode(this._discriminant);
        compiler._emit(') {');

        for (const c of this._cases) {
            compiler.indentationLevel++;
            compiler.newLine();
            compiler.compileNode(c);
            compiler.indentationLevel--;


            compiler.newLine();
        }

        compiler._emit('}');
    }
}

module.exports = SwitchStatement;
