import { AST } from '@jymfony/compiler';
import Builder = require('.');

declare class VariableBuilder<T extends Builder<any>> extends Builder<T> {
    constructor(parent: T, kind: 'const' | 'let' | 'var');

    declarator(name: string | AST.NodeInterface): Builder<typeof this>;

    end(): T;
}

export = VariableBuilder;
