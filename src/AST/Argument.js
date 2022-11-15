const NodeInterface = require('./NodeInterface');

class Argument extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {PatternInterface} pattern
     */
    __construct(location, pattern) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {PatternInterface|RestElement}
         *
         * @private
         */
        this._pattern = pattern;

        /**
         * @type {null|AppliedDecorator[]}
         */
        this.decorators = null;

        /**
         * @type {null|Function}
         */
        this.function = null;
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        this.decorators.forEach(d => d.prepare(compiler));
        this._pattern.prepare(compiler);
    }

    /**
     * Gets the argument pattern.
     *
     * @returns {PatternInterface|RestElement}
     */
    get pattern() {
        return this._pattern;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._pattern);
    }
}

module.exports = Argument;
