import AbstractBuilder = require('./AbstractBuilder');
import { AST } from '@jymfony/compiler';
import Builder = require('.');
import SwitchCaseBuilder = require('./SwitchCaseBuilder');

declare class SwitchBuilder<T extends Builder<any>> extends AbstractBuilder<T> {
    private _discriminant: AST.ExpressionInterface;
    private _cases: AST.SwitchCase[];
    constructor(parent: T);

    discriminant(): Builder<typeof this>;
    case(): SwitchCaseBuilder<typeof this>;
}

export = SwitchBuilder;
