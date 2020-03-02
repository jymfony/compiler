const NodeInterface = require('./NodeInterface');

class ClassMemberInterface extends NodeInterface.definition {
    /**
     * Compiles the decorators.
     * Code to be appended should be returned as an array of statements.
     *
     * @param {Compiler} compiler
     * @param {Class} target
     *
     * @returns {StatementInterface[]}
     */
    compileDecorators(compiler, target) { }
}

module.exports = getInterface(ClassMemberInterface);
