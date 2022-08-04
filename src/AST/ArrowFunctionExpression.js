const Function = require('./Function');

class ArrowFunctionExpression extends Function {
    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (this._async) {
            compiler._emit('async ');
        }

        // If (this._static) {
        //     Compiler._emit('static ');
        // }

        if (this._generator) {
            compiler._emit('* ');
        }

        Function.compileParams(compiler, this._params);

        compiler._emit(' => ');
        compiler.compileNode(this._body);
    }
}

module.exports = ArrowFunctionExpression;
