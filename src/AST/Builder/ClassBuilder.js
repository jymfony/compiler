const AbstractBuilder = require('./AbstractBuilder');
const AST = require('..');
const Builder = require('./index');
const ClassMethodBuilder = require('./ClassMethodBuilder');
const ClassPropertyBuilder = require('./ClassPropertyBuilder');

class ClassBuilder extends AbstractBuilder {
    constructor(parent, declaration) {
        super(parent);

        this._declaration = declaration;
        this._id = null;
        this._superClass = null;
        this._members = [];
    }

    construct() {
        return new ClassMethodBuilder(this, 'constructor');
    }
    getter() {
        return new ClassMethodBuilder(this, 'get');
    }
    property() {
        return new ClassPropertyBuilder(this);
    }
    method() {
        return new ClassMethodBuilder(this, 'method');
    }
    setter() {
        return new ClassMethodBuilder(this, 'setter');
    }

    id(name) {
        this._id = name ? new AST.Identifier(null, name) : null;
        return this;
    }

    superClass() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(1 === children.length);
            this._superClass = children[0];
            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    end() {
        const body = new AST.ClassBody(null, this._members);

        if (this._declaration) {
            __assert(null !== this._id);
            this._parent._add(new AST.ClassDeclaration(null, body, this._id, this._superClass));
        } else {
            this._parent._add(new AST.ClassExpression(null, body, this._id, this._superClass));
        }

        return super.end();
    }
}

module.exports = ClassBuilder;
