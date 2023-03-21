import { AST } from '@jymfony/compiler';
import AbstractBuilder = require("./AbstractBuilder");
import Builder = require(".");

declare class BinaryExpressionBuilder<T extends Builder<any>> extends AbstractBuilder<T> {
    private _left: AST.NodeInterface;
    private _right: AST.NodeInterface;
    private _operator: string;

    constructor(parent: T);

    left(): Builder<typeof this>;

    right(): Builder<typeof this>;

    operator(op: string): this;

    end(): T;

    _add(statement: AST.NodeInterface): never;
}

export = BinaryExpressionBuilder;
