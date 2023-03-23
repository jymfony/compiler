extern crate alloc;

use js_sys::Array;
use wasm_bindgen::prelude::*;

pub mod base64;
mod base64_vlq;
mod generator;
pub mod mapping;
pub mod parser;

#[wasm_bindgen]
extern "C" {
    pub type BTree;

    #[wasm_bindgen(constructor)]
    pub fn new(compare_fn: JsValue) -> BTree;

    #[wasm_bindgen(method)]
    pub fn search(this: &BTree, key: &JsValue, comparison: Option<u32>) -> Option<Array>;

    #[wasm_bindgen(method)]
    pub fn push(this: &BTree, key: JsValue, value: JsValue);
}

#[wasm_bindgen(raw_module = "../../src/AST")]
extern "C" {
    pub type Position;

    #[wasm_bindgen(constructor)]
    pub fn new(line: i32, column: i32) -> Position;

    #[wasm_bindgen(method, getter)]
    pub fn column(this: &Position) -> i32;

    #[wasm_bindgen(method, getter)]
    pub fn line(this: &Position) -> i32;
}
