const AST = require('..');
const Builder = require('.');

/**
 * @template {Builder} T
 * @extends Builder<T>
 */
class BlockBuilder extends Builder {
    end() {
        this._parent._add(new AST.BlockStatement(null, this._children));
        return super.end();
    }
}

module.exports = BlockBuilder;
