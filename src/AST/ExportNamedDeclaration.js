const AssignmentExpression = require('./AssignmentExpression');
const Class = require('./Class');
const ExpressionStatement = require('./ExpressionStatement');
const Function = require('./Function');
const Identifier = require('./Identifier');
const MemberExpression = require('./MemberExpression');
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

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (null === this._declarations) {
            for (const specifier of this._specifiers) {
                compiler.compileNode(
                    new ExpressionStatement(null, new AssignmentExpression(
                        null,
                        '=',
                        new MemberExpression(null, new Identifier(null, 'exports'), specifier.exported),
                        specifier.local
                    ))
                );
            }

            return;
        }

        compiler.compileNode(this._declarations);
        if (! (this._declarations instanceof StatementInterface) || this._declarations.shouldBeClosed) {
            compiler._emit(';');
            compiler.newLine();
        }

        if (this._declarations instanceof VariableDeclaration) {
            for (const declarator of this._declarations.declarators) {
                ExportNamedDeclaration._exportDeclarator(compiler, declarator);
            }
        } else if (this._declarations instanceof Function || this._declarations instanceof Class) {
            if (this.decorators) {
                this._declarations.declarators = this.decorators;
            }

            compiler.compileNode(
                new ExpressionStatement(null, new AssignmentExpression(
                    null,
                    '=',
                    new MemberExpression(null, new Identifier(null, 'exports'), this._declarations.id),
                    this._declarations.id
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
                    new MemberExpression(null, new Identifier(null, 'exports'), exportedName),
                    exportedName
                ))
            );
        }
    }
}

module.exports = ExportNamedDeclaration;
