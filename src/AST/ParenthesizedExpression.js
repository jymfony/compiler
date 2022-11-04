const ExpressionInterface = require('./ExpressionInterface');
const {Iife, Variable} = require('../Generator');
const BlockStatement = require('./BlockStatement');
const ReturnStatement = require('./ReturnStatement');
const Identifier = require('./Identifier');
let Class;

class ParenthesizedExpression extends implementationOf(ExpressionInterface) {
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
     * Gets the expression inside the parenthesis.
     *
     * @return {ExpressionInterface}
     */
    get expression() {
        return this._expression;
    }

    prepare(compiler) {
        if (undefined === Class) {
            Class = require('./Class');
        }

        if (this._expression instanceof Class) {
            this._expression = Iife.create(new BlockStatement(null, [
                Variable.create('const', this._expression.name, this._expression),
                new ReturnStatement(null, new Identifier(null, this._expression.name)),
            ]));
        } else if ('function' === typeof this._expression.prepare) {
            this._expression.prepare(compiler);
        }
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('(');
        compiler.compileNode(this._expression);
        compiler._emit(')');
    }
}

module.exports = ParenthesizedExpression;
