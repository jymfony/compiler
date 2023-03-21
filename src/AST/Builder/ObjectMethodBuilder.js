const AST = require('..');
const Builder = require('.');
const FunctionBuilder = require('./FunctionBuilder');

/**
 * @template {AbstractBuilder} T
 * @extends AbstractBuilder<T>
 */
class ObjectMethodBuilder extends FunctionBuilder {
    constructor(parent, kind) {
        super(parent, false);

        this._kind = kind;
    }

    end() {
        __assert(1 === this._children.length);
        this._parent._add(new AST.ObjectMethod(null, this._children[0], this._name, this._kind, this._args, {
            generator: this._generator,
            async: this._async
        }));

        return Builder.prototype.end.call(this);
    }
}

module.exports = ObjectMethodBuilder;
