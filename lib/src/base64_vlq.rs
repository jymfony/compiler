use crate::base64;
use std::convert::TryInto;
use std::fmt::{Debug, Formatter};
use wasm_bindgen::prelude::*;

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// Length quantities we use in the source map spec, the first bit is the sign,
// The next four bits are the actual value, and the 6th bit is the
// Continuation bit. The continuation bit tells us whether there are more
// Digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

const VLQ_BASE_SHIFT: i32 = 5;

// Binary: 100000
const VLQ_BASE: i32 = 1 << VLQ_BASE_SHIFT;

// Binary: 011111
const VLQ_BASE_MASK: i32 = VLQ_BASE - 1;

// Binary: 100000
const VLQ_CONTINUATION_BIT: i32 = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
fn to_vlq_signed(value: i32) -> i32 {
    if 0 > value {
        ((-value) << 1) + 1
    } else {
        value << 1
    }
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
fn from_vlq_signed(value: i32) -> i32 {
    if 1 == (value & 1) {
        -(value >> 1)
    } else {
        value >> 1
    }
}

/**
 * Returns the base 64 VLQ encoded value.
 */
#[wasm_bindgen]
pub fn base64vlq_encode(value: i32) -> String {
    let mut encoded = String::new();
    let mut digit;
    let mut vlq = to_vlq_signed(value);

    loop {
        digit = vlq & VLQ_BASE_MASK;
        vlq >>= VLQ_BASE_SHIFT;

        if vlq > 0 {
            // There are still more digits in this value, so we must make sure the
            // continuation bit is marked.
            digit |= VLQ_CONTINUATION_BIT;
        }

        encoded.push(base64::encode(digit).unwrap());
        if vlq <= 0 {
            break;
        }
    }

    encoded
}

pub enum DecodeError {
    InvalidIndex,
    InvalidDigit(char),
}

impl ToString for DecodeError {
    fn to_string(&self) -> String {
        match self {
            Self::InvalidIndex => "Expected more digits in base 64 VLQ value.".to_string(),
            Self::InvalidDigit(c) => format!("Invalid base64 digit: {}", c),
        }
    }
}

impl From<DecodeError> for JsValue {
    fn from(value: DecodeError) -> Self {
        JsError::new(&value.to_string()).into()
    }
}

impl Debug for DecodeError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.to_string())
    }
}

/**
 * Decodes the next base 64 VLQ value from the given string.
 */
#[wasm_bindgen]
pub fn base64vlq_decode(str: &str, mut index: usize) -> Result<Vec<i32>, DecodeError> {
    let str_len = str.len();
    let chars: Vec<char> = str.chars().collect();
    let mut result: i32 = 0;
    let mut shift = 0;
    let mut continuation;
    let mut digit;

    loop {
        if index >= str_len {
            return Err(DecodeError::InvalidIndex);
        }

        let char = chars.get(index).copied().unwrap();
        digit = base64::decode(char as i32);

        if -1 == digit {
            return Err(DecodeError::InvalidDigit(char));
        }

        index += 1;

        continuation = digit & VLQ_CONTINUATION_BIT;
        digit &= VLQ_BASE_MASK;
        result += digit << shift;
        shift += VLQ_BASE_SHIFT;

        if continuation == 0 {
            break;
        }
    }

    Ok(vec![from_vlq_signed(result), index.try_into().unwrap()])
}
