const ClassExpression = require('./ClassExpression');
const FunctionExpression = require('./FunctionExpression');
const ModuleDeclarationInterface = require('./ModuleDeclarationInterface');
const { Variable } = require('../Generator');

class ExportDefaultDeclaration extends implementationOf(ModuleDeclarationInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ExpressionInterface} expression
     */
    __construct(location, expression) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._expression = expression;

        /**
         * @type {string}
         */
        this.docblock = null;
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        if ((this._expression instanceof ClassExpression || this._expression instanceof FunctionExpression) && !this._expression.docblock && this.docblock) {
            this._expression.docblock = this.docblock;
            this.docblock = null;
        }

        this._expression.prepare(compiler);
    }

    /**
     * @inheritdoc
     */
    get shouldBeClosed() {
        return true;
    }

    /**
     * Gets the expression to be default exported.
     *
     * @return {ExpressionInterface}
     */
    get expression() {
        return this._expression;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if ((this._expression instanceof ClassExpression || this._expression instanceof FunctionExpression) && null !== this._expression.id) {
            compiler.compileNode(Variable.create('const', this._expression.id, this._expression));

            compiler._emit(';\nexports.default = ');
            compiler.compileNode(this._expression.id);
        } else {
            compiler._emit('exports.default = ');
            compiler.compileNode(this._expression);
        }
    }
}

module.exports = ExportDefaultDeclaration;
