const AbstractBuilder = require('./AbstractBuilder');
const AST = require('..');
const Builder = require('.');
const SwitchCaseBuilder = require('./SwitchCaseBuilder');

class SwitchBuilder extends AbstractBuilder {
    constructor(parent) {
        super(parent);

        this._discriminant = null;
        this._cases = [];
    }

    discriminant() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(1 === children.length);
            this._discriminant = children[0];
            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    case() {
        return new SwitchCaseBuilder(this);
    }

    end() {
        this._parent._add(new AST.SwitchStatement(null, this._discriminant, this._cases));
        return super.end();
    }
}

module.exports = SwitchBuilder;
