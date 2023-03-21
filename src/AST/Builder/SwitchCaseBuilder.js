const Builder = require('.');
const AST = require('..');

class SwitchCaseBuilder extends Builder {
    constructor(parent) {
        super(parent, false);

        this._test = null;
    }

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
        this._parent._cases.push(new AST.SwitchCase(null, this._test, this._children));
        return super.end();
    }
}

module.exports = SwitchCaseBuilder;
