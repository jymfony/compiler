const Class = require('./Class');
const CallExpression = require('./CallExpression');
const ExpressionInterface = require('./ExpressionInterface');
const Identifier = require('./Identifier');
const StatementInterface = require('./StatementInterface');
const { Variable } = require('../Generator');

class ClassExpression extends mix(Class, ExpressionInterface) {
    compile(compiler) {
        if (! this.docblock && ! this.decorators) {
            return super.compile(compiler);
        }

        const id = __jymfony.clone(this.id);
        id.location = null;

        compiler._emit('(() => {');
        compiler.indentationLevel++;
        compiler.newLine();

        const tail = this.compileDecorators(compiler);

        const initialization = compiler.generateVariableName() + '_initialize_class_fields';
        compiler.compileNode(Variable.create('const', initialization, new CallExpression(null, new Identifier(null, 'Symbol'))));
        compiler._emit(';');
        compiler.newLine();

        compiler._emit('let ' + id.name + ' = ');
        super.compile(compiler, initialization);
        compiler._emit(';');
        compiler.newLine();

        for (const statement of tail) {
            compiler.compileNode(statement);

            if (! (statement instanceof StatementInterface) || statement.shouldBeClosed) {
                compiler._emit(';');
                compiler.newLine();
            }
        }

        compiler.newLine();
        compiler._emit('return ' + id.name + ';');

        compiler.indentationLevel--;
        compiler.newLine();
        compiler._emit('})()');
    }
}

module.exports = ClassExpression;
