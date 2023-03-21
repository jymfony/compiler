import { AST } from '@jymfony/compiler';
import AbstractBuilder = require('./AbstractBuilder');
import Builder = require('.');
import ObjectPropertyBuilder = require('./ObjectPropertyBuilder');
import PatternBuilder = require('./PatternBuilder');

declare class ObjectPatternBuilder<T extends PatternBuilder<any>> extends AbstractBuilder<T> {
    protected _children: AST.NodeInterface[];

    constructor(parent: T);

    property(): ObjectPropertyBuilder<typeof this>;

    spread(): Builder<typeof this>;

    end(): T;
}

export = ObjectPatternBuilder;
