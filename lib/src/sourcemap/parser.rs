use super::base64_vlq::base64vlq_decode;
use super::mapping::Mapping;
use crate::{BTree, Position};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(raw_module = "../support.js")]
extern "C" {
    #[wasm_bindgen(js_name = generateMappingsBTree)]
    pub fn generate_mappings_btree() -> BTree;
}

#[wasm_bindgen(js_name = parseMappings)]
pub fn parse_mappings(mappings: &str) -> Result<BTree, JsValue> {
    let mut generated_line = 1;
    let mut previous_generated_column = 0;
    let mut previous_original_line = 0;
    let mut previous_original_column = 0;
    let mut previous_source = 0;
    let mut previous_name = 0;
    let length = mappings.len();
    let mapping_chars = mappings.chars().collect::<Vec<char>>();
    let mut index = 0;

    let mut cached_segments: HashMap<String, Vec<i32>> = HashMap::new();
    let generated_mappings = generate_mappings_btree();

    let mut mapping;
    let mut str;
    let mut segment;
    let mut end;
    let mut value;

    while index < length {
        let current_char = *mapping_chars.get(index).unwrap();
        if ';' == current_char {
            generated_line += 1;
            index += 1;
            previous_generated_column = 0;
        } else if ',' == current_char {
            index += 1;
        } else {
            // Because each offset is encoded relative to the previous one,
            // Many segments often have the same encoding. We can exploit this
            // Fact by caching the parsed variable length fields of each segment,
            // Allowing us to avoid a second parse if we encounter the same
            // Segment again.
            end = index;
            loop {
                if end >= length {
                    break;
                }

                let c = *mapping_chars.get(end).unwrap();
                if ';' == c || ',' == c {
                    break;
                }

                end += 1;
            }

            str = mappings.get(index..end).unwrap_or_default().to_string();
            if let Some(cached) = cached_segments.get(&str) {
                segment = cached.clone();
                index += str.len();
            } else {
                segment = vec![];
                while index < end {
                    let decoded = base64vlq_decode(mappings, index)?;
                    value = decoded.first().copied().unwrap_or_default();
                    index = decoded.get(1).copied().unwrap_or_default() as usize;
                    segment.push(value);
                }

                if 2 == segment.len() {
                    return Err(JsError::new("Found a source, but no line and column").into());
                }

                if 3 == segment.len() {
                    return Err(JsError::new("Found a source and line, but no column").into());
                }

                cached_segments.insert(str, segment.clone());
            }

            let seg0 = segment.first().copied().unwrap_or_default();
            mapping = Mapping::new(
                Position::new(generated_line, previous_generated_column + seg0),
                None,
                None,
                None,
            );
            previous_generated_column = mapping.generated_column;

            if 1 < segment.len() {
                // Original source.
                let seg1 = *segment.get(1).unwrap() as u32;
                let seg2 = *segment.get(2).unwrap();
                let seg3 = *segment.get(3).unwrap();
                mapping.set_source_index(Some(previous_source + seg1));
                previous_source += seg1;

                // Original line.
                let new_original_line = previous_original_line + seg2;
                mapping.original_line = Some(new_original_line + 1);
                previous_original_line = new_original_line;

                // Original column.
                mapping.original_column = Some(previous_original_column + seg3);
                previous_original_column += seg3;

                if 4 < segment.len() {
                    // Original name.
                    let seg4 = segment.get(4).copied().unwrap_or_default() as u32;
                    mapping.set_name_index(Some(previous_name + seg4));
                    previous_name += seg4;
                }
            }

            generated_mappings.push(mapping.into(), true.into());
        }
    }

    Ok(generated_mappings)
}
