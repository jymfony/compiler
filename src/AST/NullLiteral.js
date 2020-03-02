const Literal = require('./Literal');

class NullLiteral extends Literal {
    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('null');
    }
}

module.exports = NullLiteral;
