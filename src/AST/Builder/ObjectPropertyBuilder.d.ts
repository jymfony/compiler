import { AST } from '@jymfony/compiler';
import AbstractBuilder = require('./AbstractBuilder');
import Builder = require('./index');

declare class ObjectPropertyBuilder<T extends AbstractBuilder<any>> extends AbstractBuilder<T> {
    private _key: AST.ExpressionInterface;
    private _value: AST.ExpressionInterface;

    constructor(parent: T);

    key(): Builder<typeof this>;

    value(): Builder<typeof this>;
}

export = ObjectPropertyBuilder;
