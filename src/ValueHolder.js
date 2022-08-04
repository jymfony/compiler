/**
 * Value holder for lexer.
 * You can modify the value into your getType implementation.
 *
 * @template T
 */
class ValueHolder {
    /**
     * Constructor.
     *
     * @param {T} value
     */
    constructor(value) {
        this.value = value;
    }

    /**
     * @returns {T}
     */
    get value() {
        return this._value;
    }

    /**
     * @param {T} value
     */
    set value(value) {
        this._value = value;
    }
}

module.exports = ValueHolder;
