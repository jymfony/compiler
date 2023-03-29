use alloc::collections::btree_set::Iter;
use crate::Position;
use serde::{Deserialize, Serialize};
use std::cmp::Ordering;
use std::collections::BTreeSet;
use wasm_bindgen::prelude::*;
use wasm_bindgen_derive::TryFromJsValue;

#[derive(TryFromJsValue)]
#[wasm_bindgen(inspectable)]
#[derive(Clone, Default, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Mapping {
    pub(crate) generated_line: i32,
    pub(crate) generated_column: i32,
    pub(crate) original_line: Option<i32>,
    pub(crate) original_column: Option<i32>,
    source: Option<String>,
    #[serde(skip_serializing)]
    source_index: Option<u32>,
    name: Option<String>,
    #[serde(skip_serializing)]
    name_index: Option<u32>,
}

impl Eq for Mapping {}
impl PartialEq<Self> for Mapping {
    fn eq(&self, other: &Self) -> bool {
        self.compare_by_generated_positions_inflated(other) == 0
    }
}

impl PartialOrd<Self> for Mapping {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for Mapping {
    fn cmp(&self, other: &Self) -> Ordering {
        self.compare_by_generated_positions_inflated(other).cmp(&0)
    }
}

#[wasm_bindgen]
impl Mapping {
    #[wasm_bindgen(constructor)]
    pub fn new(
        generated: Position,
        original: Option<Position>,
        source: Option<String>,
        name: Option<String>,
    ) -> Self {
        Self {
            generated_line: generated.line(),
            generated_column: generated.column(),
            original_line: original.as_ref().map(|p| p.line()),
            original_column: original.as_ref().map(|p| p.column()),
            source,
            source_index: None,
            name,
            name_index: None,
        }
    }

    #[wasm_bindgen(getter = generatedLine)]
    pub fn generated_line(&self) -> i32 {
        self.generated_line
    }

    #[wasm_bindgen(getter = generatedColumn)]
    pub fn generated_column(&self) -> i32 {
        self.generated_column
    }

    #[wasm_bindgen(getter = originalLine)]
    pub fn original_line(&self) -> Option<i32> {
        self.original_line
    }

    #[wasm_bindgen(getter = originalColumn)]
    pub fn original_column(&self) -> Option<i32> {
        self.original_column
    }

    #[wasm_bindgen(getter = source)]
    pub fn source(&self) -> Option<String> {
        self.source.clone()
    }

    pub fn source_index(&self) -> Option<u32> {
        self.source_index
    }

    pub fn set_source(&mut self, val: Option<String>) {
        self.source = val;
        self.source_index = None;
    }

    pub fn set_source_index(&mut self, val: Option<u32>) {
        self.source = None;
        self.source_index = val;
    }

    #[wasm_bindgen(getter = name)]
    pub fn name(&self) -> Option<String> {
        self.name.clone()
    }

    pub fn set_name(&mut self, val: Option<String>) {
        self.name = val;
        self.name_index = None;
    }

    pub fn set_name_index(&mut self, val: Option<u32>) {
        self.name = None;
        self.name_index = val;
    }

    /// Comparator between two mappings with inflated source and name strings where
    /// the generated positions are compared.
    pub fn compare_by_generated_positions_inflated(&self, other: &Mapping) -> i32 {
        let mut cmp = self.generated_line - other.generated_line;
        if 0 != cmp {
            return cmp;
        }

        cmp = self.generated_column - other.generated_column;
        if 0 != cmp {
            return cmp;
        }

        cmp = self.source.cmp(&other.source) as i32;
        if 0 != cmp {
            return cmp;
        }

        cmp = self.original_line.unwrap_or_default() - other.original_line.unwrap_or_default();
        if 0 != cmp {
            return cmp;
        }

        cmp = self.original_column.unwrap_or_default() - other.original_column.unwrap_or_default();
        if 0 != cmp {
            return cmp;
        }

        self.name.cmp(&other.name) as i32
    }

    /// Comparator between two mappings with deflated source and name indices where
    /// the generated positions are compared.
    #[wasm_bindgen(method, js_name = compareByGeneratedPositionsDeflated)]
    pub fn compare_by_generated_positions_deflated(this: &Mapping, other: &Mapping) -> i32 {
        let mut cmp = this.generated_line - other.generated_line;
        if 0 != cmp {
            return cmp;
        }

        cmp = this.generated_column - other.generated_column;
        if 0 != cmp {
            return cmp;
        }

        if this.original_line.is_none()
            || this.original_column.is_none()
            || other.original_line.is_none()
            || other.original_column.is_none()
        {
            return cmp;
        }

        cmp = this.original_line.unwrap() - other.original_line.unwrap();
        if 0 != cmp {
            return cmp;
        }

        this.original_column.unwrap() - other.original_column.unwrap()
    }
}

#[derive(Clone)]
pub struct MappingList {
    array: BTreeSet<Mapping>,
}

impl Default for MappingList {
    fn default() -> Self {
        Self::new()
    }
}

impl<'a> IntoIterator for &'a MappingList {
    type Item = &'a Mapping;
    type IntoIter = Iter<'a, Mapping>;

    fn into_iter(self) -> Self::IntoIter {
        (&self.array).into_iter()
    }
}

/// A data structure to provide a sorted view of accumulated mappings in a
/// performance conscious manner. It trades a negligible overhead in general
/// case for a large speedup in case of mappings being added in order.
impl MappingList {
    pub fn new() -> Self {
        Self {
            array: BTreeSet::new(),
        }
    }

    /// Add the given source mapping.
    pub fn add(&mut self, mapping: Mapping) {
        self.array.insert(mapping);
    }

    /// Returns the flat, sorted array of mappings. The mappings are sorted by
    /// generated position.
    ///
    /// WARNING: This method returns internal data without copying, for
    /// performance. The return value must NOT be mutated, and should be treated as
    /// an immutable borrow. If you want to take ownership, you must make your own
    /// copy.
    pub fn get_vec(&'_ self) -> Vec<&'_ Mapping> {
        self.array.iter().collect()
    }

    /// Execute forEach on unsorted mappings.
    pub fn map<F: FnMut(&Mapping) -> Option<Mapping>>(&mut self, predicate: F) {
        self.array = self.array.iter().filter_map(predicate).collect();
    }
}
