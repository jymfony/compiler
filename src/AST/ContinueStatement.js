const StatementInterface = require('./StatementInterface');

class ContinueStatement extends implementationOf(StatementInterface) {
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
        compiler._emit('continue');
        if (null !== this._label) {
            compiler._emit(' ');
            compiler.compileNode(this._label);
        }

        compiler._emit(';');
    }
}

module.exports = ContinueStatement;
