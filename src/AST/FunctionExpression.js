const ExpressionInterface = require('./ExpressionInterface');
const Function = require('./Function');

class FunctionExpression extends mix(Function, ExpressionInterface) {
    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (this._async) {
            compiler._emit('async ');
        }

        if (this._static) {
            compiler._emit('static ');
        }

        compiler._emit('function');

        if (this._generator) {
            compiler._emit(' *');
        }

        if (null !== this._id) {
            compiler._emit(' ');
            compiler.compileNode(this._id);
        }

        Function.compileParams(compiler, this._params);
        compiler._emit(' ');
        compiler.compileNode(this._body);
    }
}

module.exports = FunctionExpression;
