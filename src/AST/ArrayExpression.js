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

        for (const element of this._elements) {
            if (null !== element) {
                compiler.compileNode(element);
            }

            if (element instanceof RestElement || element instanceof SpreadElement) {
                break;
            }

            compiler._emit(', ');
        }

        compiler._emit(' ]');
    }
}

module.exports = ArrayExpression;
