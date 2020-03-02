import { Token } from "../Token";

declare class NotARegExpException extends Error {
    constructor(token: Token);
}

export = NotARegExpException;
