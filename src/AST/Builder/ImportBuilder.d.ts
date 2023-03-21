import { AST } from '@jymfony/compiler';
import AbstractBuilder = require('./AbstractBuilder');
import Builder = require('.');

declare class ImportBuilder<T extends Builder<any>> extends AbstractBuilder<T> {
    private _source: string;
    private _specifiers: AST.ImportSpecifierInterface[];
    private _optional: boolean;
    private _nocompile: boolean;

    constructor(parent: T, source: string);

    optional(optional?: boolean): this;

    nocompile(nocompile?: boolean): this;

    default(ident: string): this;

    namespace(ident: string): this;

    specifier(local: string, exported?: string): this;

    end(): T;
}

export = ImportBuilder;
