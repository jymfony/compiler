use crate::Position;
use wasm_bindgen::prelude::*;
use wasm_bindgen_derive::TryFromJsValue;

#[derive(TryFromJsValue)]
#[wasm_bindgen(inspectable)]
#[derive(Clone, Default, Debug)]
pub struct Mapping {
    pub(crate) generated_line: i32,
    pub(crate) generated_column: i32,
    pub(crate) original_line: Option<i32>,
    pub(crate) original_column: Option<i32>,
    source: Option<String>,
    source_index: Option<u32>,
    name: Option<String>,
    name_index: Option<u32>,
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

/// Determine whether mapping_b is after mapping_a with respect to generated
/// position.
fn generated_position_after(mapping_a: &Mapping, mapping_b: &Mapping) -> bool {
    // Optimized for most common case
    let line_a = mapping_a.generated_line;
    let line_b = mapping_b.generated_line;
    let column_a = mapping_a.generated_column;
    let column_b = mapping_b.generated_column;

    line_b > line_a
        || line_b == line_a && column_b >= column_a
        || mapping_a.compare_by_generated_positions_inflated(mapping_b) > 0
}

pub struct MappingList {
    array: Vec<Mapping>,
    sorted: bool,
    last: Mapping,
}

impl Default for MappingList {
    fn default() -> Self {
        Self::new()
    }
}

/// A data structure to provide a sorted view of accumulated mappings in a
/// performance conscious manner. It trades a negligible overhead in general
/// case for a large speedup in case of mappings being added in order.
impl MappingList {
    pub fn new() -> Self {
        Self {
            array: vec![],
            sorted: true,

            // Serves as infimum
            last: Mapping {
                generated_line: -1,
                generated_column: 0,
                ..Default::default()
            },
        }
    }

    /// Add the given source mapping.
    pub fn add(&mut self, mapping: Mapping) {
        if generated_position_after(&self.last, &mapping) {
            self.last = mapping.clone();
            self.array.push(mapping);
        } else {
            self.sorted = false;
            self.array.push(mapping);
        }
    }

    pub(crate) fn sort(&mut self) {
        self.array.sort_by(|a, b| a.compare_by_generated_positions_inflated(b).cmp(&0));
        self.sorted = true;
    }

    /// Returns the flat, sorted array of mappings. The mappings are sorted by
    /// generated position.
    ///
    /// WARNING: This method returns internal data without copying, for
    /// performance. The return value must NOT be mutated, and should be treated as
    /// an immutable borrow. If you want to take ownership, you must make your own
    /// copy.
    pub fn get_vec(&'_ mut self) -> &'_ Vec<Mapping> {
        if !self.sorted {
            self.sort();
        }

        self.array.as_ref()
    }

    /// Execute forEach on unsorted mappings.
    pub fn map<F: FnMut(&Mapping) -> Option<Mapping>>(&mut self, predicate: F) {
        self.array = self.array.iter().filter_map(predicate).collect();
        self.sorted = false;
    }
}
