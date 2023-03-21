import { AST } from '@jymfony/compiler';
import AbstractBuilder = require('./AbstractBuilder');
import Builder = require('.');

declare class AssignmentBuilder<T extends Builder<any>> extends AbstractBuilder<T> {
    private _left: AST.NodeInterface;
    private _right: AST.NodeInterface;
    private _operator: string;
    constructor(parent: T);

    operator(operator: string): this;
    left(): Builder<typeof this>;
    right(): Builder<typeof this>;

    end(): T;
}

export = AssignmentBuilder;
