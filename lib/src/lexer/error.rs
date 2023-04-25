use alloc::borrow::Cow;
use crate::lexer::Span;

pub struct Error {
    error: Box<(Span, SyntaxError)>,
}

impl Error {
    #[cold]
    pub(crate) fn new(span: Span, error: SyntaxError) -> Self {
        Self {
            error: Box::new((span, error)),
        }
    }

    pub fn kind(&self) -> &SyntaxError {
        &self.error.1
    }

    pub fn into_kind(self) -> SyntaxError {
        self.error.1
    }
}

#[derive(Debug, Clone, PartialEq)]
#[non_exhaustive]
pub enum SyntaxError {
    Eof,
    UnexpectedChar { c: char },
}

impl SyntaxError {
    #[cold]
    #[inline(never)]
    pub fn msg(&self) -> Cow<'static, str> {
        match self {
            SyntaxError::Eof => "Unexpected eof".into(),
            SyntaxError::UnexpectedChar { c } => format!("Unexpected character {:?}", c).into(),
        }
    }
}
