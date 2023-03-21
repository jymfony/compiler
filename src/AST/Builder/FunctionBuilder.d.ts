import AbstractBuilder = require("./AbstractBuilder");
import { AST } from '@jymfony/compiler';
import ArgumentBuilder = require('./ArgumentBuilder');
import Builder = require('.');

declare class FunctionBuilder<T extends AbstractBuilder<any>> extends Builder<T> {
    protected _statement: boolean;
    protected _name: AST.NodeInterface;
    protected _args: AST.NodeInterface[];
    protected _generator: boolean;
    protected _async: boolean;

    constructor(parent: T, statement: boolean);

    name(): Builder<typeof this>;

    argument(): ArgumentBuilder<typeof this>;

    generator(generator?: boolean): this;

    async(async?: boolean): this;

    end(): T;
}

export = FunctionBuilder;
