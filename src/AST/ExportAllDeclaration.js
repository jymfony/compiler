const ModuleDeclarationInterface = require('./ModuleDeclarationInterface');

class ExportAllDeclaration extends implementationOf(ModuleDeclarationInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {Literal} source
     */
    __construct(location, source) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {Literal}
         *
         * @private
         */
        this._source = source;
    }

    /**
     * @inheritdoc
     */
    prepare() {
        // Do nothing.
    }

    /**
     * @inheritdoc
     */
    get shouldBeClosed() {
        return false;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('module.exports = exports = { ...exports, ...require(');
        compiler.compileNode(this._source);
        compiler._emit(') };');
        compiler.newLine();
    }
}

module.exports = ExportAllDeclaration;
