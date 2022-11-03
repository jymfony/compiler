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

            get lazyNode() {
                return true;
            }

            compile(compiler) {
                const node = callback();
                if (null === node) {
                    return;
                }

                node.compile(compiler);
            }
        }();
    }
}

module.exports = LazyNode;
