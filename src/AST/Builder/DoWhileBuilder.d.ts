import { AST } from "@jymfony/compiler";
import Builder = require('.');

declare class DoWhileBuilder<T extends Builder<any>> extends Builder<T> {
    private _test: AST.NodeInterface;

    constructor(parent: T);

    test(): Builder<typeof this>;

    end(): T;
}

export = DoWhileBuilder;
