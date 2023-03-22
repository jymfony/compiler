const INT_TO_CHAR_MAP: [char; 64] = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4',
    '5', '6', '7', '8', '9', '+', '/',
];

const BIG_A: i32 = 65; // 'A'
const BIG_Z: i32 = 90; // 'Z'

const LITTLE_A: i32 = 97; // 'a'
const LITTLE_Z: i32 = 122; // 'z'

const ZERO: i32 = 48; // '0'
const NINE: i32 = 57; // '9'

const PLUS: i32 = 43; // '+'
const SLASH: i32 = 47; // '/'

const LITTLE_OFFSET: i32 = 26;
const NUMBER_OFFSET: i32 = 52;

pub fn encode(num: i32) -> Option<char> {
    INT_TO_CHAR_MAP.get(num as usize).copied()
}

pub fn decode(char_code: i32) -> i32 {
    // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
    if (BIG_A..=BIG_Z).contains(&char_code) {
        return char_code - BIG_A;
    }

    // 26 - 51: abcdefghijklmnopqrstuvwxyz
    if (LITTLE_A..=LITTLE_Z).contains(&char_code) {
        return char_code - LITTLE_A + LITTLE_OFFSET;
    }

    // 52 - 61: 0123456789
    if (ZERO..=NINE).contains(&char_code) {
        return char_code - ZERO + NUMBER_OFFSET;
    }

    // 62: +
    if char_code == PLUS {
        return 62;
    }

    // 63: /
    if char_code == SLASH {
        return 63;
    }

    // Invalid base64 digit.
    -1
}

#[test]
fn test_encode() {
    assert_eq!(encode(0), Some('A'));
    assert_eq!(encode(26), Some('a'));
    assert_eq!(encode(64), None);
}

#[test]
fn test_decode() {
    assert_eq!(decode('A' as i32), 0);
    assert_eq!(decode('a' as i32), 26);
    assert_eq!(decode('+' as i32), 62);
    assert_eq!(decode('/' as i32), 63);
    assert_eq!(decode(511125547), -1);
}
