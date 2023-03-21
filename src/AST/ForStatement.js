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
     * Gets the initializer expression (if present).
     *
     * @returns {ExpressionInterface | null}
     */
    get init() {
        return this._init;
    }

    /**
     * Gets the body of the for loop (the statements to execute).
     *
     * @returns {StatementInterface}
     */
    get body() {
        return this._body;
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        if (null !== this._init) {
            this._init.prepare(compiler);
        }

        if (null !== this._test) {
            this._test.prepare(compiler);
        }

        if (null !== this._update) {
            this._update.prepare(compiler);
        }

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
