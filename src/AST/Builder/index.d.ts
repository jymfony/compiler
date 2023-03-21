import { AST } from '@jymfony/compiler';
import AbstractBuilder = require('./AbstractBuilder');
import AssignmentBuilder = require('./AssignmentBuilder');
import ArrayBuilder = require('./ArrayBuilder');
import BinaryExpressionBuilder = require('./BinaryExpressionBuilder');
import BlockBuilder = require('./BlockBuilder');
import CallBuilder = require('./CallBuilder');
import DoWhileBuilder = require('./DoWhileBuilder');
import ForBuilder = require('./ForBuilder');
import FunctionBuilder = require('./FunctionBuilder');
import ImportBuilder = require('./ImportBuilder');
import IfBuilder = require('./IfBuilder');
import ObjectBuilder = require('./ObjectBuilder');
import PatternBuilder = require('./PatternBuilder');
import SwitchBuilder = require('./SwitchBuilder');
import UpdateBuilder = require('./UpdateBuilder');
import VariableBuilder = require('./VariableBuilder');
import YieldBuilder = require('./YieldBuilder');
import ClassBuilder = require("./ClassBuilder");

declare class Builder<T extends AbstractBuilder<any>> extends AbstractBuilder<T> {
    protected _parent: T;
    protected _bareExpressions: boolean;

    constructor(parent?: T, bareExpressions?: boolean);
    array(): ArrayBuilder<typeof this>;
    arrowFunction(): ArrowFunctionBuilder<typeof this>;
    assign(): AssignmentBuilder<typeof this>;
    binary(): BinaryExpressionBuilder<typeof this>;
    block(): BlockBuilder<typeof this>;
    break(label?: string): this;
    call(): CallBuilder<typeof this>;
    class(): ClassBuilder<typeof this>;
    conditional(): ConditionalBuilder<typeof this>;
    debugger(): this;
    do(): DoWhileBuilder<typeof this>;
    empty(): this;
    false(): this;
    ident(name: string): this;
    if(): IfBuilder<typeof this>;
    import(source: string): ImportBuilder<typeof this>;
    exportDefault(): Builder<typeof this>;
    for(): ForBuilder<typeof this>;
    function(): FunctionBuilder<typeof this>;
    member(...args: string[]): this;
    null(): this;
    number(num: number | bigint): this;
    object(): ObjectBuilder<typeof this>;
    parens(): Builder<typeof this>;
    pattern(): PatternBuilder<typeof this>;
    return(): Builder<typeof this>;
    spread(): Builder<typeof this>;
    string(str: string): this;
    switch(): SwitchBuilder<typeof this>;
    true(): this;
    unary(operator: string): Builder<typeof this>;
    update(): UpdateBuilder<typeof this>;
    variable(kind: 'const' | 'let' | 'var'): VariableBuilder<typeof this>;
    yield(): YieldBuilder<typeof this>;

    protected _add(statement: AST.NodeInterface): void;
}

declare class ConditionalBuilder<T extends Builder<any>> extends IfBuilder<T> {
    end(): T;
}

declare class ArrowFunctionBuilder<T extends Builder<any>> extends FunctionBuilder<T> {
    constructor(parent: T);

    name(): never;

    end(): T;
}


export = Builder;
