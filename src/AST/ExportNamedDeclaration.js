const AssignmentExpression = require('./AssignmentExpression');
const Class = require('./Class');
const ExpressionStatement = require('./ExpressionStatement');
const ExportSpecifier = require('./ExportSpecifier');
const Function = require('./Function');
const Identifier = require('./Identifier');
const ImportDeclaration = require('./ImportDeclaration');
const ImportSpecifier = require('./ImportSpecifier');
const { Member } = require('../Generator');
const ModuleDeclarationInterface = require('./ModuleDeclarationInterface');
const StatementInterface = require('./StatementInterface');
const VariableDeclaration = require('./VariableDeclaration');

class ExportNamedDeclaration extends implementationOf(ModuleDeclarationInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {VariableDeclaration} declarations
     * @param {ExportSpecifier[]} specifiers
     * @param {Literal} source
     */
    __construct(location, declarations, specifiers, source) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {VariableDeclaration}
         *
         * @private
         */
        this._declarations = declarations;

        /**
         * @type {ExportSpecifier[]}
         *
         * @private
         */
        this._specifiers = specifiers;

        /**
         * @type {Literal}
         *
         * @private
         */
        this._source = source;

        /**
         * @type {string}
         */
        this.docblock = null;

        /**
         * @type {null|[string, ExpressionInterface][]}
         */
        this.decorators = null;
    }

    /**
     * @inheritdoc
     */
    get shouldBeClosed() {
        return false;
    }

    prepare(compiler) {
        if (null !== this._declarations) {
            this._specifiers = [];
            compiler.compileNode(this._declarations);
            if (!(this._declarations instanceof StatementInterface) || this._declarations.shouldBeClosed) {
                compiler._emit(';');
                compiler.newLine();
            }

            if (this._declarations instanceof VariableDeclaration) {
                for (const declarator of this._declarations.declarators) {
                    this._specifiers.push(...declarator.id.names.map(i => new ExportSpecifier(null, i, i)));
                }
            } else if (this._declarations instanceof Function || this._declarations instanceof Class) {
                this._specifiers.push(new ExportSpecifier(null, this._declarations.id, this._declarations.id));
            }
        }

        if (this._source) {
            const specifiers = this._specifiers
                .map(s => {
                    let im;
                    if ('default' === s.exported.name) {
                        const tmp = new Identifier(null, compiler.generateVariableName());
                        im = new ImportSpecifier(null, tmp, s.local);
                        s._local = tmp;
                    } else {
                        im = new ImportSpecifier(null, s.exported, s.local);
                    }

                    return im;
                });

            compiler.compileNode(new ImportDeclaration(null, specifiers, this._source));
        }
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        for (const specifier of this._specifiers) {
            compiler.compileNode(
                new ExpressionStatement(null, new AssignmentExpression(
                    null,
                    '=',
                    Member.create('exports', specifier.exported),
                    specifier.local
                ))
            );
        }
    }

    /**
     * Compile a declarator export.
     *
     * @param {Compiler} compiler
     * @param {VariableDeclarator} declarator
     *
     * @private
     */
    static _exportDeclarator(compiler, declarator) {
        for (const exportedName of declarator.id.names) {
            compiler.compileNode(
                new ExpressionStatement(null, new AssignmentExpression(
                    null,
                    '=',
                    Member.create('exports', exportedName),
                    exportedName
                ))
            );
        }
    }
}

module.exports = ExportNamedDeclaration;
