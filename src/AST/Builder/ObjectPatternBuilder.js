const AbstractBuilder = require('./AbstractBuilder');
const AST = require('..');
const Builder = require('.');
const ObjectPropertyBuilder = require('./ObjectPropertyBuilder');

/**
 * @extends AbstractBuilder<PatternBuilder>
 */
class ObjectPatternBuilder extends AbstractBuilder {
    constructor(parent) {
        super(parent);
        this._children = [];
    }

    property() {
        const builder = new ObjectPropertyBuilder(this);
        builder.end = () => {
            this._add(new AST.AssignmentProperty(null, builder._key, builder._value));
            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    _add(node) {
        this._children.push(node);
    }

    spread() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(children.length === 1);
            this._add(new AST.AssignmentProperty(null, new AST.SpreadElement(null, children[0]), null));

            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    end() {
        this._parent._pattern = new AST.ObjectPattern(null, this._children);
        return super.end();
    }
}

module.exports = ObjectPatternBuilder;
