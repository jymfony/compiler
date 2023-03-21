import ClassBuilder = require('./ClassBuilder');
import ObjectPropertyBuilder = require('./ObjectPropertyBuilder');

declare class ClassPropertyBuilder<T extends ClassBuilder<any>> extends ObjectPropertyBuilder<T> {
    private _private: boolean;
    private _static: boolean;

    constructor(parent: T);

    private(private_?: boolean): this;
    static(static_?: boolean): this;
    end(): T;
}

export = ClassPropertyBuilder;
