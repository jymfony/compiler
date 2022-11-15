const AssignmentExpression = require('./AssignmentExpression');
const CallExpression = require('./CallExpression');
const Identifier = require('./Identifier');
const MemberExpression = require('./MemberExpression');
const StatementInterface = require('./StatementInterface');

class ExpressionStatement extends implementationOf(StatementInterface) {
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
         * @type {null|string}
         */
        this.docblock = null;
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        this._expression.prepare(compiler);
    }

    /**
     * @inheritdoc
     */
    get shouldBeClosed() {
        return false;
    }

    /**
     * Gets the expression of this statement.
     *
     * @returns {ExpressionInterface}
     */
    get expression() {
        return this._expression;
    }

    /**
     * Whether this expression is a possible field declaration (in class method).
     *
     * @return {boolean}
     */
    get isFieldDeclaration() {
        return this._expression instanceof AssignmentExpression &&
            this._expression.left instanceof MemberExpression &&
            this._expression.left.isObjectThis;
    }

    /**
     * Gets the field declaration name.
     *
     * @return {ExpressionInterface}
     */
    get fieldDeclarationExpression() {
        if (! this.isFieldDeclaration) {
            return null;
        }

        return this._expression.left.property;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (
            ! __jymfony.autoload.debug &&
            this._expression instanceof CallExpression &&
            this._expression.callee instanceof Identifier &&
            '__assert' === this._expression.callee.name
        ) {
            return;
        }

        compiler.compileNode(this._expression);
        compiler._emit(';');
        compiler.newLine();
    }
}

module.exports = ExpressionStatement;
