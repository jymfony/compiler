use super::BytePos;
use debug_unreachable::debug_unreachable;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub(crate) struct Char(u32);

impl From<char> for Char {
    fn from(c: char) -> Self {
        Char(c as u32)
    }
}

impl From<u32> for Char {
    fn from(c: u32) -> Self {
        Char(c)
    }
}

pub struct Input<'a> {
    start_pos_of_iter: BytePos,
    last_pos: BytePos,
    iter: std::str::CharIndices<'a>,
    orig: &'a str,
    orig_start: BytePos,
}

impl<'a> Input<'a> {
    pub fn new(src: &'a str, start: BytePos) -> Self {
        Self {
            start_pos_of_iter: start,
            last_pos: start,
            orig: src,
            iter: src.char_indices(),
            orig_start: start,
        }
    }

    #[inline(always)]
    pub fn as_str(&self) -> &str {
        self.iter.as_str()
    }

    #[inline]
    pub fn bump_bytes(&mut self, n: usize) {
        self.reset_to(self.last_pos + BytePos(n as u32));
    }

    #[inline]
    pub fn is_at_start(&self) -> bool {
        self.last_pos == self.orig_start
    }

    #[inline]
    pub fn last_pos(&self) -> BytePos {
        self.last_pos
    }

    #[inline]
    pub(crate) fn cur(&self) -> Option<char> {
        self.iter.clone().next().map(|i| i.1.into())
    }

    #[inline]
    pub(crate) fn peek(&self, nth: usize) -> Option<char> {
        assert!(nth >= 1);
        self.iter.clone().nth(nth).map(|i| i.1.into())
    }

    #[inline]
    pub(super) fn bump(&mut self) {
        if let Some((i, c)) = self.iter.next() {
            self.last_pos = self.start_pos_of_iter + BytePos((i + c.len_utf8()) as u32);
        } else {
            unsafe {
                debug_unreachable!("bump should not be called when cur() == None");
            }
        }
    }

    #[inline]
    pub(super) fn reset_to(&mut self, to: BytePos) {
        let orig = self.orig;
        let idx = (to - self.orig_start).0 as usize;

        debug_assert!(idx <= orig.len());
        let s = unsafe { orig.get_unchecked(idx..) };
        self.iter = s.char_indices();
        self.start_pos_of_iter = to;
        self.last_pos = to;
    }

    #[inline]
    pub(super) fn uncons_while<F>(&mut self, mut pred: F) -> &str
        where
            F: FnMut(char) -> bool,
    {
        let s = self.iter.as_str();
        let mut last = 0;

        for (i, c) in s.char_indices() {
            if pred(c) {
                last = i + c.len_utf8();
            } else {
                break;
            }
        }

        debug_assert!(last <= s.len());
        let ret = unsafe { s.get_unchecked(..last) };

        self.last_pos = self.last_pos + BytePos(last as _);
        self.start_pos_of_iter = self.last_pos;
        self.iter = unsafe { s.get_unchecked(last..) }.char_indices();

        ret
    }
}
