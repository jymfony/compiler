const CallExpression = require('./CallExpression');
const ClassExpression = require('./ClassExpression');
const Function = require('./Function');

class NewExpression extends CallExpression {
    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('new ');
        if (this._callee instanceof ClassExpression) {
            compiler._emit('(');
        }

        compiler.compileNode(this._callee);

        if (this._callee instanceof ClassExpression) {
            compiler._emit(')');
        }

        Function.compileParams(compiler, this._args);
    }
}

module.exports = NewExpression;
