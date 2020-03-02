type State = {};
type ParserPosition = [ Position, number ];

declare class Parser extends implementationOf(ExpressionParserTrait) {
    private _lexer: Lexer;
    private _input: string;
    private _lastToken: Token;
    private _lastNonBlankToken: Token;
    private _line: number;
    private _column: number;
    private _level: number;
    private _pendingDocblock: string;
    private _pendingDecorators: AppliedDecorator[];
    private _descriptorStorage: Jymfony.Component.Autoloader.DescriptorStorage;
    private _decorators: Record<string, (location: SourceLocation, ...args: any[]) => AppliedDecorator>;
    private _esModule: boolean;

    /**
     * Constructor.
     */
    __construct(descriptorStorage: Jymfony.Component.Autoloader.DescriptorStorage): void;
    constructor(descriptorStorage: Jymfony.Component.Autoloader.DescriptorStorage);

    /**
     * Gets/sets the current parser state.
     */
    public state: State;

    /**
     * Parses a js script.
     */
    parse(code: string): Program;

    /**
     * Parse a token.
     */
    private _doParse(): NodeInterface;

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
    private _makeLocation([startPosition, inputStart]: ParserPosition): SourceLocation;

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
    private _parseDecorator(): AppliedDecorator;

    /**
     * Initiate a keyword parsing.
     */
    private _parseKeyword(): StatementInterface;

    /**
     * Parse a pattern node.
     */
    private _parsePattern(): PatternInterface;

    /**
     * Returns an initializer if any.
     */
    private _maybeInitializer(): null | ExpressionInterface;

    /**
     * Parse and returns an identifier, if any.
     */
    private _maybeIdentifier(): null | Identifier;

    /**
     * Parse an identifier.
     */
    private _parseIdentifier(): Identifier;

    /**
     * Parses a class declaration.
     */
    private _parseClassDeclaration(): ClassDeclaration;

    /**
     * Parses a class.
     */
    private _parseClass(): [SourceLocation, ClassBody, null | Identifier, null | ExpressionInterface];

    private _parseObjectMemberSignature(acceptsPrivateMembers?: boolean): { Generator: boolean, Static: boolean, Get: boolean, Set: boolean, Async: boolean, Private: boolean, property: boolean, MethodName: ExpressionInterface };

    /**
     * Parses a class body.
     */
    private _parseClassBody(): ClassBody;

    /**
     * Parses a class method.
     */
    private _parseClassMethod(start: ParserPosition, id: null | ExpressionInterface, kind: string, opts: { Private: boolean, Static: boolean, async: boolean, generator: boolean }): ClassMethod;

    /**
     * Parses a block statement.
     */
    private _parseBlockStatement(): BlockStatement;

    private _parseStatement(skipStatementTermination?: boolean): StatementInterface;
    private _doParseStatement(skipStatementTermination: boolean): StatementInterface;
    private _parseFormalParametersList(): Argument[];
    private _parseThrowStatement(): ThrowStatement;
    private _parseIfStatement(): IfStatement;
    private _parseReturnStatement(): ReturnStatement;
}
