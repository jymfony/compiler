const StatementInterface = require('./StatementInterface');

class ForStatement extends implementationOf(StatementInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {null|VariableDeclaration|ExpressionInterface} init
     * @param {ExpressionInterface} test
     * @param {ExpressionInterface} update
     * @param {StatementInterface} body
     */
    __construct(location, init, test, update, body) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {null|VariableDeclaration|ExpressionInterface}
         *
         * @private
         */
        this._init = init;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._test = test;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._update = update;

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
    compile(compiler) {
        compiler._emit('for (');

        if (null !== this._init) {
            compiler.compileNode(this._init);
        }
        compiler._emit(';');

        if (null !== this._test) {
            compiler.compileNode(this._test);
        }
        compiler._emit(';');

        if (null !== this._update) {
            compiler.compileNode(this._update);
        }
        compiler._emit(')');

        compiler.compileNode(this._body);
    }
}

module.exports = ForStatement;
