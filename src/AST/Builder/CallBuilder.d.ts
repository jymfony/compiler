import { AST } from '@jymfony/compiler';
import Builder = require('.');

declare class CallBuilder<T extends Builder<any>> extends Builder<T> {
    private _callee: AST.ExpressionInterface;
    private _optional: boolean;

    constructor(parent: T);

    callee(): Builder<typeof this>;

    optional(opt?: boolean): this;

    end(): T;
}

export = CallBuilder;
