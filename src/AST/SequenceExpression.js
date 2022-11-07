const ExpressionInterface = require('./ExpressionInterface');

class SequenceExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ExpressionInterface[]} expressions
     */
    __construct(location, expressions) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ExpressionInterface[]}
         *
         * @private
         */
        this._expressions = expressions;
    }

    prepare(compiler) {
        for (const expr of this._expressions) {
            if ('function' === typeof expr.prepare) {
                expr.prepare(compiler);
            }
        }
    }

    /**
     * Gets the expressions.
     *
     * @returns {ExpressionInterface[]}
     */
    get expressions() {
        return this._expressions;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        for (const i in this._expressions) {
            compiler.compileNode(this._expressions[i]);

            if (i != this._expressions.length - 1) {
                compiler._emit(', ');
            }
        }
    }
}

module.exports = SequenceExpression;
