/**
 * @template {AbstractBuilder} T
 */
class AbstractBuilder {
    /**
     * @param {T} parent
     */
    constructor(parent = null) {
        /**
         * @type {T}
         *
         * @private
         */
        this._parent = parent;
    }

    /**
     * @returns {T}
     */
    end() {
        return this._parent;
    }
}

module.exports = AbstractBuilder;
