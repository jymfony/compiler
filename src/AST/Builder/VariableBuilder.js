const AST = require('..');
const Builder = require('.');

/**
 * @template {Builder} T
 * @extends Builder<T>
 */
class VariableBuilder extends Builder {
    constructor(parent, kind) {
        super(parent, true);
        this._kind = kind;
    }

    declarator(name) {
        name = isString(name) ? new AST.Identifier(null, name) : name;
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(children.length <= 1);
            this._add(new AST.VariableDeclarator(null, name, children[0] || null));

            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    end() {
        this._parent._add(new AST.VariableDeclaration(null, this._kind, this._children));
        return super.end();
    }
}

module.exports = VariableBuilder;
