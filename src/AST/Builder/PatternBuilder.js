const AbstractBuilder = require('./AbstractBuilder');
const ObjectPatternBuilder = require('./ObjectPatternBuilder');

/**
 * @template {Builder} T
 * @extends AbstractBuilder<T>
 */
class PatternBuilder extends AbstractBuilder {
    constructor(parent) {
        super(parent);

        this._pattern = null;
    }

    object() {
        return new ObjectPatternBuilder(this);
    }

    end() {
        this._parent._add(this._pattern);
        return super.end();
    }
}

module.exports = PatternBuilder;
