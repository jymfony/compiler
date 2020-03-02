const ImportSpecifierInterface = require('./ImportSpecifierInterface');

class ImportDefaultSpecifier extends implementationOf(ImportSpecifierInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {Identifier} local
     */
    __construct(location, local) {
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
     * @inheritdoc
     */
    compile(/* compiler */) {
        throw new Error('Should not be called');
    }
}

module.exports = ImportDefaultSpecifier;
