const ArgumentBuilder = require('./ArgumentBuilder');
const AST = require('..');
const Builder = require('.');

/**
 * @template {Builder} T
 * @extends Builder<T>
 */
class FunctionBuilder extends Builder {
    constructor(parent, statement) {
        super(parent);

        this._statement = statement;
        this._name = null;
        this._args = [];
        this._generator = false;
        this._async = false;
    }

    /**
     * @returns {Builder<typeof this>}
     */
    name() {
        const builder = new Builder(this, true);
        builder.end = () => {
            const children = builder._children;
            __assert(children.length === 1);
            this._name = children[0];
            return Builder.prototype.end.call(builder);
        };

        return builder;
    }

    /**
     * @returns {ArgumentBuilder<typeof this>}
     */
    argument() {
        return new ArgumentBuilder(this);
    }

    generator(generator = true) {
        this._generator = generator;
        return this;
    }

    async(async = true) {
        this._async = async;
        return this;
    }

    end() {
        __assert(1 === this._children.length);
        if (this._statement) {
            __assert(null !== this._name);
            this._parent._add(new AST.FunctionStatement(null, this._children[0], this._name, this._args, {
                generator: this._generator,
                async: this._async
            }));
        } else {
            this._parent._add(new AST.FunctionExpression(null, this._children[0], this._name, this._args, {
                generator: this._generator,
                async: this._async
            }));
        }

        return super.end();
    }
}

module.exports = FunctionBuilder;
