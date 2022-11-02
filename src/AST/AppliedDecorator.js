const { Iife, Member, Undefined, Variable } = require('../Generator');
const Argument = require('./Argument');
const ArrowFunctionExpression = require('./ArrowFunctionExpression');
const AssignmentExpression = require('./AssignmentExpression');
const AssignmentProperty = require('./AssignmentProperty');
const BinaryExpression = require('./BinaryExpression');
const BlockStatement = require('./BlockStatement');
const BooleanLiteral = require('./BooleanLiteral');
const CallExpression = require('./CallExpression');
const ClassAccessor = require('./ClassAccessor');
const ClassMethod = require('./ClassMethod');
const ClassProperty = require('./ClassProperty');
const ExpressionStatement = require('./ExpressionStatement');
const Identifier = require('./Identifier');
const IfStatement = require('./IfStatement');
const MemberExpression = require('./MemberExpression');
const NodeInterface = require('./NodeInterface');
const NumberLiteral = require('./NumberLiteral');
const ObjectExpression = require('./ObjectExpression');
const ObjectMethod = require('./ObjectMethod');
const ObjectPattern = require('./ObjectPattern');
const ObjectProperty = require('./ObjectProperty');
const ReturnStatement = require('./ReturnStatement');
const StringLiteral = require('./StringLiteral');

class AppliedDecorator extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ExpressionInterface} expression
     */
    __construct(location, expression) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._expression = expression;
    }

    /**
     * Gets the decorator expression.
     *
     * @returns {ExpressionInterface}
     */
    get expression() {
        return this._expression;
    }

    /**
     * Compiles a decorator.
     *
     * @param {Compiler} compiler
     * @param {Class} class_
     * @param {Class|ClassMemberInterface|Argument} target
     * @param {number} [parameterIndex]
     *
     * @returns {StatementInterface[]}
     */
    compile(compiler, class_, target, parameterIndex = undefined) {
        const Class = require('./Class');

        const tail = [];
        if (target instanceof ClassProperty) {
            const variableName = compiler.generateVariableName();
            const variable = new Identifier(null, variableName);

            const initializer = Iife.create(new BlockStatement(null, [
                // Let xy = logged(undefined, { ... })
                Variable.create('let', variable, new CallExpression(null, this._expression, [
                    Undefined.create(),
                    new ObjectExpression(null, [
                        new ObjectProperty(null, new Identifier(null, 'kind'), new StringLiteral(null, '\'field\'')),
                        new ObjectProperty(null, new Identifier(null, 'name'), target.key instanceof Identifier ? new StringLiteral(null, JSON.stringify(target.key.name)) : null),
                        new ObjectProperty(null, new Identifier(null, 'access'), new ObjectExpression(null, [
                            new ObjectMethod(null, new BlockStatement(null, [
                                new ReturnStatement(null, new MemberExpression(null, new Identifier(null, 'this'), target.key, ! (target.key instanceof Identifier))),
                            ]), new Identifier(null, 'get'), 'method'),
                            new ObjectMethod(null, new BlockStatement(null, [
                                new ExpressionStatement(null, new AssignmentExpression(
                                    null,
                                    '=',
                                    new MemberExpression(null, new Identifier(null, 'this'), target.key, ! (target.key instanceof Identifier)),
                                    new Identifier(null, 'value')
                                )),
                            ]), new Identifier(null, 'set'), 'method', [ new Identifier(null, 'value') ]),
                        ])),
                        new ObjectProperty(null, new Identifier(null, 'static'), new BooleanLiteral(null, target.static)),
                        new ObjectProperty(null, new Identifier(null, 'private'), new BooleanLiteral(null, target.private)),
                    ]),
                ])),

                // If (xy === undefined) xy = (initial) => initial;
                new IfStatement(
                    null,
                    new BinaryExpression(null, '===', variable, Undefined.create()),
                    new ExpressionStatement(null, new AssignmentExpression(
                        null,
                        '=',
                        variable,
                        new ArrowFunctionExpression(null, new Identifier(null, 'initialValue'), null, [ new Identifier(null, 'initialValue') ]),
                    ))
                ),

                // Return xy;
                new ReturnStatement(null, variable),
            ]));

            target._value = new CallExpression(
                null,
                Member.create(initializer.callee, 'call'),
                [ new Identifier(null, 'this'), target.value ? target.value : Undefined.create() ]
            );
        } else if (target instanceof ClassAccessor) {
            if (target.private) {
                throw new Error('Cannot set decorator onto a private auto-accessor');
            }

            target.prepare(compiler, class_);
            const callDecorator = new CallExpression(null, this._expression, [
                new ObjectExpression(null, [
                    new ObjectProperty(null, new Identifier(null, 'get'), new Identifier(null, 'oldGet')),
                    new ObjectProperty(null, new Identifier(null, 'set'), new Identifier(null, 'oldSet')),
                ]),
                new ObjectExpression(null, [
                    new ObjectProperty(null, new Identifier(null, 'kind'), new StringLiteral(null, '\'accessor\'')),
                    new ObjectProperty(null, new Identifier(null, 'name'), new StringLiteral(null, target.key instanceof Identifier ? JSON.stringify(target.key.name) : target.key)),
                    new ObjectProperty(null, new Identifier(null, 'static'), new BooleanLiteral(null, target.static)),
                    new ObjectProperty(null, new Identifier(null, 'private'), new BooleanLiteral(null, target.private)),
                    new ObjectProperty(null, new Identifier(null, 'metadataKey'), new MemberExpression(null, Member.create(new CallExpression(
                        null,
                        Member.create('Object', 'getOwnPropertyDescriptor'),
                        [
                            target.static ? class_._id : Member.create(class_._id, 'prototype'),
                            target.key instanceof Identifier ? new StringLiteral(null, JSON.stringify(target.key.name)) : target.key,
                        ]
                    ), 'get'), Member.create('Symbol', 'metadata'), true)),
                    new ObjectProperty(null, new Identifier(null, 'class'), new ObjectExpression(null, [
                        ...(class_._id instanceof Identifier ? [ new ObjectProperty(null, new Identifier(null, 'name'), new StringLiteral(null, JSON.stringify(class_._id.name))) ] : []),
                        new ObjectProperty(null, new Identifier(null, 'metadataKey'), new MemberExpression(null, class_._id, Member.create('Symbol', 'metadata'), true)),
                    ])),
                ]),
            ]);

            class_._initialization.push(
                new BlockStatement(null, [
                    // Code: let { get: oldGet, set: oldSet } = Object.getOwnPropertyDescriptor(C.prototype, "x");
                    Variable.create('const', new ObjectPattern(null, [
                        new ObjectProperty(null, new Identifier(null, 'get'), new Identifier(null, 'oldGet')),
                        new ObjectProperty(null, new Identifier(null, 'set'), new Identifier(null, 'oldSet')),
                    ]), new CallExpression(null, Member.create('Object', 'getOwnPropertyDescriptor'), [
                        (target.static ? class_.id : Member.create(class_.id, 'prototype')), target.key instanceof Identifier ? new StringLiteral(null, JSON.stringify(target.key.name)) : target.key,
                    ])),
                    // Code: let { get: newGet = oldGet, set: newSet = oldSet, init } = logged({ get: oldGet, set: oldSet }, { ... }) ?? {};
                    Variable.create('let', new ObjectPattern(null, [
                        new ObjectProperty(null, new Identifier(null, 'get'), new AssignmentExpression(null, '=', new Identifier(null, 'newGet'), new Identifier(null, 'oldGet'))),
                        new ObjectProperty(null, new Identifier(null, 'set'), new AssignmentExpression(null, '=', new Identifier(null, 'newSet'), new Identifier(null, 'oldSet'))),
                        new ObjectProperty(null, new Identifier(null, 'init'), null),
                    ]), Iife.create(new BlockStatement(null, [
                        Variable.create('const', 's', callDecorator),
                        new IfStatement(null,
                            new BinaryExpression(null, '===', new Identifier(null, 's'), Undefined.create()),
                            new ReturnStatement(null, new ObjectExpression(null, [])),
                        ),
                        new ReturnStatement(null, new Identifier(null, 's')),
                    ]))),
                    // Code: Object.defineProperty(C.prototype, "x", { get: newGet, set: newSet });
                    new CallExpression(null, Member.create('Object', 'defineProperty'), [
                        (target.static ? class_.id : Member.create(class_.id, 'prototype')),
                        target.key instanceof Identifier ? new StringLiteral(null, JSON.stringify(target.key.name)) : target.key,
                        new ObjectExpression(null, [
                            new ObjectProperty(null, new Identifier(null, 'get'), new Identifier(null, 'newGet')),
                            new ObjectProperty(null, new Identifier(null, 'set'), new Identifier(null, 'newSet')),
                        ]),
                    ]),
                    // Code: if (init !== undefined) { initializers.push(init); }
                    new IfStatement(null,
                        new BinaryExpression(null, '!==', new Identifier(null, 'init'), Undefined.create()),
                        new ExpressionStatement(null, new CallExpression(null, Member.create(target.initializerIdentifier, 'push'), [
                            new Identifier(null, 'init'),
                        ])),
                    ),
                ])
            );
        } else if (target instanceof ClassMethod) {
            if ('constructor' === target.kind) {
                throw new Error('Cannot apply a decorator onto a class constructor');
            }

            if (target.private) {
                throw new Error('Cannot set decorator onto a private method');
            }

            const variable = compiler.generateVariableName();
            const targetFetcher = 'get' === target.kind || 'set' === target.kind ?
                new Identifier(null, target.kind) :
                new MemberExpression(null, target.static ? class_.id : Member.create(class_.id, 'prototype'), target.key, ! (target.key instanceof Identifier));

            const kind = 'method' === target.kind ? target.kind : target.kind + 'ter';
            const initializer = new BlockStatement(null, [
                // Let xy = logged(() => { ... }, { ... })
                ...('get' === target.kind || 'set' === target.kind ? [
                    Variable.create('const', 'descriptor', new CallExpression(null, Member.create('Object', 'getOwnPropertyDescriptor'), [
                        target.static ? class_.id : Member.create(class_.id, 'prototype'),
                        target.key instanceof Identifier ? new StringLiteral(null, JSON.stringify(target.key.name)) : target.key,
                    ])),
                    Variable.create('let', new ObjectPattern(null, [
                        new AssignmentProperty(null, new Identifier(null, target.kind), null),
                    ]), 'descriptor'),
                ] : []),
                Variable.create('let', variable, new CallExpression(null, this._expression, [
                    targetFetcher,
                    new ObjectExpression(null, [
                        new ObjectProperty(null, new Identifier(null, 'kind'), new StringLiteral(null, JSON.stringify(kind))),
                        new ObjectProperty(null, new Identifier(null, 'name'), target.key instanceof Identifier ? new StringLiteral(null, JSON.stringify(target.key.name)) : Undefined.create()),
                        new ObjectProperty(null, new Identifier(null, 'access'), new ObjectExpression(null, [
                            new ObjectMethod(null, new BlockStatement(null, [
                                new ReturnStatement(null, targetFetcher),
                            ]), new Identifier(null, 'get'), 'method'),
                        ])),
                        new ObjectProperty(null, new Identifier(null, 'static'), new BooleanLiteral(null, target.static)),
                        new ObjectProperty(null, new Identifier(null, 'private'), new BooleanLiteral(null, target.private)),
                        new ObjectProperty(null, new Identifier(null, 'metadataKey'), new MemberExpression(null,
                            'get' === target.kind || 'set' === target.kind ? new Identifier(null, target.kind) : new MemberExpression(null,
                                target.static ? class_.id : new MemberExpression(null, class_.id, new Identifier(null, 'prototype')),
                                target.id,
                                !(target.id instanceof Identifier)
                            ),
                            Member.create('Symbol', 'metadata'),
                            true
                        )),
                        new ObjectProperty(null, new Identifier(null, 'class'), new ObjectExpression(null, [
                            ...(class_.id instanceof Identifier ? [ new ObjectProperty(null, new Identifier(null, 'name'), new StringLiteral(null, JSON.stringify(class_.id.name))) ] : []),
                            new ObjectProperty(null, new Identifier(null, 'metadataKey'), new MemberExpression(null, class_.id, Member.create('Symbol', 'metadata'), true)),
                        ])),
                    ]),
                ])),

                // If (xy === undefined) xy = (initial) => initial;
                new IfStatement(
                    null,
                    new BinaryExpression(null, '===', new Identifier(null, variable), Undefined.create()),
                    new ExpressionStatement(null, new AssignmentExpression(null, '=', new Identifier(null, variable), targetFetcher)),
                ),

                // Orig = xy;
                ...('get' === target.kind || 'set' === target.kind ? [
                    new AssignmentExpression(null, '=', new MemberExpression(null, new Identifier(null, 'descriptor'), new Identifier(null, target.kind)), new Identifier(null, variable)),
                    new CallExpression(null, Member.create('Object', 'defineProperty'), [
                        target.static ? class_.id : Member.create(class_.id, 'prototype'),
                        target.key instanceof Identifier ? new StringLiteral(null, JSON.stringify(target.key.name)) : target.key,
                        new Identifier(null, 'descriptor'),
                    ]),
                ] : [
                    new AssignmentExpression(null, '=', new MemberExpression(null, target.static ? class_.id : Member.create(class_.id, 'prototype'), target.key, ! (target.key instanceof Identifier)), new Identifier(null, variable)),
                ]),
            ]);

            class_._initialization.push(initializer);
        } else if (target instanceof Class) {
            const identifier = target.id;
            const callDecorator = new CallExpression(null, this._expression, [
                identifier,
                new ObjectExpression(null, [
                    new ObjectProperty(null, new Identifier(null, 'kind'), new StringLiteral(null, '\'class\'')),
                    new ObjectProperty(null, new Identifier(null, 'name'), new StringLiteral(null, JSON.stringify(identifier.name))),
                    new ObjectProperty(null, new Identifier(null, 'metadataKey'), new MemberExpression(null,
                        identifier,
                        Member.create('Symbol', 'metadata'),
                        true
                    )),
                ]),
            ]);

            const variableName = compiler.generateVariableName();
            const variable = new Identifier(null, variableName);

            tail.push(new AssignmentExpression(
                null,
                '=',
                identifier,
                Iife.create(new BlockStatement(null, [
                    Variable.create('const', variable, callDecorator),
                    new IfStatement(null,
                        new BinaryExpression(null, '===', variable, Undefined.create()),
                        new ReturnStatement(null, identifier),
                    ),
                    new ReturnStatement(null, variable),
                ]))
            ));
        } else if (target instanceof Argument) {
            class_._initialization.push(new CallExpression(null, this._expression, [
                Undefined.create(),
                new ObjectExpression(null, [
                    new ObjectProperty(null, new Identifier(null, 'kind'), new StringLiteral(null, '"parameter"')),
                    new ObjectProperty(null, new Identifier(null, 'name'), target.pattern instanceof Identifier ? new StringLiteral(null, JSON.stringify(target.pattern.name)) : Undefined.create()),
                    new ObjectProperty(null, new Identifier(null, 'parameterIndex'), new NumberLiteral(null, parameterIndex)),
                    new ObjectProperty(null, new Identifier(null, 'metadataKey'), target.function.private ? new CallExpression(null,
                        Member.create(
                            new MemberExpression(null, class_._id, Member.create('Symbol', 'jymfony_private_accessors'), true),
                            (target.function.static ? 'staticMethods' : 'methods'),
                            target.function.id,
                            'metadataKey',
                        )
                    ) : new MemberExpression(null, new MemberExpression(null,
                        target.static ? class_.id : Member.create(class_.id, 'prototype'),
                        target.function.key,
                        !(target.function.key instanceof Identifier)
                    ), Member.create('Symbol', 'metadata'), true)),
                    new ObjectProperty(null, new Identifier(null, 'class'), new ObjectExpression(null, [
                        ...(class_.id instanceof Identifier ? [ new ObjectProperty(null, new Identifier(null, 'name'), new StringLiteral(null, JSON.stringify(class_.id.name))) ] : []),
                        new ObjectProperty(null, new Identifier(null, 'metadataKey'), new MemberExpression(null, class_.id, Member.create('Symbol', 'metadata'), true)),
                    ])),
                ]),
            ]));
        } else {
            throw new Error('Unexpected');
        }

        return tail;
    }
}

module.exports = AppliedDecorator;
