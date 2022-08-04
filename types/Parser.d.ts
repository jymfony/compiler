import ExpressionParserTrait = require("./ExpressionParserTrait");
import Lexer = require("./Lexer");
import { Token } from "./Token";

declare module "@jymfony/compiler" {
    type State = {};
    type ParserPosition = [Position, number];

    export class Parser extends implementationOf(ExpressionParserTrait) {
        private _lexer: Lexer;
        private _input: string;
        private _lastToken: Token;
        private _lastNonBlankToken: Token;
        private _line: number;
        private _column: number;
        private _level: number;
        private _pendingDocblock: string;
        private _decorators: Record<string, (location: AST.SourceLocation, ...args: any[]) => AST.AppliedDecorator>;
        private _esModule: boolean;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Gets/sets the current parser state.
         */
        public state: State;

        /**
         * Parses a js script.
         */
        parse(code: string): AST.Program;

        /**
         * Parse a token.
         */
        private _doParse(): AST.NodeInterface;

        /**
         * Advances the internal position counters.
         */
        private _advance(value?: string): void;

        /**
         * Gets the current position.
         */
        private _getCurrentPosition(): ParserPosition;

        /**
         * Makes a location.
         */
        private _makeLocation([startPosition, inputStart]: ParserPosition): AST.SourceLocation;

        private static _includesLineTerminator(value: string): boolean;

        /**
         * Assert there's a statement termination (newline or semicolon).
         */
        private _expectStatementTermination(): void;

        private _syntaxError(message?: string): never;
        private _expect(type): void;

        /**
         * Skip spaces and advances the internal position.
         */
        private _skipSpaces(processDecorators?: boolean): void;

        /**
         * Advance to next token.
         */
        private _next(skipSpaces?: boolean, processDecorators?: boolean): void;

        /**
         * Skips eventual semicolon.
         */
        private _skipSemicolon(): void;

        private _isPlainFor(): boolean;
        private _parseDecorator(): AST.AppliedDecorator;

        /**
         * Initiate a keyword parsing.
         */
        private _parseKeyword(): AST.StatementInterface;

        /**
         * Parse a pattern node.
         */
        private _parsePattern(): AST.PatternInterface;

        /**
         * Returns an initializer if any.
         */
        private _maybeInitializer(): null | AST.ExpressionInterface;

        /**
         * Parse and returns an identifier, if any.
         */
        private _maybeIdentifier(): null | AST.Identifier;

        /**
         * Parse an identifier.
         */
        private _parseIdentifier(): AST.Identifier;

        /**
         * Parses a class declaration.
         */
        private _parseClassDeclaration(): AST.ClassDeclaration;

        /**
         * Parses a class.
         */
        private _parseClass(): [AST.SourceLocation, AST.ClassBody, null | AST.Identifier, null | AST.ExpressionInterface];

        private _parseObjectMemberSignature(acceptsPrivateMembers?: boolean): { Generator: boolean, Static: boolean, Get: boolean, Set: boolean, Async: boolean, Private: boolean, property: boolean, MethodName: AST.ExpressionInterface };

        /**
         * Parses a class body.
         */
        private _parseClassBody(): AST.ClassBody;

        /**
         * Parses a class method.
         */
        private _parseClassMethod(start: ParserPosition, id: null | AST.ExpressionInterface, kind: string, opts: { Private: boolean, Static: boolean, async: boolean, generator: boolean }): AST.ClassMethod;

        /**
         * Parses a block statement.
         */
        private _parseBlockStatement(): AST.BlockStatement;

        private _parseStatement(skipStatementTermination?: boolean): AST.StatementInterface;
        private _doParseStatement(skipStatementTermination: boolean): AST.StatementInterface;
        private _parseFormalParametersList(): AST.Argument[];
        private _parseThrowStatement(): AST.ThrowStatement;
        private _parseIfStatement(): AST.IfStatement;
        private _parseReturnStatement(): AST.ReturnStatement;
    }
}
