const AbstractBuilder = require('./AbstractBuilder');
const AST = require('..');

/**
 * @template {AbstractBuilder} T
 */
class Builder extends AbstractBuilder {
    /**
     * @param {T} parent
     * @param {boolean} [bareExpressions = false]
     */
    constructor(parent = null, bareExpressions = false) {
        super(parent);

        /**
         * @type {NodeInterface[]}
         *
         * @protected
         */
        this._children = [];

        /**
         * @type {boolean}
         *
         * @private
         */
        this._bareExpressions = bareExpressions;
    }

    /**
     * @returns {Builder<typeof this>}
     */
    array() {
        return new ArrayBuilder(this);
    }

    arrowFunction() {
        return new ArrowFunctionBuilder(this);
    }

    assign() {
        return new AssignmentBuilder(this);
    }

    /**
     *
     * @returns {BinaryExpressionBuilder<typeof this>}
     */
    binary() {
        return new BinaryExpressionBuilder(this);
    }

    /**
     * @returns {BlockBuilder<typeof this>}
     */
    block() {
        return new BlockBuilder(this);
    }

    break(label = null) {
        this._add(new AST.BreakStatement(null, null !== label ? new AST.Identifier(null, label) : label));
        return this;
    }

    /**
     * @returns {CallBuilder<typeof this>}
     */
    call() {
        return new CallBuilder(this);
    }

    class() {
        return new ClassBuilder(this, !this._bareExpressions);
    }

    conditional() {
        return new ConditionalBuilder(this);
    }

    debugger() {
        this._add(new AST.DebuggerStatement(null));
        return this;
    }

    /**
     * @returns {DoWhileBuilder<typeof this>}
     */
    do() {
        return new DoWhileBuilder(this);
    }

    empty() {
        this._add(new AST.EmptyStatement(null));
        return this;
    }

    exportDefault() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(1 === children.length);
            this._add(new AST.ExportDefaultDeclaration(null, children[0]));

            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    false() {
        this._add(new AST.BooleanLiteral(null, false));
        return this;
    }

    for() {
        return new ForBuilder(this);
    }

    /**
     * @returns {FunctionBuilder<typeof this>}
     */
    function() {
        return new FunctionBuilder(this, !this._bareExpressions);
    }

    ident(name) {
        this._add(new AST.Identifier(null, name));
        return this;
    }

    if() {
        return new IfBuilder(this);
    }

    import(source) {
        return new ImportBuilder(this, source);
    }

    member(...args) {
        let arg;
        let property = null;
        let computed = false;
        let optional = false;
        while ((arg = args.shift())) {
            if (isString(arg)) {
                if ('?' === arg[0]) {
                    optional = true;
                    arg = arg.substring(1, arg.length);
                }

                if ('[' === arg[0]) {
                    computed = true;
                    arg = arg.substring(1, arg.length - 1);
                }

                if (arg.match(/^[0-9]+$/)) {
                    arg = new AST.NumberLiteral(null, ~~arg);
                } else {
                    arg = new AST.Identifier(null, arg);
                }

                property = null === property ? arg : new AST.MemberExpression(null, property, arg, computed, optional);
                computed = optional = false;
                continue;
            }

            if (arg instanceof AST.NodeInterface) {
                property = null === property ? arg : new AST.MemberExpression(null, property, arg, true, false);
                computed = optional = false;
                continue;
            }

            throw new Error('Unimplemented');
        }

        __assert(null !== property);
        this._add(property);

        return this;
    }

    null() {
        this._add(new AST.NullLiteral(null));
        return this;
    }

    number(num) {
        this._add(new AST.NumberLiteral(null, num));
        return this;
    }

    object() {
        return new ObjectBuilder(this);
    }

    parens() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(1 >= children.length);
            this._add(new AST.ParenthesizedExpression(null, children[0]));

            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    pattern() {
        return new PatternBuilder(this);
    }

    return() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(1 >= children.length);
            this._add(new AST.ReturnStatement(null, children[0]));

            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    spread() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(1 === children.length);
            this._add(new AST.SpreadElement(null, children[0]));

            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    string(str) {
        this._add(new AST.StringLiteral(null, str));
        return this;
    }

    switch() {
        return new SwitchBuilder(this);
    }

    true() {
        this._add(new AST.BooleanLiteral(null, true));
        return this;
    }

    /**
     * @param {string} operator
     *
     * @returns {Builder<typeof this>}
     */
    unary(operator) {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(1 === children.length);
            this._add(new AST.UnaryExpression(null, operator, children[0]));

            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    /**
     * @returns {UpdateBuilder<typeof this>}
     */
    update() {
        return new UpdateBuilder(this);
    }

    /**
     * @param {'const' | 'let' | 'var'} kind
     *
     * @returns {VariableBuilder<typeof this>}
     */
    variable(kind) {
        return new VariableBuilder(this, kind);
    }

    yield() {
        return new YieldBuilder(this);
    }

    _add(statement) {
        if (! this._bareExpressions && ! (statement instanceof AST.StatementInterface)) {
            statement = new AST.ExpressionStatement(null, statement);
        }

        this._children.push(statement);
    }

    end() {
        if (null === this._parent) {
            return this._children;
        }

        return super.end();
    }
}

module.exports = Builder;

const ArrayBuilder = require('./ArrayBuilder');
const AssignmentBuilder = require('./AssignmentBuilder');
const BlockBuilder = require('./BlockBuilder');
const BinaryExpressionBuilder = require('./BinaryExpressionBuilder');
const CallBuilder = require('./CallBuilder');
const ClassBuilder = require('./ClassBuilder');
const DoWhileBuilder = require('./DoWhileBuilder');
const ForBuilder = require('./ForBuilder');
const FunctionBuilder = require('./FunctionBuilder');
const IfBuilder = require('./IfBuilder');
const ImportBuilder = require('./ImportBuilder');
const ObjectBuilder = require('./ObjectBuilder');
const PatternBuilder = require('./PatternBuilder');
const SwitchBuilder = require('./SwitchBuilder');
const UpdateBuilder = require('./UpdateBuilder');
const VariableBuilder = require('./VariableBuilder');
const YieldBuilder = require('./YieldBuilder');

/**
 * @template {Builder} T
 * @extends Builder<T>
 */
class ConditionalBuilder extends IfBuilder {
    end() {
        this._parent._add(new AST.ConditionalExpression(null, this._test, this._consequent, this._alternate));
        return Builder.prototype.end.call(this);
    }
}

/**
 * @template {Builder} T
 * @extends FunctionBuilder<T>
 */
class ArrowFunctionBuilder extends FunctionBuilder {
    constructor(parent) {
        super(parent, false);
    }

    name() {
        throw new Error('Arrow functions cannot have a name');
    }

    end() {
        __assert(1 === this._children.length);
        this._parent._add(new AST.ArrowFunctionExpression(null, this._children[0], this._name, this._args, {
            generator: this._generator,
            async: this._async,
        }));

        return Builder.prototype.end.call(this);
    }
}
