import { AST } from '@jymfony/compiler';
import AbstractBuilder = require('./AbstractBuilder');
import Builder = require('.');

declare class ArgumentBuilder<T extends Builder<any>> extends AbstractBuilder<T> {
    private _pattern: AST.PatternInterface;

    constructor(parent: T);

    name(name: string): this;

    end(): T;
}

export = ArgumentBuilder;
