const { LazyNode, Member, Undefined, Variable } = require('../Generator');
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
const NumberLiteral = require('./NumberLiteral');
const ObjectExpression = require('./ObjectExpression');
const ObjectProperty = require('./ObjectProperty');
const ReturnStatement = require('./ReturnStatement');
const SpreadElement = require('./SpreadElement');
const StatementInterface = require('./StatementInterface');
const StringLiteral = require('./StringLiteral');
const YieldExpression = require('./YieldExpression');
const { getNextTypeId } = require('../TypeId');

let ClassExpression;

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
        this._typeId = getNextTypeId();

        /**
         * @type {ExpressionInterface[]}
         *
         * @private
         */
        this._initialization = [];

        /**
         * @type {ClassProperty[]}
         *
         * @private
         */
        this._initializableFields = [];

        /**
         * @type {NodeInterface[]}
         *
         * @private
         */
        this._tail = [];
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
    compile(compiler, initialization, expression = false) {
        this.prepare(compiler, initialization);

        if (expression) {
            compiler._emit('let ' + this.name + ' = ');
        }

        compiler._emit('class ');
        compiler.compileNode(this._id);

        if (this._superClass) {
            compiler._emit(' extends ');
            compiler.compileNode(this._superClass);
        }

        compiler.indentationLevel++;
        compiler._emit(' {');
        compiler.compileNode(this._body.withExcluded(...(this._initializableFields.filter(p => !p.static && !p.private))));
        compiler.indentationLevel--;
        compiler.newLine();
        compiler._emit('}');
        if (expression) {
            compiler._emit(';');
        }
        compiler.newLine();

        for (const node of this._tail) {
            if (node instanceof StatementInterface) {
                compiler.compileNode(node);
            } else {
                compiler.compileNode(new ExpressionStatement(null, node));
            }
        }
    }

    prepare(compiler, initializationSymbol = undefined) {
        if (this._prepared) {
            return;
        }

        if (null === this.superClass) {
            this.superClass = new Identifier(null, '__jymfony.JObject');
            const constructor = this.getConstructor();
            if (null !== constructor && !constructor.static) {
                constructor.body.statements.unshift(new CallExpression(null, new Identifier(null, 'super')));
            }
        } else {
            if (undefined === ClassExpression) {
                ClassExpression = require('./ClassExpression');
            }

            if (this.superClass instanceof ClassExpression) {
                this.superClass.forceWrap = true;
            }

            this.superClass.prepare(compiler);
        }

        if (initializationSymbol === undefined) {
            initializationSymbol = compiler.generateVariableName() + '_initialize_class_fields';
            compiler.compileNode(Variable.create('const', initializationSymbol, new CallExpression(null, new Identifier(null, 'Symbol'))));
            compiler._emit(';');
            compiler.newLine();
        }

        this._tail.push(new CallExpression(null, new MemberExpression(null, this._id, new StringLiteral(null, initializationSymbol), true)));

        const ClassAccessor = require('./ClassAccessor');
        this._prepared = true;

        const initialization = this._initialization;
        this._initialization = [];

        this._initialization.push(
            new CallExpression(
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
            ),
            new CallExpression(
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
            )
        );

        compiler.constructor.pushReflectionData(this._typeId, {
            ast: this,
            filename: compiler.currentFilename,
            namespace: compiler.currentNamespace,
        });

        const members = this._body.members;
        const fields = [];
        const staticFields = [];
        const methods = [];
        const staticMethods = [];

        for (const member of members) {
            if (member.id instanceof YieldExpression) {
                const yieldedName = compiler.generateVariableName();
                compiler.compileNode(Variable.create('const', yieldedName, member.id));
                compiler._emit(';');
                compiler.newLine();

                member._id = new StringLiteral(null, yieldedName);
                continue;
            }

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
                                    new IfStatement(null,
                                        new BinaryExpression(null, '===', Undefined.create(), new Identifier(null, varName)),
                                        new ExpressionStatement(null, new CallExpression(null, Member.create('Object', 'defineProperty'), [
                                            Member.create(this._id, ...(member.static ? [] : [ 'prototype' ]), '#' + member.key.name), Member.create('Symbol', 'metadata'), new ObjectExpression(null, [
                                                new ObjectProperty(null, new Identifier(null, 'writable'), new StringLiteral(null, 'false')),
                                                new ObjectProperty(null, new Identifier(null, 'enumerable'), new StringLiteral(null, 'false')),
                                                new ObjectProperty(null, new Identifier(null, 'configurable'), new StringLiteral(null, 'true')),
                                                new ObjectProperty(null, new Identifier(null, 'value'), new CallExpression(null, new Identifier(null, 'Symbol'))),
                                            ]),
                                        ]))
                                    ),
                                    new ReturnStatement(null, new MemberExpression(null, Member.create(this._id, ...(member.static ? [] : [ 'prototype' ]), '#' + member.key.name), Member.create('Symbol', 'metadata'), true)),
                                ]),
                            )
                        ),
                    ]));

                    (member.static ? staticMethods : methods).push(prop);
                    for (const [ idx, param ] of __jymfony.getEntries(member.params)) {
                        for (/** @type {AppliedDecorator} */ const decorator of param.decorators) {
                            decorator.compile(compiler, this, param, idx);
                        }
                    }

                    continue;
                }

                let key;
                if ('constructor' === member.key.name) {
                    key = this._id;
                } else if ('get' === member.kind || 'set' === member.kind) {
                    key = Member.create(new CallExpression(
                        null,
                        Member.create('Object', 'getOwnPropertyDescriptor'),
                        [
                            member.static ? this._id : Member.create(this._id, 'prototype'),
                            member.key instanceof Identifier ? new StringLiteral(null, JSON.stringify(member.key.name)) : member.key,
                        ]
                    ), member.kind);
                } else {
                    key = new MemberExpression(
                        null,
                        member.static ? this._id : Member.create(this._id, 'prototype'),
                        member.key,
                        !(member.key instanceof Identifier),
                    );
                }

                if ('constructor' !== member.key.name) {
                    this._initialization.push(new CallExpression(
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
                        decorator.compile(compiler, this, param, idx);
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

                if (member instanceof ClassProperty) {
                    initReflection(member);
                    if (!member.static) {
                        this._initializableFields.push(member);
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

        this.body.addMember(LazyNode.create(() => {
            const fieldsInitializers = this._initializableFields.map(p => {
                __assert(!p.static);
                if (p.private) {
                    return null;
                }

                const value = p.value;
                p.clearValue();

                return new AssignmentExpression(
                    p.location,
                    '=',
                    new MemberExpression(null, new Identifier(null, 'this'), p.key, !(p.key instanceof Identifier)),
                    null !== value ? value : Undefined.create()
                );
            }).filter(i => !!i);

            if (0 === fieldsInitializers.length) {
                return null;
            }

            const parentCall = [
                Variable.create('const', 'superClass', new CallExpression(null, Member.create('Object', 'getPrototypeOf'), [ Member.create(this._id, 'prototype') ])),
                Variable.create('const', 'superCall', new MemberExpression(null, new Identifier(null, 'superClass'), Member.create('Symbol', '__jymfony_field_initialization'), true)),
                new IfStatement(null,
                    new BinaryExpression(null, '!==', Undefined.create(), new MemberExpression(null, new Identifier(null, 'superClass'), Member.create('Symbol', '__jymfony_field_initialization'), true)),
                    new ExpressionStatement(null, new CallExpression(null, Member.create('superCall', 'apply'), [ new Identifier(null, 'this') ])),
                ),
            ];

            this._initialization.push(new CallExpression(
                this.location,
                Member.create('Object', 'defineProperty'),
                [
                    Member.create(this._id, 'prototype'),
                    Member.create('Symbol', '__jymfony_field_initialization'),
                    new ObjectExpression(null, [
                        new ObjectProperty(null, new Identifier(null, 'writable'), new StringLiteral(null, 'false')),
                        new ObjectProperty(null, new Identifier(null, 'enumerable'), new StringLiteral(null, 'false')),
                        new ObjectProperty(null, new Identifier(null, 'configurable'), new StringLiteral(null, 'true')),
                        new ObjectProperty(null, new Identifier(null, 'value'), new MemberExpression(null, Member.create(this._id, 'prototype'), Member.create('Symbol', '__jymfony_field_initialization'), true)),
                    ]),
                ]
            ));

            return new ClassMethod(
                null,
                new BlockStatement(null, [ ...parentCall, ...fieldsInitializers ]),
                Member.create('Symbol', '__jymfony_field_initialization'),
                'method',
            );
        }));

        this.body.addMember(
            LazyNode.create(() => {
                const stmts = [ ...this._initialization, ...initialization ].map(s => {
                    if (s instanceof StatementInterface) {
                        return s;
                    }

                    return new ExpressionStatement(null, s);
                });

                return new ClassMethod(null, new BlockStatement(null, stmts), new StringLiteral(null, initializationSymbol), 'method', [], { Static: true });
            })
        );
    }

    /**
     * Compiles the decorators upon this class.
     *
     * @param {Compiler} compiler
     *
     * @returns {StatementInterface[]}
     */
    compileDecorators(compiler) {
        const tail = [];
        if (null !== this.decorators && 0 !== this.decorators.length) {
            for (const decorator of this.decorators) {
                tail.push(...decorator.compile(compiler, this, this));
            }
        }

        for (const member of [ ...this._body.members ]) {
            for (const decorator of member.decorators || []) {
                tail.push(...decorator.compile(compiler, this, member));
            }
        }

        return tail;
    }
}

module.exports = Class;
