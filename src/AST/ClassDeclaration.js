const Class = require('./Class');
const DeclarationInterface = require('./DeclarationInterface');

class ClassDeclaration extends mix(Class, DeclarationInterface) {
    compile(compiler) {
        const tail = this.compileDecorators(compiler);
        super.compile(compiler);

        const id = __jymfony.clone(this.id);
        id.location = null;
        this.compileDocblock(compiler, id);

        for (const statement of tail) {
            compiler.compileNode(statement);
            compiler._emit(';\n');
        }
    }
}

module.exports = ClassDeclaration;
