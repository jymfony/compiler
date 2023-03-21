import { AST } from '@jymfony/compiler';

declare class AbstractBuilder<T extends AbstractBuilder<any>> {
    protected _children: AST.NodeInterface[];

    constructor(parent?: T);

    end(): T;
}

export = AbstractBuilder;
