const AST = require('..');
const ObjectPropertyBuilder = require('./ObjectPropertyBuilder');

class ClassPropertyBuilder extends ObjectPropertyBuilder {
    constructor(parent) {
        super(parent);

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
        const property = new AST.ClassProperty(null, this._key, this._value, this._static, this._private);
        property.decorators = [];

        this._parent._members.push(property);
        return super.end();
    }
}

module.exports = ClassPropertyBuilder;
