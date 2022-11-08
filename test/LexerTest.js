/* eslint-disable no-template-curly-in-string */
const Lexer = require('../src/Lexer');
const { expect } = require('chai');

describe('[Compiler] Lexer', function () {
    it ('can parse multiple backtick strings on the same line', () => {
        const lexer = new Lexer();

        lexer.input = '`${l}\\n` : `${sp}${l}\\n`';
        expect(lexer._tokens).to.be.deep.eq([
            { value: '`${l}\\n`', type: Lexer.T_STRING, position: 0, index: 0 },
            { value: ' ', type: Lexer.T_SPACE, position: 8, index: 1 },
            { value: ':', type: Lexer.T_COLON, position: 9, index: 2 },
            { value: ' ', type: Lexer.T_SPACE, position: 10, index: 3 },
            { value: '`${sp}${l}\\n`', type: Lexer.T_STRING, position: 11, index: 4 },
            { value: 'end-of-file', type: Lexer.T_EOF, position: 24, index: 5 },
        ]);
    });

    it ('can parse xor operator wo spaces correctly', () => {
        const lexer = new Lexer();

        lexer.input = 'x^y';
        expect(lexer._tokens).to.be.deep.eq([
            { value: 'x', type: Lexer.T_IDENTIFIER, position: 0, index: 0 },
            { value: '^', type: Lexer.T_OPERATOR, position: 1, index: 1 },
            { value: 'y', type: Lexer.T_IDENTIFIER, position: 2, index: 2 },
            { value: 'end-of-file', type: Lexer.T_EOF, position: 3, index: 3 },
        ]);
    });

    it ('can parse variable name with dollar sign', () => {
        const lexer = new Lexer();

        lexer.input = 'var this$1';
        expect(lexer._tokens).to.be.deep.eq([
            { value: 'var', type: Lexer.T_KEYWORD, position: 0, index: 0 },
            { value: ' ', type: Lexer.T_SPACE, position: 3, index: 1 },
            { value: 'this$1', type: Lexer.T_IDENTIFIER, position: 4, index: 2 },
            { value: 'end-of-file', type: Lexer.T_EOF, position: 10, index: 3 },
        ]);
    });

    it ('can parse comments containing backticks', () => {
        const lexer = new Lexer();

        lexer.input = `function x(v) {
  return v !== '*' ? \`\\\`\${v.replace(/\`/g, '\`\`')}\\\`\` : '*';
}

// this is a \`comment\`
// second line
`;
        expect(lexer._tokens).to.be.deep.eq([
            { value: 'function', type: Lexer.T_FUNCTION, position: 0, index: 0 },
            { value: ' ', type: Lexer.T_SPACE, position: 8, index: 1 },
            { value: 'x', type: Lexer.T_IDENTIFIER, position: 9, index: 2 },
            { value: '(', type: Lexer.T_OPEN_PARENTHESIS, position: 10, index: 3 },
            { value: 'v', type: Lexer.T_IDENTIFIER, position: 11, index: 4 },
            { value: ')', type: Lexer.T_CLOSED_PARENTHESIS, position: 12, index: 5 },
            { value: ' ', type: Lexer.T_SPACE, position: 13, index: 6 },
            { value: '{', type: Lexer.T_CURLY_BRACKET_OPEN, position: 14, index: 7 },
            { value: '\n  ', type: Lexer.T_SPACE, position: 15, index: 8 },
            { value: 'return', type: Lexer.T_RETURN, position: 18, index: 9 },
            { value: ' ', type: Lexer.T_SPACE, position: 24, index: 10 },
            { value: 'v', type: Lexer.T_IDENTIFIER, position: 25, index: 11 },
            { value: ' ', type: Lexer.T_SPACE, position: 26, index: 12 },
            { value: '!==', type: Lexer.T_COMPARISON_OP, position: 27, index: 13 },
            { value: ' ', type: Lexer.T_SPACE, position: 30, index: 14 },
            { value: '\'*\'', type: Lexer.T_STRING, position: 31, index: 15 },
            { value: ' ', type: Lexer.T_SPACE, position: 34, index: 16 },
            { value: '?', type: Lexer.T_QUESTION_MARK, position: 35, index: 17 },
            { value: ' ', type: Lexer.T_SPACE, position: 36, index: 18 },
            { value: '`\\`${v.replace(/`/g, \'``\')}\\``', type: Lexer.T_STRING, position: 37, index: 19 },
            { value: ' ', type: Lexer.T_SPACE, position: 67, index: 20 },
            { value: ':', type: Lexer.T_COLON, position: 68, index: 21 },
            { value: ' ', type: Lexer.T_SPACE, position: 69, index: 22 },
            { value: '\'*\'', type: Lexer.T_STRING, position: 70, index: 23 },
            { value: ';', type: Lexer.T_SEMICOLON, position: 73, index: 24 },
            { value: '\n', type: Lexer.T_SPACE, position: 74, index: 25 },
            { value: '}', type: Lexer.T_CURLY_BRACKET_CLOSE, position: 75, index: 26 },
            { value: '\n\n', type: Lexer.T_SPACE, position: 76, index: 27 },
            { value: '// this is a \`comment\`\n', type: Lexer.T_COMMENT, position: 78, index: 28 },
            { value: '// second line\n', type: Lexer.T_COMMENT, position: 101, index: 29 },
            { value: 'end-of-file', type: Lexer.T_EOF, position: 116, index: 30 },
        ]);
    });

    it ('can parse template strings', () => {
        const lexer = new Lexer();

        lexer.input = `\`'N \${p} (\${
  x ? 'u' : 'l'
})\``;
        expect(lexer._tokens).to.be.deep.eq([
            { value: '`\'N ${p} (${\n  x ? \'u\' : \'l\'\n})`', type: Lexer.T_STRING, position: 0, index: 0 },
            { value: 'end-of-file', type: Lexer.T_EOF, position: 32, index: 1 },
        ]);
    });
});
