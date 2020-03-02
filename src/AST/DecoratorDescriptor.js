const ArrowFunctionExpression = require('./ArrowFunctionExpression');
const BlockStatement = require('./BlockStatement');
const CallExpression = require('./CallExpression');
const Identifier = require('./Identifier');
const MemberExpression = require('./MemberExpression');
const NodeInterface = require('./NodeInterface');
const ObjectExpression = require('./ObjectExpression');
const ObjectProperty = require('./ObjectProperty');
const ReturnStatement = require('./ReturnStatement');
const VariableDeclaration = require('./VariableDeclaration');
const VariableDeclarator = require('./VariableDeclarator');

class DecoratorDescriptor extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {Identifier} name
     * @param {PatternInterface[]} args
     * @param {AppliedDecorator[]} decorators
     */
    __construct(location, name, args, decorators) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {Identifier}
         *
         * @private
         */
        this._name = name;

        /**
         * @type {PatternInterface[]}
         *
         * @private
         */
        this._args = args;

        /**
         * @type {AppliedDecorator[]}
         *
         * @private
         */
        this._decorators = decorators;

        /**
         * @type {string}
         *
         * @private
         */
        this._mangled = undefined;
    }

    /**
     * Gets the decorator name.
     *
     * @returns {Identifier}
     */
    get name() {
        return this._name;
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

        return this._mangled = '__δdecorators__' + this._name.name.substr(1);
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
        const tail = [];
        for (const applied of this._decorators) {
            const variableName = compiler.generateVariableName();
            compiler.compileNode(new VariableDeclaration(null, 'const', [
                new VariableDeclarator(null,
                    new Identifier(null, variableName),
                    new CallExpression(null, new MemberExpression(null, new Identifier(null, variable), new Identifier(null, applied.mangledName)))
                ),
            ]));
            compiler._emit(';\n');

            const statements = applied.apply(compiler, class_, target, variableName);
            if (undefined !== statements) {
                tail.push(...statements);
            }
        }

        return tail;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        const properties = [];
        for (const decorator of this._decorators) {
            properties.push(new ObjectProperty(null, new Identifier(null, decorator.mangledName), decorator.callback));
        }

        compiler.compileNode(new VariableDeclaration(null, 'const', [
            new VariableDeclarator(null, new Identifier(null, this.mangledName), new ArrowFunctionExpression(null, new BlockStatement(null, [
                new ReturnStatement(null, new ObjectExpression(null, properties)),
            ]), null, this._args)),
        ]));
    }
}

module.exports = DecoratorDescriptor;
