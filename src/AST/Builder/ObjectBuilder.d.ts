import {AST} from '@jymfony/compiler';
import AbstractBuilder = require('./AbstractBuilder');
import Builder = require('.');
import ObjectPropertyBuilder = require('./ObjectPropertyBuilder');
import ObjectMethodBuilder = require("./ObjectMethodBuilder");

declare class ObjectBuilder<T extends Builder<any>> extends AbstractBuilder<T> {
    protected _children: AST.NodeInterface[];

    constructor(parent: T);

    getter(): ObjectMethodBuilder<typeof this>;
    property(): ObjectPropertyBuilder<typeof this>;
    method(): ObjectMethodBuilder<typeof this>;
    setter(): ObjectMethodBuilder<typeof this>;

    protected _add(node: AST.NodeInterface): void;
}

export = ObjectBuilder;
