const { Member, Undefined, Variable } = require('../Generator');
const ArrowFunctionExpression = require('./ArrowFunctionExpression');
const AssignmentExpression = require('./AssignmentExpression');
const BinaryExpression = require('./BinaryExpression');
const BlockStatement = require('./BlockStatement');
const CallExpression = require('./CallExpression');
const ClassMethod = require('./ClassMethod');
const ClassProperty = require('./ClassProperty');
const ClassPrototypeProperty = require('./ClassPrototypeProperty');
const FunctionExpression = require('./FunctionExpression');
const Identifier = require('./Identifier');
const IfStatement = require('./IfStatement');
const MemberExpression = require('./MemberExpression');
const NodeInterface = require('./NodeInterface');
const NumberLiteral = require('./NumberLiteral');
const ObjectExpression = require('./ObjectExpression');
const ObjectProperty = require('./ObjectProperty');
const ReturnStatement = require('./ReturnStatement');
const SpreadElement = require('./SpreadElement');
const StringLiteral = require('./StringLiteral');
const ValueHolder = require('../ValueHolder');
const UnaryExpression = require('./UnaryExpression');

let typeId = Math.round(Math.random() * 1000000);

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

        /**
         * @type {number}
         *
         * @private
         */
        this._typeId = typeId++;

        /**
         * @type {ExpressionInterface | null}
         *
         * @private
         */
        this._fieldInitializer = null;

        /**
         * @type {ExpressionInterface[]}
         *
         * @private
         */
        this._decoratorCalls = [];
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
        this._prepare(compiler);

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

        compiler.compileNode(new CallExpression(
            this.location,
            Member.create('Object', 'defineProperty'),
            [
                this._id,
                Member.create('Symbol', 'reflection'),
                new ObjectExpression(null, [
                    new ObjectProperty(null, new Identifier(null, 'writable'), new StringLiteral(null, 'false')),
                    new ObjectProperty(null, new Identifier(null, 'enumerable'), new StringLiteral(null, 'false')),
                    new ObjectProperty(null, new Identifier(null, 'configurable'), new StringLiteral(null, 'true')),
                    new ObjectProperty(null, new Identifier(null, 'value'), new NumberLiteral(null, this._typeId)),
                ]),
            ]
        ));
        compiler._emit(';');
        compiler.newLine();

        if (null !== this._fieldInitializer) {
            compiler.compileNode(new CallExpression(
                this.location,
                Member.create('Object', 'defineProperty'),
                [
                    Member.create(this._id, 'prototype'),
                    this._fieldInitializer.id,
                    new ObjectExpression(null, [
                        new ObjectProperty(null, new Identifier(null, 'writable'), new StringLiteral(null, 'false')),
                        new ObjectProperty(null, new Identifier(null, 'enumerable'), new StringLiteral(null, 'false')),
                        new ObjectProperty(null, new Identifier(null, 'configurable'), new StringLiteral(null, 'true')),
                        new ObjectProperty(null, new Identifier(null, 'value'), this._fieldInitializer),
                    ]),
                ]
            ));
            compiler._emit(';');
            compiler.newLine();
        }

        this._body.members.forEach(p => {
            if (! (p instanceof ClassPrototypeProperty)) {
                return;
            }

            this._body.removeMember(p);

            compiler.compileNode(new CallExpression(
                p.location,
                Member.create('Object', 'defineProperty'),
                [
                    Member.create(this._id, 'prototype'),
                    p.key instanceof Identifier ? new StringLiteral(null, JSON.stringify(p.key.name)) : p.key,
                    new ObjectExpression(null, [
                        new ObjectProperty(null, new Identifier(null, 'writable'), new StringLiteral(null, 'true')),
                        new ObjectProperty(null, new Identifier(null, 'enumerable'), new StringLiteral(null, 'true')),
                        new ObjectProperty(null, new Identifier(null, 'configurable'), new StringLiteral(null, 'true')),
                        new ObjectProperty(null, new Identifier(null, 'value'), null !== p.value ? p.value : Undefined.create()),
                    ]),
                ]
            ));
            compiler._emit(';');
            compiler.newLine();
        });

        this._decoratorCalls.forEach(node => {
            compiler.compileNode(node);
            compiler._emit(';');
            compiler.newLine();
        });
    }

    _prepare(compiler) {
        if (this._prepared) {
            return;
        }

        const ClassAccessor = require('./ClassAccessor');
        this._prepared = true;

        this._decoratorCalls.push(new CallExpression(
            null,
            Member.create('Object', 'defineProperty'),
            [
                this._id,
                Member.create('Symbol', 'metadata'),
                new ObjectExpression(null, [
                    new ObjectProperty(null, new Identifier(null, 'writable'), new StringLiteral(null, 'false')),
                    new ObjectProperty(null, new Identifier(null, 'enumerable'), new StringLiteral(null, 'false')),
                    new ObjectProperty(null, new Identifier(null, 'configurable'), new StringLiteral(null, 'true')),
                    new ObjectProperty(null, new Identifier(null, 'value'), new CallExpression(null, new Identifier(null, 'Symbol'))),
                ]),
            ]
        ));

        compiler._reflectionData.set(this._typeId, this);

        const members = this._body.members;
        const fields = [];
        const staticFields = [];
        const methods = [];
        const staticMethods = [];

        /** @type {ClassProperty[]} */
        const initializableFields = [];

        for (const member of members) {
            if (null === member.location) {
                continue;
            }

            if (member instanceof ClassMethod) {
                if (member.private) {
                    const accessor = new MemberExpression(
                        null,
                        member.static ? this._id : new Identifier(null, 'obj'),
                        new Identifier(null, '#' + member.key.name),
                        !(member.key instanceof Identifier)
                    );

                    const varName = compiler.generateVariableName();
                    const prop = new ObjectProperty(null, member.key, new ObjectExpression(null, [
                        new ObjectProperty(
                            null,
                            new Identifier(null, 'call'),
                            new ArrowFunctionExpression(null,
                                new CallExpression(null, accessor, [ new SpreadElement(null, new Identifier(null, 'args')) ]),
                                null,
                                [ new Identifier(null, 'obj'), new SpreadElement(null, new Identifier(null, 'args')) ]
                            )
                        ),
                        new ObjectProperty(
                            null,
                            new Identifier(null, 'metadataKey'),
                            new ArrowFunctionExpression(null,
                                new BlockStatement(null, [
                                    Variable.create('const', varName, new CallExpression(null, Member.create('Object', 'getOwnPropertyDescriptor'), [
                                        Member.create(this._id, ...(member.static ? [] : [ 'prototype' ]), '#' + member.key.name),
                                        Member.create('Symbol', 'metadata'),
                                    ])),
                                    new IfStatement(null, new BinaryExpression(null, '===', Undefined.create(), new Identifier(null, varName)), new CallExpression(null, Member.create('Object', 'defineProperty'), [
                                        Member.create(this._id, ...(member.static ? [] : [ 'prototype' ]), '#' + member.key.name), Member.create('Symbol', 'metadata'), new ObjectExpression(null, [
                                            new ObjectProperty(null, new Identifier(null, 'writable'), new StringLiteral(null, 'false')),
                                            new ObjectProperty(null, new Identifier(null, 'enumerable'), new StringLiteral(null, 'false')),
                                            new ObjectProperty(null, new Identifier(null, 'configurable'), new StringLiteral(null, 'true')),
                                            new ObjectProperty(null, new Identifier(null, 'value'), new CallExpression(null, new Identifier(null, 'Symbol'))),
                                        ]) ]
                                    )),
                                    new ReturnStatement(null, new MemberExpression(null, Member.create(this._id, ...(member.static ? [] : [ 'prototype' ]), '#' + member.key.name), Member.create('Symbol', 'metadata'), true)),
                                ]),
                            )
                        ),
                    ]));

                    (member.static ? staticMethods : methods).push(prop);
                    for (const [ idx, param ] of __jymfony.getEntries(member.params)) {
                        for (/** @type {AppliedDecorator} */ const decorator of param.decorators) {
                            this._decoratorCalls.push(new CallExpression(null, decorator.expression, [
                                Undefined.create(),
                                new ObjectExpression(null, [
                                    new ObjectProperty(null, new Identifier(null, 'kind'), new StringLiteral(null, '"parameter"')),
                                    new ObjectProperty(null, new Identifier(null, 'name'), new StringLiteral(null, JSON.stringify('#' + member.key.name))),
                                    new ObjectProperty(null, new Identifier(null, 'private'), new StringLiteral(null, 'true')),
                                    new ObjectProperty(null, new Identifier(null, 'parameterIndex'), new StringLiteral(null, idx.toString())),
                                    new ObjectProperty(null, new Identifier(null, 'metadataKey'), new CallExpression(null,
                                        Member.create(
                                            new MemberExpression(null, this._id, Member.create('Symbol', 'jymfony_private_accessors'), true),
                                            (member.static ? 'staticMethods' : 'methods'),
                                            member.id,
                                            'metadataKey',
                                        )
                                    )),
                                    new ObjectProperty(null, new Identifier(null, 'class'), new ObjectExpression(null, [
                                        ...(this._id instanceof Identifier ? [ new ObjectProperty(null, new Identifier(null, 'name'), new StringLiteral(null, JSON.stringify(this._id.name))) ] : []),
                                        new ObjectProperty(null, new Identifier(null, 'metadataKey'), new MemberExpression(null, this._id, Member.create('Symbol', 'metadata'), true)),
                                    ])),
                                ]),
                            ]));
                        }
                    }

                    continue;
                }

                const key = 'constructor' === member.key.name ? this._id : new MemberExpression(
                    null,
                    member.static ? this._id : Member.create(this._id, 'prototype'),
                    member.key,
                    !(member.key instanceof Identifier),
                );

                if ('constructor' !== member.key.name) {
                    this._decoratorCalls.push(new CallExpression(
                        null,
                        Member.create('Object', 'defineProperty'),
                        [
                            key,
                            Member.create('Symbol', 'metadata'),
                            new ObjectExpression(null, [
                                new ObjectProperty(null, new Identifier(null, 'writable'), new StringLiteral(null, 'false')),
                                new ObjectProperty(null, new Identifier(null, 'enumerable'), new StringLiteral(null, 'false')),
                                new ObjectProperty(null, new Identifier(null, 'configurable'), new StringLiteral(null, 'true')),
                                new ObjectProperty(null, new Identifier(null, 'value'), new CallExpression(null, new Identifier(null, 'Symbol'))),
                            ]),
                        ]
                    ));
                }

                for (const [ idx, param ] of __jymfony.getEntries(member.params)) {
                    for (/** @type {AppliedDecorator} */ const decorator of param.decorators) {
                        this._decoratorCalls.push(new CallExpression(null, decorator.expression, [
                            Undefined.create(),
                            new ObjectExpression(null, [
                                new ObjectProperty(null, new Identifier(null, 'kind'), new StringLiteral(null, '"parameter"')),
                                new ObjectProperty(null, new Identifier(null, 'name'), key instanceof Identifier ? new StringLiteral(null, JSON.stringify(key.name)) : key),
                                new ObjectProperty(null, new Identifier(null, 'private'), new StringLiteral(null, 'false')),
                                new ObjectProperty(null, new Identifier(null, 'parameterIndex'), new StringLiteral(null, idx.toString())),
                                new ObjectProperty(null, new Identifier(null, 'metadataKey'), new MemberExpression(null, key, Member.create('Symbol', 'metadata'), true)),
                                new ObjectProperty(null, new Identifier(null, 'class'), new ObjectExpression(null, [
                                    ...(this._id instanceof Identifier ? [ new ObjectProperty(null, new Identifier(null, 'name'), new StringLiteral(null, JSON.stringify(this._id.name))) ] : []),
                                    new ObjectProperty(null, new Identifier(null, 'metadataKey'), new MemberExpression(null, this._id, Member.create('Symbol', 'metadata'), true)),
                                ])),
                            ]),
                        ]));
                    }
                }
            } else {
                /**
                 * @param {ClassProperty | ClassAccessor} member
                 */
                const initReflection = (member) => {
                    if (!member.private) {
                        return;
                    }

                    const accessor = new MemberExpression(
                        null,
                        member.static ? this._id : new Identifier(null, 'obj'),
                        new Identifier(null, '#' + member.key.name),
                        !(member.key instanceof Identifier)
                    );
                    const setterBody = new AssignmentExpression(null, '=', accessor, new Identifier(null, 'value'));

                    let key = member.key;
                    if (member.key instanceof Identifier) {
                        key = new StringLiteral(null, JSON.stringify('#' + member.key.name));
                    }

                    const prop = new ObjectProperty(null, key, new ObjectExpression(null, [
                        new ObjectProperty(null, new Identifier(null, 'get'), new ArrowFunctionExpression(null, accessor, null, [ new Identifier(null, 'obj') ])),
                        new ObjectProperty(null, new Identifier(null, 'set'), new ArrowFunctionExpression(null, setterBody, null, [ new Identifier(null, 'obj'), new Identifier(null, 'value') ])),
                    ]));

                    if (member.static) {
                        staticFields.push(prop);
                    } else {
                        fields.push(prop);
                    }
                };

                if (member instanceof ClassProperty && !(member instanceof ClassPrototypeProperty)) {
                    initReflection(member);
                    if (!member.static && !member.private) {
                        initializableFields.push(member);
                    }
                } else if (member instanceof ClassAccessor) {
                    initReflection(member);
                    member.prepare(compiler, this);
                }
            }
        }

        if (0 < fields.length + staticFields.length + methods.length + staticMethods.length) {
            const reflectionFields = [
                new ObjectProperty(null, new Identifier(null, 'fields'), new ObjectExpression(null, fields)),
                new ObjectProperty(null, new Identifier(null, 'staticFields'), new ObjectExpression(null, staticFields)),
                new ObjectProperty(null, new Identifier(null, 'methods'), new ObjectExpression(null, methods)),
                new ObjectProperty(null, new Identifier(null, 'staticMethods'), new ObjectExpression(null, staticMethods)),
            ];

            members.push(new ClassMethod(
                null,
                new BlockStatement(null, [
                    new ReturnStatement(null, new ObjectExpression(null, reflectionFields)),
                ]),
                Member.create('Symbol', 'jymfony_private_accessors'),
                'get',
                [],
                {Static: true}
            ));
        }

        const fieldsInitializers = initializableFields.map(p => {
            if (p instanceof ClassPrototypeProperty) {
                return null;
            }

            this._body.removeMember(p);

            return new CallExpression(
                p.location,
                Member.create('Object', 'defineProperty'),
                [
                    new Identifier(null, 'this'),
                    p.key instanceof Identifier ? new StringLiteral(null, JSON.stringify(p.key.name)) : p.key,
                    new ObjectExpression(null, [
                        new ObjectProperty(null, new Identifier(null, 'writable'), new StringLiteral(null, 'true')),
                        new ObjectProperty(null, new Identifier(null, 'enumerable'), new StringLiteral(null, 'true')),
                        new ObjectProperty(null, new Identifier(null, 'configurable'), new StringLiteral(null, 'true')),
                        new ObjectProperty(null, new Identifier(null, 'value'), null !== p.value ? p.value : Undefined.create()),
                    ]),
                ]
            );
        }).filter(i => !!i);

        if (fieldsInitializers.length) {
            const parentCall = [
                Variable.create('const', 'superClass', new CallExpression(null, Member.create('Object', 'getPrototypeOf'), [ Member.create(this._id, 'prototype') ])),
                Variable.create('const', 'superCall', new MemberExpression(null, new Identifier(null, 'superClass'), Member.create('Symbol', '__jymfony_field_initialization'), true)),
                new IfStatement(null,
                    new BinaryExpression(null, '!==', Undefined.create(), new MemberExpression(null, new Identifier(null, 'superClass'), Member.create('Symbol', '__jymfony_field_initialization'), true)),
                    new CallExpression(null, Member.create('superCall', 'apply'), [ new Identifier(null, 'this') ]),
                ),
            ];

            this._fieldInitializer = new FunctionExpression(
                null,
                new BlockStatement(null, [ ...parentCall, ...fieldsInitializers ]),
                Member.create('Symbol', '__jymfony_field_initialization'),
            );
        }
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

                compiler.compileNode(Variable.create('const', privateSymbol, new CallExpression(null, new Identifier(null, 'Symbol'))));
                compiler._emit(';');
                compiler.newLine();

                if (member instanceof ClassMethod) {
                    if (i === decorators.length - 1) {
                        compiler.compileNode(Variable.create('const', tempSymbol, new CallExpression(null, new Identifier(null, 'Symbol'))));
                        compiler._emit(';');
                        compiler.newLine();

                        tail.unshift(new UnaryExpression(null, 'delete',
                            new MemberExpression(null,
                                isStatic ? this.id : Member.create(this.id, 'prototype'),
                                tempSymbol,
                                true
                            )
                        ));

                        if ('method' === kind) {
                            this.body.addMember(new ClassPrototypeProperty(member.location, originalName, new MemberExpression(null, this.id, privateSymbol, true), isPrivate, isStatic));
                        } else {
                            this.body.addMember(new ClassMethod(member.location, new BlockStatement(null, [
                                // Return C[sym].call(this, ...args)
                                new ReturnStatement(null, new CallExpression(null,
                                    Member.create(new MemberExpression(null, this.id, privateSymbol, true), 'call'),
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
                        member.location = null;
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
