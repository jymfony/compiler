const CallExpression = require('./CallExpression');

class NewExpression extends CallExpression {
    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('new ');
        super.compile(compiler);
    }
}

module.exports = NewExpression;
