const AST = require('..');
const Builder = require('.');

/**
 * @template {Builder} T
 * @extends AbstractBuilder<T>
 */
class ArrayBuilder extends Builder {
    constructor(parent) {
        super(parent, true);
    }

    empty() {
        this._children.push(null);
        return this;
    }

    end() {
        this._parent._add(new AST.ArrayExpression(null, this._children));
        return super.end();
    }
}

module.exports = ArrayBuilder;
