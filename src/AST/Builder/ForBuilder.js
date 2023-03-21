const AbstractBuilder = require('./AbstractBuilder');
const AST = require('..');
const BlockBuilder = require('./BlockBuilder');
const Builder = require('.');

/**
 * @template {Builder} T
 * @extends AbstractBuilder<T>
 */
class ForBuilder extends AbstractBuilder {
    constructor(parent) {
        super(parent);

        this._init = null;
        this._test = null;
        this._update = null;
        this._body = new AST.EmptyStatement();
    }

    init() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(1 >= children.length);
            this._init = children[0] || null;

            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    test() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(1 >= children.length);
            this._test = children[0] || null;

            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    update() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(1 >= children.length);
            this._update = children[0] || null;

            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    /**
     * @returns {BlockBuilder<typeof this>}
     */
    block() {
        const builder = new BlockBuilder(this);
        builder.end = () => {
            this._body = new AST.BlockStatement(null, builder._children);
            return AbstractBuilder.prototype.end.call(builder);
        };

        return builder;
    }

    end() {
        this._parent._add(new AST.ForStatement(null, this._init, this._test, this._update, this._body));

        return super.end();
    }
}

module.exports = ForBuilder;
