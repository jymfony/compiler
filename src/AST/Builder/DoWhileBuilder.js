const AST = require('..');
const Builder = require('.');

/**
 * @template {Builder} T
 * @extends Builder<T>
 */
class DoWhileBuilder extends Builder {
    constructor(parent) {
        super(parent);

        /**
         * @type {NodeInterface}
         *
         * @private
         */
        this._test = null;
    }

    /**
     * @returns {Builder<typeof this>}
     */
    test() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(1 === children.length);
            this._test = children[0];
            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    end() {
        __assert(null !== this._test);
        __assert(2 > this._children.length);
        this._parent._add(new AST.DoWhileStatement(null, this._test, this._children[0] || new AST.EmptyStatement(null)));

        return super.end();
    }
}

module.exports = DoWhileBuilder;
