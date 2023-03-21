const AST = require('..');
const Builder = require('.');

/**
 * @template {Builder} T
 * @extends Builder<T>
 */
class UpdateBuilder extends Builder {
    constructor(parent) {
        super(parent, true);

        this._operator = null;
        this._prefix = false;
    }

    prefix(prefix = true) {
        this._prefix = prefix;
        return this;
    }

    postfix(postfix = true) {
        this._prefix = !postfix;
        return this;
    }

    operator(op) {
        this._operator = op;
        return this;
    }

    end() {
        __assert(1 === this._children.length);
        __assert(null !== this._operator);
        this._parent._add(new AST.UpdateExpression(null, this._operator, this._children[0], this._prefix));

        return super.end();
    }
}

module.exports = UpdateBuilder;
