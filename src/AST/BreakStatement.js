const StatementInterface = require('./StatementInterface');

class BreakStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {null|Identifier} label
     */
    __construct(location, label) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {null|Identifier}
         *
         * @private
         */
        this._label = label;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('break');

        if (null !== this._label) {
            compiler._emit(' ');
            compiler.compileNode(this._label);
        }
    }
}

module.exports = BreakStatement;
