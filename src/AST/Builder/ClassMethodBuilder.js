const AST = require('..');
const ObjectMethodBuilder = require('./ObjectMethodBuilder');
const Builder = require('./index');

class ClassMethodBuilder extends ObjectMethodBuilder {
    constructor(parent, kind) {
        super(parent, kind);

        this._kind = kind;
        this._private = false;
        this._static = false;
    }

    private(private_ = true) {
        this._private = private_;
        return this;
    }

    static(static_ = true) {
        this._static = static_;
        return this;
    }

    end() {
        __assert(1 >= this._children.length);
        const body = this._children[0] || new AST.BlockStatement(null, []);
        const method = new AST.ClassMethod(null, body, this._name, this._kind, this._args, {
            generator: this._generator,
            async: this._async,
            private: this._private,
            static: this._static,
        });
        method.decorators = [];

        this._parent._members.push(method);

        return Builder.prototype.end.call(this);
    }
}

module.exports = ClassMethodBuilder;
