const AssignmentExpression = require('./AssignmentExpression');
const ExpressionStatement = new __jymfony.ManagedProxy(global.Function, proxy => {
    proxy.target = require('./ExpressionStatement');
    proxy.initializer = undefined;
});
const Identifier = require('./Identifier');
const MemberExpression = require('./MemberExpression');
const NodeInterface = require('./NodeInterface');
const NullLiteral = require('./NullLiteral');
const StringLiteral = require('./StringLiteral');

class Function extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {BlockStatement} body
     * @param {Identifier|null} [id]
     * @param {Argument[]} params
     * @param {boolean} generator
     * @param {boolean} async
     */
    __construct(location, body, id = null, params = [], { generator = false, async = false } = {}) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {BlockStatement}
         *
         * @private
         */
        this._body = body;

        /**
         * @type {Identifier}
         *
         * @private
         */
        this._id = id || new Identifier(null, '_anonymous_xΞ' + (~~(Math.random() * 1000000)).toString(16));

        /**
         * @type {Argument[]}
         *
         * @private
         */
        this._params = params;
        for (const param of params) {
            param.function = this;
        }

        /**
         * @type {boolean}
         *
         * @private
         */
        this._generator = generator;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._async = async;

        /**
         * @type {null|string}
         */
        this.docblock = null;
    }

    /**
     * Gets the function identifier.
     *
     * @returns {Identifier}
     */
    get id() {
        return this._id;
    }

    /**
     * Gets the function name.
     *
     * @return {string}
     */
    get name() {
        return this._id.name;
    }

    /**
     * Gets the function parameters.
     *
     * @returns {Argument[]}
     */
    get params() {
        return this._params;
    }

    /**
     * Gets the function body (block statement).
     *
     * @return {BlockStatement}
     */
    get body() {
        return this._body;
    }

    /**
     * Whether the function is a generator.
     *
     * @return {boolean}
     */
    get generator() {
        return this._generator;
    }

    /**
     * Whether the function is async.
     *
     * @return {boolean}
     */
    get async() {
        return this._async;
    }

    /**
     * Compiles the docblock registration code.
     *
     * @param {Compiler} compiler
     * @param {Identifier} id
     */
    compileDocblock(compiler, id) {
        return [
            new ExpressionStatement(null, new AssignmentExpression(
                null, '=',
                new MemberExpression(null, id, new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'docblock'), false), true),
                this.docblock ? new StringLiteral(null, JSON.stringify(this.docblock)) : new NullLiteral(null)
            )),
        ];
    }

    static compileParams(compiler, params) {
        compiler._emit('(');
        for (const i in params) {
            compiler.compileNode(params[i]);
            if (i != params.length - 1) {
                compiler._emit(',');
            }
        }
        compiler._emit(')');
    }
}

module.exports = Function;
