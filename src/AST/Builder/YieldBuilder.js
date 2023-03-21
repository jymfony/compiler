const AST = require('..');
const Builder = require('.');

class YieldBuilder extends Builder {
    constructor(parent) {
        super(parent, true);

        this._delegate = false;
    }

    delegate(delegate = true) {
        this._delegate = delegate;
        return this;
    }

    end() {
        __assert(1 >= this._children.length);
        this._parent._add(new AST.YieldExpression(null, this._children[0] || null, this._delegate));

        return super.end();
    }
}

module.exports = YieldBuilder;
