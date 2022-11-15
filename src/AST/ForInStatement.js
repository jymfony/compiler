const StatementInterface = require('./StatementInterface');

class ForInStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {VariableDeclaration|ExpressionInterface} left
     * @param {ExpressionInterface} right
     * @param {StatementInterface} body
     */
    __construct(location, left, right, body) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {VariableDeclaration|ExpressionInterface}
         *
         * @private
         */
        this._left = left;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._right = right;

        /**
         * @type {StatementInterface}
         *
         * @private
         */
        this._body = body;
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        this._left.prepare(compiler);
        this._right.prepare(compiler);
        this._body.prepare(compiler);
    }

    /**
     * @inheritdoc
     */
    get shouldBeClosed() {
        return false;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('for (');
        compiler.compileNode(this._left);
        compiler._emit(' in ');
        compiler.compileNode(this._right);
        compiler._emit(')');

        compiler.compileNode(this._body);
    }
}

module.exports = ForInStatement;
