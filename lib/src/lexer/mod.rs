mod byte_handler;
mod input;
mod error;

use alloc::rc::Rc;
use std::cell::RefCell;
use std::ops::{Add, Sub};
use input::Input;
pub use error::Error;
use crate::lexer::byte_handler::LexResult;
use crate::lexer::error::SyntaxError;

#[derive(Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord, Debug, Default)]
struct BytePos(pub u32);

impl Add for BytePos {
    type Output = Self;

    fn add(self, rhs: Self) -> Self::Output {
        Self(self.0 + rhs.0)
    }
}

impl Sub for BytePos {
    type Output = Self;

    fn sub(self, rhs: Self) -> Self::Output {
        Self(self.0 - rhs.0)
    }
}

pub struct Span {
    pub lo: BytePos,
    pub hi: BytePos,
}

pub enum Token {

}

struct Lexer<'a> {
    pub(crate) input: Input<'a>,
    buf: Rc<RefCell<String>>,
}

impl<'a> Lexer<'a> {
    pub fn new() -> Self {
        Self {
            input: Input::new("", BytePos::default()),
            buf: Rc::new(RefCell::new(String::with_capacity(256))),
        }
    }

    /// `#`
    pub fn read_token_number_sign(&mut self) -> LexResult<Option<Token>> {
        debug_assert!(self.cur().is_some());

        if self.input.is_at_start() && self.input.peek(1) == Some('!') {
            Ok(Some(Token::Shebang))
        } else {
            self.input.bump(); // '#'
            Ok(Some(Token::Identifier))
        }
    }

    /// This method is optimized for texts without escape sequences.
    fn read_word_as_str_with<F, Ret>(&mut self, convert: F) -> LexResult<(Ret, bool)>
        where
            F: FnOnce(&str) -> Ret,
    {
        debug_assert!(self.cur().is_some());
        let mut first = true;

        self.with_buf(|l, buf| {
            let mut has_escape = false;

            while let Some(c) = {
                // Optimization
                {
                    let s = l.input.uncons_while(|c| c.is_ident_part());
                    if !s.is_empty() {
                        first = false;
                    }
                    buf.push_str(s)
                }

                l.cur()
            } {
                let start = l.cur_pos();

                match c {
                    c if c.is_ident_part() => {
                        l.bump();
                        buf.push(c);
                    }
                    // unicode escape
                    '\\' => {
                        l.bump();

                        if !l.is(b'u') {
                            l.error_span(pos_span(start), SyntaxError::ExpectedUnicodeEscape)?
                        }

                        has_escape = true;

                        let chars = l.read_unicode_escape(&mut Raw(None))?;

                        if let Some(c) = chars.get(0) {
                            let valid = if first {
                                c.is_ident_start()
                            } else {
                                c.is_ident_part()
                            };

                            if !valid {
                                l.emit_error(start, SyntaxError::InvalidIdentChar);
                            }
                        }

                        for c in chars {
                            buf.extend(c);
                        }
                    }
                    _ => {
                        break;
                    }
                }
                first = false;
            }
            let value = convert(buf);

            Ok((value, has_escape))
        })
    }

    /// Utility method to reuse buffer.
    fn with_buf<F, Ret>(&mut self, op: F) -> LexResult<Ret>
        where
            F: for<'any> FnOnce(&mut Lexer<'any>, &mut String) -> LexResult<Ret>,
    {
        let b = self.buf.clone();
        let mut buf = b.borrow_mut();
        buf.clear();

        op(self, &mut buf)
    }
}
