class NodeInterface {
    /**
     * Compiles a node.
     *
     * @param {Compiler} compiler
     */
    compile(compiler) { }

    /**
     * Prepares a node (do transformations, compile temporary variables, etc.)
     *
     * @param {Compiler} compiler
     */
    prepare(compiler) { }
}

module.exports = getInterface(NodeInterface);
