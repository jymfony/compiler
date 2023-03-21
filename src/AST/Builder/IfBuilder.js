const AbstractBuilder = require('./AbstractBuilder');
const AST = require('..');
const Builder = require('.');

/**
 * @template {Builder} T
 * @extends AbstractBuilder<T>
 */
class IfBuilder extends AbstractBuilder {
    constructor(parent) {
        super(parent);

        this._test = null;
        this._consequent = null;
        this._alternate = null;
    }

    test() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(children.length === 1);
            this._test = children[0];

            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    consequent() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(children.length === 1);
            this._consequent = children[0];

            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    alternate() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(children.length <= 1);
            this._alternate = children[0] || null;

            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    end() {
        this._parent._add(new AST.IfStatement(null, this._test, this._consequent, this._alternate));
        return super.end();
    }
}

module.exports = IfBuilder;
