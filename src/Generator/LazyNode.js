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
            __construct() {
                this._node = undefined;
            }

            get location() {
                return null;
            }

            get lazyNode() {
                return true;
            }

            get node() {
                if (undefined === this._node) {
                    this._node = callback();
                }

                return this._node;
            }

            prepare(compiler) {
                if (null === this.node) {
                    return;
                }

                this.node.prepare(compiler);
            }

            compile(compiler) {
                if (null === this.node) {
                    return;
                }

                this.node.compile(compiler);
            }
        }();
    }
}

module.exports = LazyNode;
