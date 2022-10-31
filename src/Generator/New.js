const Identifier = require('../AST/Identifier');
const NewExpression = require('../AST/NewExpression');

class New {
    /**
     * Creates a new expression.
     *
     * @param {ExpressionInterface | string} expr
     * @param {ExpressionInterface} args
     *
     * @return {NewExpression}
     */
    static create(expr, ...args) {
        if ('string' === typeof expr) {
            expr = new Identifier(null, expr);
        }

        return new NewExpression(null, expr, args);
    }
}

module.exports = New;
