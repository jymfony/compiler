const NodeInterface = require('./NodeInterface');
const StatementInterface = require('./StatementInterface');

class SwitchCase extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {null|ExpressionInterface} test
     * @param {StatementInterface[]} consequent
     */
    __construct(location, test, consequent) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {null|ExpressionInterface}
         *
         * @private
         */
        this._test = test;

        /**
         * @type {StatementInterface[]}
         *
         * @private
         */
        this._consequent = consequent;
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        if (null !== this._test) {
            this._test.prepare(compiler);
        }

        this._consequent.forEach(s => s.prepare(compiler));
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (null === this._test) {
            compiler._emit('default');
        } else {
            compiler._emit('case ');
            compiler.compileNode(this._test);
        }

        compiler._emit(':');

        compiler.indentationLevel++;
        compiler.newLine();
        for (const [ i, consequent ] of __jymfony.getEntries(this._consequent)) {
            compiler.compileNode(consequent);
            if (! (consequent instanceof StatementInterface) || consequent.shouldBeClosed) {
                compiler._emit(';');
                if (i !== this._consequent.length - 1) {
                    compiler.newLine();
                }
            }
        }

        compiler.indentationLevel--;
    }
}

module.exports = SwitchCase;
