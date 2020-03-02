const Literal = require('./Literal');

class RegExpLiteral extends Literal {
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
    compile(compiler) {
        compiler._emit(this._value);
    }
}

module.exports = RegExpLiteral;
