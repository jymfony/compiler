use crate::base64_vlq::base64vlq_encode;
use crate::mapping::{Mapping, MappingList};
use crate::parser::parse_mappings;
use crate::Position;
use js_sys::{JsString, JSON};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

/// A mapping can have one of the three levels of data:
///
///   1. Just the generated position.
///   2. The Generated position, original position, and original source.
///   3. Generated and original position, original source, as well as a name
///      token.
///
/// To maintain consistency, we validate that any new mapping being added falls
/// in to one of these categories.
pub fn validate_mapping(generated: &Position, original: Option<&Position>) -> Result<(), JsValue> {
    if 0 < generated.line() && 0 <= generated.column() && original.is_none() {
        // Case 1.
    } else {
        let original = original.unwrap();
        if 0 < generated.line()
            && 0 <= generated.column()
            && 0 < original.line()
            && 0 <= original.column()
        {
            // Cases 2 and 3.
        } else {
            return Err(JsError::new(&format!(
                "Invalid mapping: {}, {}",
                JSON::stringify(generated)?,
                JSON::stringify(original)?
            ))
            .into());
        }
    }

    Ok(())
}

#[wasm_bindgen]
pub struct Generator {
    file: Option<String>,
    sources: Vec<String>,
    skip_validation: bool,
    mappings: MappingList,
    sources_content: Vec<Option<String>>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct JsonMapping {
    version: i32,
    sources: Vec<String>,
    mappings: String,
    file: Option<String>,
    sources_content: Vec<Option<String>>,
}

/// An instance of the SourceMapGenerator represents a source map which is
/// being built incrementally.
#[wasm_bindgen]
impl Generator {
    /**
    /// Constructor.
     */
    #[wasm_bindgen(constructor)]
    pub fn new(file: Option<String>, skip_validation: Option<bool>) -> Self {
        Self {
            file,
            skip_validation: skip_validation.unwrap_or(false),
            sources: vec![],
            mappings: MappingList::new(),
            sources_content: vec![None],
        }
    }

    /// Add a single mapping from original source line and column to the generated
    /// source's line and column for this source map being created.
    #[wasm_bindgen(js_name = addMapping)]
    pub fn add_mapping(
        &mut self,
        generated: Position,
        original: Option<Position>,
    ) -> Result<(), JsValue> {
        if !self.skip_validation {
            validate_mapping(&generated, original.as_ref())?;
        }

        if let Some(original) = original {
            self.mappings.add(Mapping::new(
                generated,
                Some(original),
                self.file.clone(),
                None,
            ));
        }

        Ok(())
    }

    #[wasm_bindgen(js_name = applyMapping)]
    pub fn apply_mapping(
        &mut self,
        original: &str,
        sources: Box<[JsString]>,
        sources_content: Box<[JsString]>,
    ) -> Result<(), JsValue> {
        let original_mappings = parse_mappings(original)?;
        let mut new_sources = vec![];

        // Find mappings for the "sourceFile"
        self.mappings.map(|mapping| {
            if mapping.original_line().unwrap_or(0) == 0 {
                return None;
            }

            // Check if it can be mapped by the source map, then update the mapping.
            let searching = Mapping::new(
                Position::new(
                    mapping.original_line.unwrap(),
                    mapping.original_column.unwrap(),
                ),
                None,
                None,
                None,
            );

            let found = original_mappings.search(&JsValue::from(searching), None);
            let original_value = found.as_ref()?.get(0);
            let original = Mapping::try_from(&original_value).unwrap();

            let mut mapping = mapping.clone();
            // Copy mapping
            if let Some(source_index) = mapping.source_index() {
                mapping.set_source(sources.get(source_index as usize).map(ToString::to_string));
            }

            mapping.original_line = original.original_line;
            mapping.original_column = original.original_column;

            if let Some(name) = original.name() {
                mapping.set_name(Some(name));
            }

            if let Some(source) = mapping.source() {
                if !new_sources.contains(&source) {
                    new_sources.push(source);
                }
            }

            Some(mapping)
        });

        self.sources = new_sources;
        self.sources_content = vec![];

        for source in &self.sources {
            if let Some(idx) = sources.iter().position(|s| s == source) {
                self.sources_content
                    .push(sources_content.get(idx).map(ToString::to_string));
            } else {
                self.sources_content.push(None);
            }
        }

        Ok(())
    }

    /// Set the source content for a source file.
    #[wasm_bindgen(setter = sourceContent)]
    pub fn set_source_content(&mut self, content: &str) {
        self.sources_content
            .splice(0..1, [Some(content.to_string())]);
    }

    /// Externalize the source map.
    #[wasm_bindgen(js_name = toJSON)]
    pub fn get_json(&mut self) -> JsValue {
        let map = JsonMapping {
            version: 3,
            sources: self.sources.clone(),
            mappings: self.serialize_mappings(),
            file: self.file.clone(),
            sources_content: self.sources_content.clone(),
        };

        serde_wasm_bindgen::to_value(&map).unwrap()
    }

    /// Render the source map being generated to a string.
    #[wasm_bindgen(js_name = toString)]
    pub fn get_string(&mut self) -> Result<JsString, JsValue> {
        JSON::stringify(&self.get_json())
    }

    /// Serialize the accumulated mappings in to the stream of base 64 VLQs
    /// specified by the source map format.
    fn serialize_mappings(&mut self) -> String {
        let mut previous_generated_column = 0;
        let mut previous_generated_line = 1;
        let mut previous_original_column = 0;
        let mut previous_original_line = 0;
        let mut previous_source = 0;
        let mut result = String::new();
        let mut next;
        let mut mapping;
        let mut source_idx;

        let mappings = self.mappings.get_vec();
        let len = mappings.len();
        for i in 0..len {
            mapping = mappings.get(i).unwrap();
            next = String::new();

            if mapping.generated_line != previous_generated_line {
                previous_generated_column = 0;
                while mapping.generated_line != previous_generated_line {
                    next += ";";
                    previous_generated_line += 1;
                }
            } else if 0 < i {
                if 0 == mapping
                    .compare_by_generated_positions_inflated(mappings.get(i - 1).unwrap())
                {
                    continue;
                }

                next += ",";
            }

            next += &base64vlq_encode(mapping.generated_column - previous_generated_column);
            previous_generated_column = mapping.generated_column;

            if mapping.original_line.is_some() && mapping.original_column.is_some() {
                source_idx = 0;
                next += &base64vlq_encode(source_idx - previous_source);
                previous_source = source_idx;

                // Lines are stored 0-based in SourceMap spec version 3
                next +=
                    &base64vlq_encode(mapping.original_line.unwrap() - 1 - previous_original_line);
                previous_original_line = mapping.original_line.unwrap() - 1;

                next +=
                    &base64vlq_encode(mapping.original_column.unwrap() - previous_original_column);
                previous_original_column = mapping.original_column.unwrap();
            }

            result += &next;
        }

        result
    }
}
