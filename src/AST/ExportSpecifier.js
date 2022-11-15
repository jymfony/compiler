const NodeInterface = require('./NodeInterface');

class ExportSpecifier extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {Identifier} local
     * @param {Identifier} exported
     */
    __construct(location, local, exported) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {Identifier}
         *
         * @private
         */
        this._local = local;

        /**
         * @type {Identifier}
         *
         * @private
         */
        this._exported = exported;
    }

    /**
     * @inheritdoc
     */
    prepare() {
        // Do nothing.
    }

    /**
     * Gets the local name.
     *
     * @returns {Identifier}
     */
    get local() {
        return this._local;
    }

    /**
     * Gets the exported name.
     *
     * @returns {Identifier}
     */
    get exported() {
        return this._exported;
    }

    /**
     * @inheritdoc
     */
    compile(/* compiler */) {
        throw new Error('Should not be called');
    }
}

module.exports = ExportSpecifier;
