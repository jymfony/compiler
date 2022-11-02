const Identifier = require('../AST/Identifier');
const VariableDeclaration = require('../AST/VariableDeclaration');
const VariableDeclarator = require('../AST/VariableDeclarator');

class Variable {
    /**
     * Creates a new IIFE expression.
     *
     * @param {'let', 'const'} kind
     * @param {string | PatternInterface} id
     * @param {ExpressionInterface | null} [init]
     *
     * @returns {VariableDeclaration}
     */
    static create(kind, id, init = null) {
        if ('string' === typeof id) {
            id = new Identifier(null, id);
        }

        if ('string' === typeof init) {
            init = new Identifier(null, init);
        }

        return new VariableDeclaration(null, kind, [
            new VariableDeclarator(null, id, init),
        ]);
    }
}

module.exports = Variable;
