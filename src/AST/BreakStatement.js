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
     * Gets the label to break, if any.
     *
     * @returns {Identifier | null}
     */
    get label() {
        return this._label;
    }

    /**
     * @inheritdoc
     */
    prepare() {
        // Do nothing.
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
        compiler._emit('break');
        if (null !== this._label) {
            compiler._emit(' ');
            compiler.compileNode(this._label);
        }

        compiler._emit(';');
    }
}

module.exports = BreakStatement;
