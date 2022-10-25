const ArrowFunctionExpression = require('./ArrowFunctionExpression');
const AssignmentExpression = require('./AssignmentExpression');
const BinaryExpression = require('./BinaryExpression');
const BlockStatement = require('./BlockStatement');
const CallExpression = require('./CallExpression');
const ClassMethod = require('./ClassMethod');
const ClassProperty = require('./ClassProperty');
const ExpressionStatement = require('./ExpressionStatement');
const Identifier = require('./Identifier');
const IfStatement = require('./IfStatement');
const MemberExpression = require('./MemberExpression');
const NodeInterface = require('./NodeInterface');
const NullLiteral = require('./NullLiteral');
const ObjectExpression = require('./ObjectExpression');
const ObjectProperty = require('./ObjectProperty');
const ReturnStatement = require('./ReturnStatement');
const StringLiteral = require('./StringLiteral');
const ValueHolder = require('../ValueHolder');
const VariableDeclaration = require('./VariableDeclaration');
const VariableDeclarator = require('./VariableDeclarator');
const UnaryExpression = require('./UnaryExpression');

/**
 * @abstract
 */
class Class extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ClassBody} body
     * @param {Identifier|null} [id]
     * @param {ExpressionInterface|null} [superClass]
     */
    __construct(location, body, id = null, superClass = null) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ClassBody}
         *
         * @private
         */
        this._body = body;

        /**
         * @type {Identifier|null}
         *
         * @private
         */
        this._id = id || new Identifier(null, '_anonymous_xΞ' + (~~(Math.random() * 1000000)).toString(16));

        /**
         * @type {ExpressionInterface|null}
         *
         * @private
         */
        this._superClass = superClass;

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
     * Gets the class name.
     *
     * @return {string}
     */
    get name() {
        return this._id ? this._id.name : null;
    }

    /**
     * Gets the class identifier.
     *
     * @return {Identifier}
     */
    get id() {
        return this._id;
    }

    /**
     * Gets the class body.
     *
     * @return {ClassBody}
     */
    get body() {
        return this._body;
    }

    /**
     * Gets the superclass.
     *
     * @returns {null|ExpressionInterface}
     */
    get superClass() {
        return this._superClass;
    }

    /**
     * Sets the superclass.
     *
     * @param {null|ExpressionInterface} superClass
     */
    set superClass(superClass) {
        this._superClass = superClass;
    }

    /**
     * Class has constructor.
     *
     * @returns {boolean}
     */
    get hasConstructor() {
        for (const member of this._body._body) {
            if (member instanceof ClassMethod) {
                const id = member._id;
                if (null !== id && 'constructor' === id._name) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Returns the class constructor or null.
     *
     * @returns {ClassMethod|null}
     */
    getConstructor() {
        for (const member of this._body._body) {
            if (member instanceof ClassMethod) {
                const id = member._id;
                if (null !== id && 'constructor' === id._name) {
                    return member;
                }
            }
        }

        return null;
    }

    /**
     * Returns the class member with given name or null.
     *
     * @param {string} name
     *
     * @returns {ClassMemberInterface|null}
     */
    getMember(name) {
        for (const member of this._body._body) {
            const id = member.key;
            if (null !== id && name === id.name) {
                return member;
            }
        }

        return null;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        this._prepare();

        compiler._emit('class ');
        compiler.compileNode(this._id);

        if (this._superClass) {
            compiler._emit(' extends ');
            compiler.compileNode(this._superClass);
        }

        compiler.indentationLevel++;
        compiler._emit(' {');
        compiler.compileNode(this._body);
        compiler.indentationLevel--;
        compiler.newLine();
        compiler._emit('}');
        compiler.newLine();
    }

    _prepare() {
        if (this._prepared) {
            return;
        }

        this._prepared = true;

        const members = this._body.members;
        const fields = [];
        const staticFields = [];
        const decoratorCalls = [];

        /** @type {ClassProperty[]} */
        const initializableFields = [];
        const propertyNames = members
            .filter(m => m instanceof ClassProperty)
            .filter(m => m.key instanceof Identifier)
            .map(m => (m.private ? '#' : '') + m.key.name);

        for (const member of members) {
            if (null === member.location) {
                continue;
            }

            if (member instanceof ClassMethod) {
                if ('constructor' === member.name || '__construct' === member.name) {
                    for (const statement of member.body.statements) {
                        if (!statement.isFieldDeclaration) {
                            continue;
                        }

                        const declaredField = statement.fieldDeclarationExpression;
                        if (!(declaredField instanceof Identifier)) {
                            continue;
                        }

                        if (propertyNames.includes(declaredField.name)) {
                            continue;
                        }

                        const accessor = new MemberExpression(null, new Identifier(null, 'obj'), declaredField);
                        const setterBody = new AssignmentExpression(null, '=', accessor, new Identifier(null, 'value'));

                        fields.push(
                            new ObjectProperty(null, declaredField, new ObjectExpression(null, [
                                new ObjectProperty(null, new Identifier(null, 'get'), new ArrowFunctionExpression(null, accessor, null, [ new Identifier(null, 'obj') ])),
                                new ObjectProperty(null, new Identifier(null, 'set'), new ArrowFunctionExpression(null, setterBody, null, [ new Identifier(null, 'obj'), new Identifier(null, 'value') ])),
                                new ObjectProperty(null, new Identifier(null, 'docblock'), statement.docblock ? new StringLiteral(null, JSON.stringify(statement.docblock)) : new NullLiteral(null)),
                            ]))
                        );
                    }
                } else {
                    const isPrivate = member.private;
                    const key = member.key;
                    for (const [ idx, param ] of __jymfony.getEntries(member.params)) {
                        for (/** @type {AppliedDecorator} */ const decorator of param.decorators) {
                            decoratorCalls.push(new CallExpression(null, decorator.expression, [
                                new Identifier(null, 'undefined'),
                                new ObjectExpression(null, [
                                    new ObjectProperty(null, new Identifier(null, 'kind'), new StringLiteral(null, '"parameter"')),
                                    new ObjectProperty(null, new Identifier(null, 'target'), new Identifier(null, 'this')),
                                    new ObjectProperty(null, new Identifier(null, 'name'), key instanceof Identifier ? new StringLiteral(null, JSON.stringify((isPrivate ? '#' : '') + key.name)) : key),
                                    new ObjectProperty(null, new Identifier(null, 'private'), new StringLiteral(null, JSON.stringify(isPrivate))),
                                    new ObjectProperty(null, new Identifier(null, 'parameterIndex'), new StringLiteral(null, idx.toString())),
                                ]),
                            ]));
                        }
                    }
                }
            }

            if (member instanceof ClassProperty) {
                const accessor = new MemberExpression(
                    null,
                    member.static ? this._id : new Identifier(null, 'obj'),
                    member.private ? new Identifier(null, '#' + member.key.name) : member.key,
                    !(member.key instanceof Identifier)
                );
                const setterBody = new AssignmentExpression(null, '=', accessor, new Identifier(null, 'value'));

                let key = member.key;
                if (member.key instanceof Identifier && member.private) {
                    key = new StringLiteral(null, JSON.stringify('#' + member.key.name));
                }

                const prop = new ObjectProperty(null, key, new ObjectExpression(null, [
                    new ObjectProperty(null, new Identifier(null, 'get'), new ArrowFunctionExpression(null, accessor, null, [ new Identifier(null, 'obj') ])),
                    new ObjectProperty(null, new Identifier(null, 'set'), new ArrowFunctionExpression(null, setterBody, null, [ new Identifier(null, 'obj'), new Identifier(null, 'value') ])),
                    new ObjectProperty(null, new Identifier(null, 'docblock'), member.docblock ? new StringLiteral(null, JSON.stringify(member.docblock)) : new NullLiteral(null)),
                ]));

                if (member.static) {
                    staticFields.push(prop);
                } else {
                    fields.push(prop);
                    if (! member.private) {
                        initializableFields.push(member);
                    }
                }
            }
        }

        const reflectionFields = [
            new ObjectProperty(null, new Identifier(null, 'fields'), new ObjectExpression(null, fields)),
            new ObjectProperty(null, new Identifier(null, 'staticFields'), new ObjectExpression(null, staticFields)),
        ];

        members.push(new ClassMethod(
            null,
            new BlockStatement(null, [
                ...(0 < decoratorCalls.length ? [ new IfStatement(null,
                    new UnaryExpression(null, '!', new MemberExpression(null, new Identifier(null, 'this'), new Identifier(null, '__jymfony_parameters_reflection'))),
                    new BlockStatement(null, [
                        ...decoratorCalls,
                        new AssignmentExpression(null, '=', new MemberExpression(null, new Identifier(null, 'this'), new Identifier(null, '__jymfony_parameters_reflection')), new StringLiteral(null, 'true')),
                    ]),
                ) ] : []),
                new ReturnStatement(null, new ObjectExpression(null, reflectionFields)),
            ]),
            new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'reflection'), false),
            'get',
            [],
            { Static: true }
        ));

        const fieldsInitializators = initializableFields.map(p => {
            this._body.removeMember(p);

            return new CallExpression(
                p.location,
                new MemberExpression(null, new Identifier(null, 'Object'), new Identifier(null, 'defineProperty'), false),
                [
                    new Identifier(null, 'this'),
                    p.key instanceof Identifier ? new StringLiteral(null, JSON.stringify(p.key.name)) : p.key,
                    new ObjectExpression(null, [
                        new ObjectProperty(null, new Identifier(null, 'writable'), new StringLiteral(null, 'true')),
                        new ObjectProperty(null, new Identifier(null, 'enumerable'), new StringLiteral(null, 'true')),
                        new ObjectProperty(null, new Identifier(null, 'configurable'), new StringLiteral(null, 'true')),
                        new ObjectProperty(null, new Identifier(null, 'value'), null !== p.value ? p.value : new Identifier(null, 'undefined')),
                    ]),
                ]
            );
        });

        if (fieldsInitializators.length) {
            const parentCall = new IfStatement(null,
                new BinaryExpression(null, '!==', new Identifier(null, 'undefined'), new MemberExpression(null, new Identifier(null, 'super'), new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, '__jymfony_field_initialization'), false), true)),
                new CallExpression(null, new MemberExpression(null, new Identifier(null, 'super'), new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, '__jymfony_field_initialization'), false), true), []),
            );

            members.push(new ClassMethod(
                null,
                new BlockStatement(null, [ parentCall, ...fieldsInitializators ]),
                new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, '__jymfony_field_initialization'), false),
                'method'
            ));
        }
    }

    /**
     * Compiles the docblock registration code.
     *
     * @param {Compiler} compiler
     * @param {Identifier} id
     */
    compileDocblock(compiler, id) {
        const tail = [
            new ExpressionStatement(null, new AssignmentExpression(
                null, '=',
                new MemberExpression(null, id, new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'docblock'), false), true),
                this.docblock ? new StringLiteral(null, JSON.stringify(this.docblock)) : new NullLiteral(null)
            )),
        ];

        for (const member of this._body.members) {
            if (! member.docblock || ! (member instanceof ClassMethod)) {
                continue;
            }

            if ('method' === member.kind) {
                tail.push(new ExpressionStatement(null, new AssignmentExpression(
                    null,
                    '=',
                    new MemberExpression(
                        null,
                        new MemberExpression(
                            null,
                            member.static ? id : new MemberExpression(null, id, new Identifier(null, 'prototype')),
                            member.id,
                            ! (member.id instanceof Identifier)
                        ),
                        new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'docblock'), false),
                        true,
                    ),
                    member.docblock ? new StringLiteral(null, JSON.stringify(member.docblock)) : new NullLiteral(null)
                )));
            } else if ('get' === member.kind || 'set' === member.kind) {
                tail.push(new ExpressionStatement(null, new AssignmentExpression(
                    null,
                    '=',
                    new MemberExpression(
                        null,
                        new MemberExpression(
                            null,
                            new CallExpression(null, new MemberExpression(null, new Identifier(null, 'Object'), new Identifier(null, 'getOwnPropertyDescriptor'), false), [
                                member.static ? id : new MemberExpression(null, id, new Identifier(null, 'prototype'), false),
                                member.id instanceof Identifier ? new StringLiteral(null, JSON.stringify(member.id.name)) : member.id,
                            ]),
                            new Identifier(null, member.kind),
                            false
                        ),
                        new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'docblock'), false),
                        true,
                    ),
                    member.docblock ? new StringLiteral(null, JSON.stringify(member.docblock)) : new NullLiteral(null)
                )));
            }
        }

        return tail;
    }

    /**
     * Compiles the decorators upon this class.
     *
     * @param {Jymfony.Component.Autoloader.Parser.Compiler} compiler
     *
     * @returns {StatementInterface[]}
     */
    compileDecorators(compiler) {
        const tail = [];
        if (null !== this.decorators && 0 !== this.decorators.length) {
            const targetRef = new ValueHolder(this);
            for (const decorator of this.decorators) {
                tail.push(...decorator.compile(compiler, this, this, targetRef, null, this.id, null));
            }
        }

        for (const member of [ ...this._body.members ]) {
            const memberName = member.key instanceof Identifier ? member.key : new Identifier(null, '_name_xΞ' + (~~(Math.random() * 1000000)).toString(16));
            const targetRef = new ValueHolder(member);
            const originalName = member.key;

            const tempSymbol = new Identifier(null, compiler.generateVariableName() + '_' + this.id.name + '_temp_' + memberName.name + 'Ξ' + (~~(Math.random() * 1000000)).toString(16));
            const isPrivate = member.private;
            const isStatic = member.static;
            const kind = member.kind;
            const decorators = member.decorators || [];

            for (const [ i, decorator ] of __jymfony.getEntries(decorators)) {
                const privateSymbol = new Identifier(null, compiler.generateVariableName() + '_' + this.id.name + '_private_' + memberName.name + 'Ξ' + (~~(Math.random() * 1000000)).toString(16));

                compiler.compileNode(new VariableDeclaration(null, 'const', [
                    new VariableDeclarator(null, privateSymbol, new CallExpression(null, new Identifier(null, 'Symbol'), [])),
                ]));
                compiler._emit(';');
                compiler.newLine();

                if (member instanceof ClassMethod) {
                    if (i === decorators.length - 1) {
                        compiler.compileNode(new VariableDeclaration(null, 'const', [
                            new VariableDeclarator(null, tempSymbol, new CallExpression(null, new Identifier(null, 'Symbol'), [])),
                        ]));
                        compiler._emit(';');
                        compiler.newLine();

                        tail.unshift(new UnaryExpression(null, 'delete',
                            new MemberExpression(null,
                                isStatic ? this.id : new MemberExpression(null, this.id, new Identifier(null, 'prototype')),
                                tempSymbol,
                                true
                            )
                        ));

                        if ('method' === kind) {
                            this.body.addMember(new ClassProperty(null, originalName, new MemberExpression(null, this.id, privateSymbol, true), isPrivate, isStatic));
                        } else {
                            this.body.addMember(new ClassMethod(null, new BlockStatement(null, [
                                // Return C[sym].call(this, ...args)
                                new ReturnStatement(null, new CallExpression(null,
                                    new MemberExpression(null, new MemberExpression(null, this.id, privateSymbol, true), new Identifier(null, 'call')),
                                    [
                                        new Identifier(null, 'this'),
                                        ...member.params,
                                    ]
                                )),
                            ]), originalName, kind, member.params, {
                                Static: isStatic,
                                Private: isPrivate,
                            }));
                        }
                    } else if (0 === i) {
                        member._id = new StringLiteral(null, tempSymbol.name);
                        member._private = false;
                        member._static = false;
                        member._kind = 'method';
                    }
                }

                tail.push(...decorator.compile(compiler, this, member, targetRef, privateSymbol, originalName, kind));

                if (member instanceof ClassMethod) {
                    this.body.addMember(targetRef.value);
                }
            }
        }

        return tail;
    }
}

module.exports = Class;
