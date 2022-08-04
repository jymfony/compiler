const Class = require('./Class');
const DeclarationInterface = require('./DeclarationInterface');
const StatementInterface = require('./StatementInterface');

class ClassDeclaration extends mix(Class, DeclarationInterface) {
    compile(compiler) {
        const id = __jymfony.clone(this.id);
        id.location = null;
        const tail = this.compileDocblock(compiler, id);

        tail.push(...this.compileDecorators(compiler));
        super.compile(compiler);

        for (const statement of tail) {
            compiler.compileNode(statement);

            if (! (statement instanceof StatementInterface) || statement.shouldBeClosed) {
                compiler._emit(';');
                compiler.newLine();
            }
        }
    }
}

module.exports = ClassDeclaration;
