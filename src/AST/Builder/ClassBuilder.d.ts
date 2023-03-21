import AbstractBuilder = require('./AbstractBuilder');
import { AST } from '@jymfony/compiler';
import Builder = require('.');
import ClassMethodBuilder = require('./ClassMethodBuilder');
import ClassPropertyBuilder = require('./ClassPropertyBuilder');

declare class ClassBuilder<T extends Builder<any>> extends AbstractBuilder<T> {
    private _declaration: boolean;
    private _id: null | AST.Identifier;
    private _superClass: null | AST.ExpressionInterface;
    private _members: AST.ClassMemberInterface[];

    constructor(parent: T, declaration: boolean);

    construct(): ClassMethodBuilder<typeof this>;
    getter(): ClassMethodBuilder<typeof this>;
    property(): ClassPropertyBuilder<typeof this>;
    method(): ClassMethodBuilder<typeof this>;
    setter(): ClassMethodBuilder<typeof this>;
    id(name: string): this;
    superClass(): Builder<typeof this>;

    end(): T;
}

export = ClassBuilder;
