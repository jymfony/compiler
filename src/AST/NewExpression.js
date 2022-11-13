const CallExpression = require('./CallExpression');
const Function = require('./Function');
const Identifier = require('./Identifier');
const ParenthesizedExpression = require('./ParenthesizedExpression');

class NewExpression extends CallExpression {
    prepare(compiler) {
        if (! (this._callee instanceof Identifier) && ! (this._callee instanceof ParenthesizedExpression)) {
            this._callee = new ParenthesizedExpression(this._callee.location, this._callee);
        }

        super.prepare(compiler);
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('new ');
        compiler.compileNode(this._callee);
        Function.compileParams(compiler, this._args);
    }
}

module.exports = NewExpression;
