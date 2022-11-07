const Literal = require('./Literal');

class NumberLiteral extends Literal {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {number|bigint} value
     */
    __construct(location, value) {
        super.__construct(location);

        /**
         * @type {string|number|BigInt}
         *
         * @private
         */
        this._value = value;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._bigint = 'bigint' === typeof value;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit(this._value.toString() + (this._bigint ? 'n' : ''));
    }
}

module.exports = NumberLiteral;
