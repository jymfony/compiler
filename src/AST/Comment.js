const NodeInterface = require('./NodeInterface');

class Comment extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {string} value
     */
    __construct(location, value) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

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
     * Gets the comment value.
     *
     * @returns {string}
     */
    get value() {
        return this._value;
    }

    /**
     * @inheritdoc
     */
    compile(/* compiler */) {
        // Do nothing.
    }
}

module.exports = Comment;
