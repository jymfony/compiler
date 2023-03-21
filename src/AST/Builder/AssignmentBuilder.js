const AST = require('..');
const AbstractBuilder = require('./AbstractBuilder');
const Builder = require('.');

class AssignmentBuilder extends AbstractBuilder {
    constructor(parent) {
        super(parent);

        this._left = null;
        this._right = null;
        this._operator = '=';
    }

    operator(operator) {
        this._operator = operator;
        return this;
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

    end() {
        this._parent._add(new AST.AssignmentExpression(null, this._operator, this._left, this._right));
        return super.end();
    }
}

module.exports = AssignmentBuilder;
