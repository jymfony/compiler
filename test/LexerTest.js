/* eslint-disable no-template-curly-in-string */
const Lexer = require('../src/Lexer');
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class LexerTest extends TestCase {
    get testCaseName() {
        return '[Compiler] ' + super.testCaseName;
    }

    testCanParseMultipleBacktickStringsOnTheSameLine() {
        const lexer = new Lexer();

        lexer.input = '`${l}\\n` : `${sp}${l}\\n`';
        __self.assertEquals([
            { value: '`${l}\\n`', type: Lexer.T_STRING, position: 0, index: 0 },
            { value: ' ', type: Lexer.T_SPACE, position: 8, index: 1 },
            { value: ':', type: Lexer.T_COLON, position: 9, index: 2 },
            { value: ' ', type: Lexer.T_SPACE, position: 10, index: 3 },
            { value: '`${sp}${l}\\n`', type: Lexer.T_STRING, position: 11, index: 4 },
            { value: 'end-of-file', type: Lexer.T_EOF, position: 24, index: 5 },
        ], lexer._tokens);
    }

    testCanParseXorOperatorWOSpacesCorrectly() {
        const lexer = new Lexer();

        lexer.input = 'x^y';
        __self.assertEquals([
            { value: 'x', type: Lexer.T_IDENTIFIER, position: 0, index: 0 },
            { value: '^', type: Lexer.T_OPERATOR, position: 1, index: 1 },
            { value: 'y', type: Lexer.T_IDENTIFIER, position: 2, index: 2 },
            { value: 'end-of-file', type: Lexer.T_EOF, position: 3, index: 3 },
        ], lexer._tokens);
    }

    testCanParseVariableNameWithDollarSign() {
        const lexer = new Lexer();

        lexer.input = 'var this$1';
        __self.assertEquals([
            { value: 'var', type: Lexer.T_KEYWORD, position: 0, index: 0 },
            { value: ' ', type: Lexer.T_SPACE, position: 3, index: 1 },
            { value: 'this$1', type: Lexer.T_IDENTIFIER, position: 4, index: 2 },
            { value: 'end-of-file', type: Lexer.T_EOF, position: 10, index: 3 },
        ], lexer._tokens);
    }

    testCanParseCommentsContainingBackticks() {
        const lexer = new Lexer();

        lexer.input = `function x(v) {
  return v !== '*' ? \`\\\`\${v.replace(/\`/g, '\`\`')}\\\`\` : '*';
}

// this is a \`comment\`
// second line
`;
        __self.assertEquals([
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
        ], lexer._tokens);
    }

    testCanParseTemplateStrings() {
        const lexer = new Lexer();

        lexer.input = `\`'N \${p} (\${
  x ? 'u' : 'l'
})\``;
        __self.assertEquals([
            { value: '`\'N ${p} (${\n  x ? \'u\' : \'l\'\n})`', type: Lexer.T_STRING, position: 0, index: 0 },
            { value: 'end-of-file', type: Lexer.T_EOF, position: 32, index: 1 },
        ], lexer._tokens);
    }

    testCanParseTemplateStringsWithHtmlComments() {
        const lexer = new Lexer();

        lexer.input = `return \`
      <div
        \${this.htmlAttributes({
            class: classesName,
            style: 'div'
        })}
      >
        <!--[if mso | IE]>
        <table
          \${this.htmlAttributes({
            bgcolor: this.getAttribute('background-color') === 'none' ? undefined : this.getAttribute('background-color'),
            border: '0',
            cellpadding: '0',
            cellspacing: '0',
            role: 'presentation'
        })}
        >
          <tr>
        <![endif]-->
          \${this.renderChildren(children, {
            attributes: {
                mobileWidth: 'mobileWidth'
            },
            renderer: component => component.constructor.isRawElement() ? component.render() : \`
              <!--[if mso | IE]>
              <td
                \${component.htmlAttributes({
                style: {
                    align: component.getAttribute('align'),
                    'vertical-align': component.getAttribute('vertical-align'),
                    width: getElementWidth(component.getWidthAsPixel ? component.getWidthAsPixel() : component.getAttribute('width'))
                }
            })}
              >
              <![endif]-->
                \${component.render()}
              <!--[if mso | IE]>
              </td>
              <![endif]-->
          \`
        })}
        <!--[if mso | IE]>
          </tr>
          </table>
        <![endif]-->
      </div>
    \`;`;
        __self.assertEquals([
            { value: 'return', type: Lexer.T_RETURN, position: 0, index: 0 },
            { value: ' ', type: Lexer.T_SPACE, position: 6, index: 1 },
            { value: "`\n      <div\n        ${this.htmlAttributes({\n            class: classesName,\n            style: 'div'\n        })}\n      >\n        <!--[if mso | IE]>\n        <table\n          ${this.htmlAttributes({\n            bgcolor: this.getAttribute('background-color') === 'none' ? undefined : this.getAttribute('background-color'),\n            border: '0',\n            cellpadding: '0',\n            cellspacing: '0',\n            role: 'presentation'\n        })}\n        >\n          <tr>\n        <![endif]-->\n          ${this.renderChildren(children, {\n            attributes: {\n                mobileWidth: 'mobileWidth'\n            },\n            renderer: component => component.constructor.isRawElement() ? component.render() : `\n              <!--[if mso | IE]>\n              <td\n                ${component.htmlAttributes({\n                style: {\n                    align: component.getAttribute('align'),\n                    'vertical-align': component.getAttribute('vertical-align'),\n                    width: getElementWidth(component.getWidthAsPixel ? component.getWidthAsPixel() : component.getAttribute('width'))\n                }\n            })}\n              >\n              <![endif]-->\n                ${component.render()}\n              <!--[if mso | IE]>\n              </td>\n              <![endif]-->\n          `\n        })}\n        <!--[if mso | IE]>\n          </tr>\n          </table>\n        <![endif]-->\n      </div>\n    `", type: Lexer.T_STRING, position: 7, index: 2 },
            { value: ';', type: Lexer.T_SEMICOLON, position: 1444, index: 3 },
            { value: 'end-of-file', type: Lexer.T_EOF, position: 1445, index: 4 },
        ], lexer._tokens);
    }
}
