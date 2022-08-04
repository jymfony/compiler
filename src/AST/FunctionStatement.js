const StatementInterface = require('./StatementInterface');
const Function = require('./Function');

class FunctionStatement extends mix(Function, StatementInterface) {
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

        compiler._emit(' ');
        compiler.compileNode(this._id);
        Function.compileParams(compiler, this._params);
        compiler._emit(' ');
        compiler.compileNode(this._body);
        compiler._emit('\n');
    }
}

module.exports = FunctionStatement;
