const ArrowFunctionExpression = require('../AST/ArrowFunctionExpression');
const CallExpression = require('../AST/CallExpression');
const ParenthesizedExpression = require('../AST/ParenthesizedExpression');

class Iife {
    /**
     * Creates a new IIFE expression.
     *
     * @param {ExpressionInterface} functionBody
     *
     * @returns {CallExpression}
     */
    static create(functionBody) {
        return new CallExpression(null,
            new ParenthesizedExpression(null,
                new ArrowFunctionExpression(null, functionBody)
            ),
            []
        );
    }
}

module.exports = Iife;
