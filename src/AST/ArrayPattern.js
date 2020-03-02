const PatternInterface = require('./PatternInterface');

class ArrayPattern extends implementationOf(PatternInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {(null|PatternInterface)[]} elements
     */
    __construct(location, elements) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {(null|PatternInterface)[]}
         *
         * @private
         */
        this._elements = isArray(elements) ? elements : [ elements ];
    }

    /**
     * @inheritdoc
     */
    get names() {
        const names = [];
        for (const element of this._elements) {
            if (null === element) {
                continue;
            }

            names.push(...element.names);
        }

        return names;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('[ ');

        for (const i in this._elements) {
            const element = this._elements[i];
            if (null !== element) {
                compiler.compileNode(element);
            }

            if (i != this._elements.length - 1) {
                compiler._emit(', ');
            }
        }

        compiler._emit(' ]');
    }
}

module.exports = ArrayPattern;
