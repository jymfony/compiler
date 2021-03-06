const ClassExpression = require('./ClassExpression');
const FunctionExpression = require('./FunctionExpression');
const ModuleDeclarationInterface = require('./ModuleDeclarationInterface');
const VariableDeclaration = require('./VariableDeclaration');
const VariableDeclarator = require('./VariableDeclarator');

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

        /**
         * @type {null|[string, ExpressionInterface][]}
         */
        this.decorators = null;
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
        if (null !== this.decorators && (this._expression instanceof ClassExpression || this._expression instanceof FunctionExpression)) {
            this._expression.decorators = this.decorators;
        }

        if ((this._expression instanceof ClassExpression || this._expression instanceof FunctionExpression) && null !== this._expression.id) {
            const declaration = new VariableDeclaration(null, 'const', [
                new VariableDeclarator(null, this._expression.id, this._expression),
            ]);
            declaration.docblock = this.docblock || this._expression.docblock;

            compiler.compileNode(declaration);

            compiler._emit(';\nexports.default = ');
            compiler.compileNode(this._expression.id);
        } else {
            compiler._emit('exports.default = ');
            compiler.compileNode(this._expression);
        }
    }
}

module.exports = ExportDefaultDeclaration;
