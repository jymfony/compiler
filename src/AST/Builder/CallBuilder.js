const AST = require('..');
const Builder = require('.');

/**
 * @template {Builder} T
 * @extends Builder<T>
 */
class CallBuilder extends Builder {
    constructor(parent) {
        super(parent, true);

        this._callee = null;
        this._optional = false;
    }

    /**
     * @returns {Builder<typeof this>}
     */
    callee() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(children.length === 1);
            this._callee = children[0];
            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    optional(opt = true) {
        this._optional = opt;
        return this;
    }

    end() {
        __assert(null !== this._callee);
        this._parent._add(new AST.CallExpression(null, this._callee, this._children, this._optional));

        return super.end();
    }
}

module.exports = CallBuilder;
