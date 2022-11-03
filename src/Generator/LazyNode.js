const NodeInterface = require('../AST/NodeInterface');

class LazyNode {
    /**
     * Creates a new node to be evaluated on compile.
     *
     * @param {() => NodeInterface} callback
     *
     * @returns {NodeInterface}
     */
    static create(callback) {
        return new class extends implementationOf(NodeInterface) {
            get location() {
                return null;
            }

            compile(compiler) {
                const node = callback();
                node.compile(compiler);
            }
        }();
    }
}

module.exports = LazyNode;
