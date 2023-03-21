const AbstractBuilder = require('./AbstractBuilder');
const AST = require('..');
const Builder = require('.');

/**
 * @template {Builder} T
 * @extends AbstractBuilder<T>
 */
class ArgumentBuilder extends AbstractBuilder {
    constructor(parent) {
        super(parent);
        this._pattern = null;
    }

    name(name) {
        this._pattern = new AST.Identifier(null, name);
        return this;
    }

    end() {
        const arg = new AST.Argument(null, this._pattern);
        arg.decorators = [];

        this._parent._args.push(arg);
        return super.end();
    }
}

module.exports = ArgumentBuilder;
