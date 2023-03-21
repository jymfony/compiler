import { AST } from '@jymfony/compiler';
import AbstractBuilder = require('./AbstractBuilder');
import BlockBuilder = require('./BlockBuilder');
import Builder = require('.');

declare class ForBuilder<T extends Builder<any>> extends AbstractBuilder<T> {
    private _init: AST.NodeInterface;
    private _test: AST.NodeInterface;
    private _update: AST.NodeInterface;
    private _body: AST.NodeInterface;

    constructor(parent: T);

    init(): Builder<typeof this>;

    test(): Builder<typeof this>;

    update(): Builder<typeof this>;

    block(): BlockBuilder<typeof this>;

    end(): T;

    protected _add(statement: AST.NodeInterface): void;
}

export = ForBuilder;
