import { Token } from "../Token";

declare class RescanException extends Error {
    constructor(token: Token);
}

export = RescanException;
