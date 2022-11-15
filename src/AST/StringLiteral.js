const Literal = require('./Literal');

class StringLiteral extends Literal {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {string} value
     */
    __construct(location, value) {
        super.__construct(location);

        /**
         * @type {string}
         *
         * @private
         */
        this._value = value;
    }

    /**
     * @inheritdoc
     */
    prepare() {
        // Do nothing.
    }

    /**
     * Gets the string literal value.
     *
     * @returns {string}
     */
    get value() {
        return this._value;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit(this._value);
    }
}

module.exports = StringLiteral;
