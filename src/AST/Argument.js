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

    /**
     * @inheritdoc
     */
    compileDecorators(compiler, target) {
        /**
         * @param {AppliedDecorator} a
         * @param {AppliedDecorator} b
         */
        const sortDecorators = (a, b) => {
            const aPriority = a.priority;
            const bPriority = b.priority;

            return aPriority > bPriority ? 1 : (bPriority > aPriority ? -1 : 0);
        };

        const tail = [];
        for (const decorator of (this.decorators || []).sort(sortDecorators)) {
            tail.push(...decorator.compile(compiler, target, this));
        }

        return tail;
    }
}

module.exports = Argument;
