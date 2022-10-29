const { Iife, Undefined, Variable } = require('../Generator');
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
const FunctionExpression = require('./FunctionExpression');
const Identifier = require('./Identifier');
const IfStatement = require('./IfStatement');
const MemberExpression = require('./MemberExpression');
const NodeInterface = require('./NodeInterface');
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
     * @param {ValueHolder<Class|ClassMemberInterface|Argument>} targetRef
     * @param {Identifier} privateSymbol
     * @param {ExpressionInterface} originalName
     * @param {'constructor' | 'method' | 'get' | 'set' | 'parameter'} targetKind
     *
     * @returns {StatementInterface[]}
     */
    compile(compiler, class_, target, targetRef, privateSymbol, originalName, targetKind) {
        const Class = require('./Class');

        const tail = [];
        if (target instanceof ClassProperty) {
            const variableName = compiler.generateVariableName();
            const variable = new Identifier(null, variableName);

            const initializer = new FunctionExpression(null, new BlockStatement(null, [
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

            const privateMember = new ClassProperty(null, new StringLiteral(null, privateSymbol.name), initializer, true, false);
            class_.body.addMember(privateMember);

            target._value = new CallExpression(
                null,
                new MemberExpression(null, new MemberExpression(null, class_.id, privateSymbol, true), new Identifier(null, 'call')),
                [ new Identifier(null, 'this'), target.value ? target.value : Undefined.create() ]
            );
        } else if (target instanceof ClassAccessor) {
            target.prepare(compiler, class_);
            const callDecorator = new CallExpression(null, this._expression, [
                new ObjectExpression(null, [
                    new ObjectProperty(null, new Identifier(null, 'get'), new Identifier(null, 'oldGet')),
                    new ObjectProperty(null, new Identifier(null, 'set'), new Identifier(null, 'oldSet')),
                ]),
                new ObjectExpression(null, [
                    new ObjectProperty(null, new Identifier(null, 'kind'), new StringLiteral(null, '\'accessor\'')),
                    new ObjectProperty(null, new Identifier(null, 'name'), new StringLiteral(null, target.key instanceof Identifier ? JSON.stringify(target.key.name) : target.key)),
                    new ObjectProperty(null, new Identifier(null, 'static'), new StringLiteral(null, target.static ? 'true' : 'false')),
                    new ObjectProperty(null, new Identifier(null, 'private'), new StringLiteral(null, target.private ? 'true' : 'false')),
                ]),
            ]);

            tail.push(
                Iife.create(new BlockStatement(null, [
                    // Code: let { get: oldGet, set: oldSet } = Object.getOwnPropertyDescriptor(C.prototype, "x");
                    Variable.create('const', new ObjectPattern(null, [
                        new ObjectProperty(null, new Identifier(null, 'get'), new Identifier(null, 'oldGet')),
                        new ObjectProperty(null, new Identifier(null, 'set'), new Identifier(null, 'oldSet')),
                    ]), new CallExpression(null, new MemberExpression(null, new Identifier(null, 'Object'), new Identifier(null, 'getOwnPropertyDescriptor')), [
                        (target.static ? class_.id : new MemberExpression(null, class_.id, new Identifier(null, 'prototype'))), target.key instanceof Identifier ? new StringLiteral(null, JSON.stringify(target.key.name)) : target.key,
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
                    new CallExpression(null, new MemberExpression(null, new Identifier(null, 'Object'), new Identifier(null, 'defineProperty')), [
                        (target.static ? class_.id : new MemberExpression(null, class_.id, new Identifier(null, 'prototype'))),
                        target.key instanceof Identifier ? new StringLiteral(null, JSON.stringify(target.key.name)) : target.key,
                        new ObjectExpression(null, [
                            new ObjectProperty(null, new Identifier(null, 'get'), new Identifier(null, 'newGet')),
                            new ObjectProperty(null, new Identifier(null, 'set'), new Identifier(null, 'newSet')),
                        ]),
                    ]),
                    // Code: if (init !== undefined) { initializers.push(init); }
                    new IfStatement(null,
                        new BinaryExpression(null, '!==', new Identifier(null, 'init'), Undefined.create()),
                        new CallExpression(null, new MemberExpression(null, target.initializerIdentifier, new Identifier(null, 'push')), [
                            new Identifier(null, 'init'),
                        ]),
                    ),
                ]))
            );
        } else if (target instanceof ClassMethod) {
            if ('constructor' === targetKind) {
                throw new Error('Cannot apply a decorator onto a class constructor');
            }

            const kind = 'method' === targetKind ? targetKind : targetKind + 'ter';
            const currentTarget = targetRef.value;
            const targetFetcher = ('get' === targetKind || 'set' === targetKind ?
                new Identifier(null, targetKind) :
                (currentTarget.static ?
                    new MemberExpression(null, class_.id, currentTarget.key, currentTarget.key !== originalName) :
                    new MemberExpression(null, new MemberExpression(null, class_.id, new Identifier(null, 'prototype')), currentTarget.key, currentTarget.key !== originalName))
            );

            const variableName = compiler.generateVariableName();
            const variable = new Identifier(null, variableName);

            const initializer = Iife.create(new BlockStatement(null, [
                // Let xy = logged(() => { ... }, { ... })
                ...('get' === targetKind || 'set' === targetKind ? [
                    Variable.create(
                        'let',
                        new ObjectPattern(null, [
                            new AssignmentProperty(null, new Identifier(null, targetKind), null),
                        ]),
                        new CallExpression(null, new MemberExpression(null, new Identifier(null, 'Object'), new Identifier(null, 'getOwnPropertyDescriptor')), [
                            currentTarget.static ? class_.id : new MemberExpression(null, class_.id, new Identifier(null, 'prototype')),
                            currentTarget.key instanceof Identifier ? new StringLiteral(null, JSON.stringify(currentTarget.key.name)) : currentTarget.key,
                        ])
                    ),
                ] : []),
                Variable.create('let', variable, new CallExpression(null, this._expression, [
                    targetFetcher,
                    new ObjectExpression(null, [
                        new ObjectProperty(null, new Identifier(null, 'kind'), new StringLiteral(null, JSON.stringify(kind))),
                        new ObjectProperty(null, new Identifier(null, 'name'), originalName instanceof Identifier ? new StringLiteral(null, JSON.stringify(originalName.name)) : null),
                        new ObjectProperty(null, new Identifier(null, 'access'), new ObjectExpression(null, [
                            new ObjectMethod(null, new BlockStatement(null, [
                                new ReturnStatement(null, targetFetcher),
                            ]), new Identifier(null, 'get'), 'method'),
                        ])),
                        new ObjectProperty(null, new Identifier(null, 'static'), new BooleanLiteral(null, target.static)),
                        new ObjectProperty(null, new Identifier(null, 'private'), new BooleanLiteral(null, target.private)),
                    ]),
                ])),

                // If (xy === undefined) xy = (initial) => initial;
                new IfStatement(
                    null,
                    new BinaryExpression(null, '===', variable, Undefined.create()),
                    new ExpressionStatement(null, new AssignmentExpression(null, '=', variable, targetFetcher)),
                ),

                // Return xy;
                new ReturnStatement(null, variable),
            ]));

            targetRef.value = new ClassProperty(null, new StringLiteral(null, privateSymbol.name), initializer, true, false);
        } else if (target instanceof Class) {
            const identifier = target.id;
            const callDecorator = new CallExpression(null, this._expression, [
                identifier,
                new ObjectExpression(null, [
                    new ObjectProperty(null, new Identifier(null, 'kind'), new StringLiteral(null, '\'class\'')),
                    new ObjectProperty(null, new Identifier(null, 'name'), new StringLiteral(null, JSON.stringify(identifier.name))),
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
        } else {
            debugger;
        }

        return tail;
    }
}

module.exports = AppliedDecorator;
