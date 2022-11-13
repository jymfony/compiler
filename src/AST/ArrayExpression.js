const ExpressionInterface = require('./ExpressionInterface');
const RestElement = require('./RestElement');
const SpreadElement = require('./SpreadElement');

class ArrayExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {(ExpressionInterface|SpreadElement)[]} elements
     */
    __construct(location, elements) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {(ExpressionInterface|SpreadElement)[]}
         *
         * @private
         */
        this._elements = isArray(elements) ? elements : [ elements ];
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('[ ');

        const len = this._elements.length;
        for (let idx = 0; idx < len; idx++) {
            const element = this._elements[idx];
            if (null !== element) {
                compiler.compileNode(element);
            }

            if (element instanceof RestElement || element instanceof SpreadElement) {
                break;
            }

            if (idx !== len - 1) {
                compiler._emit(', ');
            }
        }

        compiler._emit(' ]');
    }
}

module.exports = ArrayExpression;
