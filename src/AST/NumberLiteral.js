const Literal = require('./Literal');

class NumberLiteral extends Literal {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {number} value
     */
    __construct(location, value) {
        super.__construct(location);

        /**
         * @type {number}
         *
         * @private
         */
        this._value = value;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit(this._value.toString());
    }
}

module.exports = NumberLiteral;
