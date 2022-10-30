const Identifier = require('../AST/Identifier');
const MemberExpression = require('../AST/MemberExpression');

class Member {
    /**
     * Creates a new IIFE expression.
     *
     * @param {ExpressionInterface | string} object
     * @param {ExpressionInterface | string} property
     * @param {ExpressionInterface | string} properties
     *
     * @returns {CallExpression}
     */
    static create(object, property, ...properties) {
        if ('string' === typeof object) {
            object = new Identifier(null, object);
        }

        if ('string' === typeof property) {
            property = new Identifier(null, property);
        }

        let expr = new MemberExpression(null, object, property);
        for (let p of properties) {
            if ('string' === typeof p) {
                p = new Identifier(null, p);
            }

            expr = new MemberExpression(null, expr, p);
        }

        return expr;
    }
}

module.exports = Member;
