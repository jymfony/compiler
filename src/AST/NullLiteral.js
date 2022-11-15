const Literal = require('./Literal');

class NullLiteral extends Literal {
    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('null');
    }

    /**
     * @inheritdoc
     */
    prepare() {
        // Do nothing.
    }
}

module.exports = NullLiteral;
