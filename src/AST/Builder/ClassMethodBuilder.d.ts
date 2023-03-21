import AST = require('..');
import ObjectMethodBuilder = require('./ObjectMethodBuilder');
import AbstractBuilder = require("./AbstractBuilder");

declare class ClassMethodBuilder<T extends AbstractBuilder<any>> extends ObjectMethodBuilder<T> {
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
        __assert(1 === this._children.length);
        this._parent._members.push(new AST.ClassMethod(null, this._children[0], this._name, this._kind, this._args, {
            generator: this._generator,
            async: this._async,
            private: this._private,
            static: this._static,
        }));

        return super.end();
    }
}

export = ClassMethodBuilder;
