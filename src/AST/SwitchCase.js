const NodeInterface = require('./NodeInterface');

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
    compile(compiler) {
        if (null === this._test) {
            compiler._emit('default');
        } else {
            compiler._emit('case ');
            compiler.compileNode(this._test);
        }

        compiler._emit(':\n');
        for (const consequent of this._consequent) {
            compiler.compileNode(consequent);
            compiler._emit(';\n');
        }
    }
}

module.exports = SwitchCase;
