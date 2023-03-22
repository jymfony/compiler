use wasm_bindgen::prelude::*;

#[wasm_bindgen(raw_module = "../../src/AST/Position")]
extern "C" {
    pub type Position;

    #[wasm_bindgen(method, getter)]
    fn column(this: &Position) -> i32;

    #[wasm_bindgen(method, getter)]
    fn line(this: &Position) -> i32;
}

#[wasm_bindgen]
pub struct Mapping {
    generated_line: i32,
    generated_column: i32,
    original_line: Option<i32>,
    original_column: Option<i32>,
    source: Option<String>,
    name: Option<String>,
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
            name,
        }
    }

    #[wasm_bindgen(getter = generatedLine)]
    pub fn generated_line(&self) -> i32 {
        self.generated_line
    }

    #[wasm_bindgen(setter = generatedLine)]
    pub fn set_generated_line(&mut self, val: i32) {
        self.generated_line = val
    }

    #[wasm_bindgen(getter = generatedColumn)]
    pub fn generated_column(&self) -> i32 {
        self.generated_column
    }

    #[wasm_bindgen(setter = generatedColumn)]
    pub fn set_generated_column(&mut self, val: i32) {
        self.generated_column = val
    }

    #[wasm_bindgen(getter = originalLine)]
    pub fn original_line(&self) -> Option<i32> {
        self.original_line
    }

    #[wasm_bindgen(setter = originalLine)]
    pub fn set_original_line(&mut self, val: Option<i32>) {
        self.original_line = val;
    }

    #[wasm_bindgen(getter = originalColumn)]
    pub fn original_column(&self) -> Option<i32> {
        self.original_column
    }

    #[wasm_bindgen(setter = originalColumn)]
    pub fn set_original_column(&mut self, val: Option<i32>) {
        self.original_column = val;
    }

    #[wasm_bindgen(getter = source)]
    pub fn source(&self) -> Option<String> {
        self.source.clone()
    }

    #[wasm_bindgen(setter = source)]
    pub fn set_source(&mut self, val: Option<String>) {
        self.source = val
    }

    #[wasm_bindgen(getter = name)]
    pub fn name(&self) -> Option<String> {
        self.name.clone()
    }

    #[wasm_bindgen(setter = name)]
    pub fn set_name(&mut self, val: Option<String>) {
        self.name = val;
    }

    /**
     * Comparator between two mappings with inflated source and name strings where
     * the generated positions are compared.
     */
    #[wasm_bindgen(method, js_name = compareByGeneratedPositionsInflated)]
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

    /**
     * Comparator between two mappings with deflated source and name indices where
     * the generated positions are compared.
     */
    #[wasm_bindgen(js_name = compareByGeneratedPositionsDeflated)]
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
