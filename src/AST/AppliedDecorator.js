const ArrowFunctionExpression = require('./ArrowFunctionExpression');
const AssignmentExpression = require('./AssignmentExpression');
const BinaryExpression = require('./BinaryExpression');
const BlockStatement = require('./BlockStatement');
const BooleanLiteral = require('./BooleanLiteral');
const CallExpression = require('./CallExpression');
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
const ObjectProperty = require('./ObjectProperty');
const ParenthesizedExpression = require('./ParenthesizedExpression');
const ReturnStatement = require('./ReturnStatement');
const StringLiteral = require('./StringLiteral');
const VariableDeclaration = require('./VariableDeclaration');
const VariableDeclarator = require('./VariableDeclarator');

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
                new VariableDeclaration(null, 'let', [
                    new VariableDeclarator(null, variable, new CallExpression(null, this._expression, [
                        new Identifier(null, 'undefined'),
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
                ]),

                // If (xy === undefined) xy = (initial) => initial;
                new IfStatement(
                    null,
                    new BinaryExpression(null, '===', variable, new Identifier(null, 'undefined')),
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
                [ new Identifier(null, 'this'), target.value ? target.value : new Identifier(null, 'undefined') ]
            );
        } else if (target instanceof ClassMethod) {
            if ('constructor' === targetKind) {
                throw new Error('Cannot apply a decorator onto a class constructor');
            }

            const kind = 'method' === targetKind ? targetKind : targetKind + 'ter';
            const currentTarget = targetRef.value;
            const targetFetcher = currentTarget.static ?
                new MemberExpression(null, class_.id, currentTarget.key, true) :
                new MemberExpression(null, new MemberExpression(null, class_.id, new Identifier(null, 'prototype')), currentTarget.key, true);

            const variableName = compiler.generateVariableName();
            const variable = new Identifier(null, variableName);

            const initializer = new CallExpression(null, new ParenthesizedExpression(null, new ArrowFunctionExpression(null, new BlockStatement(null, [
                // Let xy = logged(() => { ... }, { ... })
                new VariableDeclaration(null, 'let', [
                    new VariableDeclarator(null, variable, new CallExpression(null, this._expression, [
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
                ]),

                // If (xy === undefined) xy = (initial) => initial;
                new IfStatement(
                    null,
                    new BinaryExpression(null, '===', variable, new Identifier(null, 'undefined')),
                    new ExpressionStatement(null, new AssignmentExpression(null, '=', variable, targetFetcher)),
                ),

                // Return xy;
                new ReturnStatement(null, variable),
            ]))), []);

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
                new CallExpression(null, new ParenthesizedExpression(null, new ArrowFunctionExpression(null, new BlockStatement(null, [
                    new VariableDeclaration(null, 'const', [ new VariableDeclarator(null, variable, callDecorator) ]),
                    new IfStatement(null,
                        new BinaryExpression(null, '===', variable, new Identifier(null, 'undefined')),
                        new ReturnStatement(null, identifier),
                    ),
                    new ReturnStatement(null, variable),
                ]))), [])
            ));
        } else {
            debugger;
        }

        return tail;
    }
}

module.exports = AppliedDecorator;
