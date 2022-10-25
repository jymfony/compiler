const Class = require('./Class');
const ExpressionInterface = require('./ExpressionInterface');
const StatementInterface = require('./StatementInterface');

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

        const tail = this.compileDocblock(compiler, id);
        tail.push(...this.compileDecorators(compiler));

        compiler._emit('let ' + id.name + ' = ');
        super.compile(compiler);
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
