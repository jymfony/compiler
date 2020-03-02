class SourceLocation {
    /**
     * Constructor.
     *
     * @param {string} source
     * @param {Position} start
     * @param {Position} end
     */
    constructor(source, start, end) {
        /**
         * @type {string}
         *
         * @private
         */
        this._source = source;

        /**
         * @type {Position}
         *
         * @private
         */
        this._start = start;

        /**
         * @type {Position}
         *
         * @private
         */
        this._end = end;
    }

    /**
     * Gets the source start position.
     *
     * @returns {Position}
     */
    get start() {
        return this._start;
    }
}

module.exports = SourceLocation;
