const ImportSpecifierInterface = require('./ImportSpecifierInterface');

class ImportSpecifier extends implementationOf(ImportSpecifierInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {Identifier} local
     * @param {Identifier} imported
     */
    __construct(location, local, imported) {
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
        this._imported = imported;
    }

    /**
     * @inheritdoc
     */
    prepare() {
        // Do nothing.
    }

    /**
     * Gets the local part.
     *
     * @returns {Identifier}
     */
    get local() {
        return this._local;
    }

    /**
     * Gets the imported part.
     *
     * @returns {Identifier}
     */
    get imported() {
        return this._imported;
    }

    /**
     * @inheritdoc
     */
    compile(/* compiler */) {
        throw new Error('Should not be called directly');
    }
}

module.exports = ImportSpecifier;
