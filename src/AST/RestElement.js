const PatternInterface = require('./PatternInterface');

class RestElement extends implementationOf(PatternInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {PatternInterface} argument
     */
    __construct(location, argument) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {PatternInterface}
         *
         * @private
         */
        this._argument = argument;
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        this._argument.prepare(compiler);
    }

    /**
     * Gets the rest argument.
     *
     * @returns {PatternInterface}
     */
    get argument() {
        return this._argument;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('...');
        compiler.compileNode(this._argument);
    }
}

module.exports = RestElement;
