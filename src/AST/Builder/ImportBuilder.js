const AbstractBuilder = require('./AbstractBuilder');
const AST = require('..');

/**
 * @template {Builder} T
 * @extends AbstractBuilder<T>
 */
class ImportBuilder extends AbstractBuilder {
    constructor(parent, source) {
        super(parent);

        this._source = source;
        this._specifiers = [];
        this._optional = false;
        this._nocompile = false;
    }

    optional(optional = true) {
        this._optional = true;
        return this;
    }

    nocompile(nocompile = true) {
        this._nocompile = nocompile;
        return this;
    }

    default(ident) {
        this._specifiers.push(new AST.ImportDefaultSpecifier(null, new AST.Identifier(null, ident)));
        return this;
    }

    namespace(ident) {
        this._specifiers.push(new AST.ImportNamespaceSpecifier(null, new AST.Identifier(null, ident)));
        return this;
    }

    specifier(local, exported = local) {
        this._specifiers.push(new AST.ImportSpecifier(null, new AST.Identifier(null, local), new AST.Identifier(null, exported)));
        return this;
    }

    end() {
        this._parent._add(new AST.ImportDeclaration(null, this._specifiers, new AST.StringLiteral(null, this._source), {
            optional: this._optional,
            nocompile: this._nocompile,
        }));

        return super.end();
    }
}

module.exports = ImportBuilder;
