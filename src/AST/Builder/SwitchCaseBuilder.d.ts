import AbstractBuilder = require('./AbstractBuilder');
import { AST } from '@jymfony/compiler';
import Builder = require('.');

declare class SwitchCaseBuilder<T extends AbstractBuilder<any>> extends Builder<T> {
    private _test: AST.ExpressionInterface;
    constructor(parent: T);

    test(): Builder<typeof this>;
}

export = SwitchCaseBuilder;
