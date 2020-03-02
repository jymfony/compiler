const ArrowFunctionExpression = require('./ArrowFunctionExpression');
const CallExpression = require('./CallExpression');
const Identifier = require('./Identifier');
const NodeInterface = require('./NodeInterface');
const VariableDeclaration = require('./VariableDeclaration');
const VariableDeclarator = require('./VariableDeclarator');
const { createHash } = require('crypto');

class AppliedDecorator extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {DecoratorDescriptor} decorator
     * @param {ExpressionInterface[]} args
     */
    __construct(location, decorator, args) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {DecoratorDescriptor}
         *
         * @private
         */
        this._decorator = decorator;

        /**
         * @type {ExpressionInterface[]}
         *
         * @private
         */
        this._args = args;

        /**
         * @type {string}
         *
         * @protected
         */
        this._mangled = undefined;
    }

    /**
     * Gets the decorator descriptor.
     *
     * @returns {DecoratorDescriptor}
     */
    get decorator() {
        return this._decorator;
    }

    /**
     * Gets the priority of the decorator.
     * Used to indicate which decorator should be compiled first.
     *
     * @returns {int}
     */
    get priority() {
        return 0;
    }

    /**
     * Gets the mangled name of the callback.
     *
     * @returns {string}
     */
    get mangledName() {
        if (undefined !== this._mangled) {
            return this._mangled;
        }

        const hash = createHash('sha512');
        hash.update(JSON.stringify(this.location));

        return this._mangled = '__δdecorators__' + this._decorator.name.name.substr(1) + hash.digest().toString('hex');
    }

    /**
     * Gets the callback expression.
     *
     * @returns {Function}
     */
    get callback() {
        return new ArrowFunctionExpression(null, new CallExpression(null, new Identifier(null, this._decorator.mangledName), this._args));
    }

    /**
     * Gets the arguments of the applied decorator.
     *
     * @returns {ExpressionInterface[]}
     */
    get args() {
        return this._args;
    }

    /**
     * Generates code for decorator application.
     *
     * @param {Compiler} compiler
     * @param {Class} class_
     * @param {Class|ClassMemberInterface} target
     * @param {string} variable
     *
     * @returns {StatementInterface[]}
     */
    apply(compiler, class_, target, variable) {
        return this._decorator.apply(compiler, class_, target, variable);
    }

    /**
     * Compiles a decorator.
     *
     * @param {Compiler} compiler
     * @param {Class} class_
     * @param {Class|ClassMemberInterface} target
     *
     * @returns {StatementInterface[]}
     */
    compile(compiler, class_, target) {
        const variableName = compiler.generateVariableName();
        compiler.compileNode(new VariableDeclaration(null, 'const', [
            new VariableDeclarator(null,
                new Identifier(null, variableName),
                new CallExpression(null, new Identifier(null, this._decorator.mangledName), this._args)
            ),
        ]));
        compiler._emit(';\n');

        return this._decorator.apply(compiler, class_, target, variableName);
    }
}

module.exports = AppliedDecorator;
