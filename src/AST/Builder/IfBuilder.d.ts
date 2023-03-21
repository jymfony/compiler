import { AST } from '@jymfony/compiler';
import AbstractBuilder = require('./AbstractBuilder');
import Builder = require('.');

declare class IfBuilder<T extends Builder<any>> extends AbstractBuilder<T> {
    private _test: AST.NodeInterface;
    private _consequent: AST.NodeInterface;
    private _alternate: AST.NodeInterface | null;

    constructor(parent: T);

    test(): Builder<typeof this>;

    consequent(): Builder<typeof this>;

    alternate(): Builder<typeof this>;

    end(): T;
}

export = IfBuilder;
