const AbstractBuilder = require('./AbstractBuilder');
const AST = require('..');
const Builder = require('.');

/**
 * @template {Builder} T
 * @extends AbstractBuilder<T>
 */
class BinaryExpressionBuilder extends AbstractBuilder {
    constructor(parent) {
        super(parent);

        this._left = null;
        this._right = null;
        this._operator = null;
    }

    /**
     * @returns {Builder<typeof this>}
     */
    left() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(1 === children.length);
            this._left = children[0];
            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    /**
     * @returns {Builder<typeof this>}
     */
    right() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(1 === children.length);
            this._right = children[0];
            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    operator(op) {
        this._operator = op;
        return this;
    }

    end() {
        __assert(null !== this._left);
        __assert(null !== this._right);

        this._parent._add(new AST.BinaryExpression(null, this._operator, this._left, this._right));

        return super.end();
    }
}

module.exports = BinaryExpressionBuilder;
