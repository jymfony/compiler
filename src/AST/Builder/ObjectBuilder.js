const AbstractBuilder = require('./AbstractBuilder');
const AST = require('..');
const Builder = require('.');
const ObjectPropertyBuilder = require('./ObjectPropertyBuilder');
const ObjectMethodBuilder = require('./ObjectMethodBuilder');

/**
 * @template {Builder} T
 * @extends AbstractBuilder<T>
 */
class ObjectBuilder extends AbstractBuilder {
    constructor(parent) {
        super(parent);
        this._children = [];
    }

    getter() {
        return new ObjectMethodBuilder(this, 'get');
    }

    method() {
        return new ObjectMethodBuilder(this, 'method');
    }

    property() {
        const builder = new ObjectPropertyBuilder(this);
        builder.end = () => {
            this._add(new AST.ObjectProperty(null, builder._key, builder._value));
            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    setter() {
        return new ObjectMethodBuilder(this, 'set');
    }

    _add(node) {
        this._children.push(node);
    }

    end() {
        this._parent._add(new AST.ObjectExpression(null, this._children));
        return super.end();
    }
}

module.exports = ObjectBuilder;
