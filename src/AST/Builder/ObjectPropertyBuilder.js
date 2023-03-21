const AbstractBuilder = require('./AbstractBuilder');
const Builder = require('.');

/**
 * @template {AbstractBuilder} T
 * @extends AbstractBuilder<T>
 */
class ObjectPropertyBuilder extends AbstractBuilder {
    constructor(parent) {
        super(parent);

        this._key = null;
        this._value = null;
    }

    key() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(children.length === 1);
            this._key = children[0];

            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    value() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(children.length === 1);
            this._value = children[0];

            return Builder.prototype.end.call(builder);
        };

        return builder;
    }
}

module.exports = ObjectPropertyBuilder;
