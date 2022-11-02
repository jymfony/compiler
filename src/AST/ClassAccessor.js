const { Iife, Undefined, Variable } = require('../Generator');
const AssignmentExpression = require('./AssignmentExpression');
const Argument = require('./Argument');
const ArrayExpression = require('./ArrayExpression');
const BinaryExpression = require('./BinaryExpression');
const BlockStatement = require('./BlockStatement');
const CallExpression = require('./CallExpression');
const ClassMemberInterface = require('./ClassMemberInterface');
const ClassMethod = require('./ClassMethod');
const ForOfStatement = require('./ForOfStatement');
const Identifier = require('./Identifier');
const IfStatement = require('./IfStatement');
const MemberExpression = require('./MemberExpression');
const ReturnStatement = require('./ReturnStatement');
const StringLiteral = require('./StringLiteral');
const VariableDeclaration = require('./VariableDeclaration');
const VariableDeclarator = require('./VariableDeclarator');
const ExpressionStatement = require('./ExpressionStatement');

class ClassAccessor extends implementationOf(ClassMemberInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ExpressionInterface} key
     * @param {ExpressionInterface} value
     * @param {boolean} Static
     * @param {boolean} Private
     */
    __construct(location, key, value, Static, Private) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._key = key;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._value = value;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._static = Static;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._private = Private;

        /**
         * @type {null|Class}
         *
         * @private
         */
        this._class = null;

        /**
         * @type {null|Identifier}
         *
         * @private
         */
        this._privateSymbolIdentifier = null;

        /**
         * @type {null|Identifier}
         *
         * @private
         */
        this._initializerIdentifier = null;

        /**
         * @type {null|string}
         */
        this.docblock = null;

        /**
         * @type {null|AppliedDecorator[]}
         */
        this.decorators = null;
    }

    /**
     * Gets the key.
     *
     * @return {ExpressionInterface}
     */
    get key() {
        return this._key;
    }

    /**
     * Whether this property is static.
     *
     * @return {boolean}
     */
    get static() {
        return this._static;
    }

    /**
     * Whether this property is private.
     *
     * @return {boolean}
     */
    get private() {
        return this._private;
    }

    /**
     * Gets the initialization value.
     *
     * @returns {ExpressionInterface}
     */
    get value() {
        return this._value;
    }

    /**
     * Clears out the initialization value.
     */
    clearValue() {
        this._value = null;
    }

    /**
     * Gets the private symbol backing the auto-accessor.
     *
     * @returns {Identifier|null}
     */
    get privateSymbolIdentifier() {
        return this._privateSymbolIdentifier;
    }

    /**
     * Gets the private symbol backing the auto-accessor initializer.
     *
     * @returns {Identifier|null}
     */
    get initializerIdentifier() {
        return this._initializerIdentifier;
    }

    /**
     * Prepares the accessor for compilation.
     */
    prepare(compiler, class_) {
        if (this._privateSymbolIdentifier) {
            return;
        }

        this._class = class_;
        this._privateSymbolIdentifier = new Identifier(null, compiler.generateVariableName() + '_' + class_.id.name + '_accessor_' + this.key.name + 'Ξ' + (~~(Math.random() * 1000000)).toString(16));
        this._initializerIdentifier = new Identifier(null, this._privateSymbolIdentifier.name + '_init');

        compiler.compileNode(
            new VariableDeclaration(null, 'const', [
                new VariableDeclarator(null, this._privateSymbolIdentifier, new CallExpression(null, new Identifier(null, 'Symbol'))),
                new VariableDeclarator(null, this._initializerIdentifier, new ArrayExpression(null, [])),
            ])
        );
        compiler._emit(';');
        compiler.newLine();

        const getter = new ClassMethod(this.location, new BlockStatement(null, [
            new ReturnStatement(null, new MemberExpression(null, new Identifier(null, 'this'), new StringLiteral(null, this._privateSymbolIdentifier.name), true)),
        ]), this.key, 'get', [], { Static: this.static });

        const arg = new Argument(null, new Identifier(null, 'value'));
        arg.decorators = [];
        const setter = new ClassMethod(this.location, new BlockStatement(null, [
            new AssignmentExpression(null, '=',
                new MemberExpression(null, new Identifier(null, 'this'), new StringLiteral(null, this._privateSymbolIdentifier.name), true),
                new Identifier(null, 'value')
            ),
        ]), this.key, 'set', [ arg ], { Static: this.static });

        class_.body.addMember(getter);
        class_.body.addMember(setter);
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (this._static) {
            compiler._emit('static ');
        }

        compiler._emit('[');
        compiler.compileNode(this._privateSymbolIdentifier);
        compiler._emit(']');

        compiler._emit(' = ');
        compiler.compileNode(Iife.create(new BlockStatement(null, [
            Variable.create('let', 'initialValue', this._value),
            new ForOfStatement(null,
                Variable.create('const', 'initFn'),
                this._initializerIdentifier,
                new BlockStatement(null, [
                    Variable.create('const', 'v', new CallExpression(null, new Identifier(null, 'initFn'), [ new Identifier(null, 'initialValue') ])),
                    new IfStatement(null,
                        new BinaryExpression(null, '!==', new Identifier(null, 'v'), Undefined.create()),
                        new ExpressionStatement(null, new AssignmentExpression(null, '=', new Identifier(null, 'initialValue'), new Identifier(null, 'v')))
                    ),
                ])
            ),
            new ReturnStatement(null, new Identifier(null, 'initialValue')),
        ])));

        compiler._emit(';');
        compiler.newLine();
    }
}

module.exports = ClassAccessor;
