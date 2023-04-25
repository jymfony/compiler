extern crate alloc;

use js_sys::{Array, Function};
use wasm_bindgen::prelude::*;

pub mod sourcemap;
pub mod lexer;

#[wasm_bindgen(typescript_custom_section)]
const AST_IMPORT: &'static str = r#"
import { AST } from "@jymfony/compiler";
"#;

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

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Error")]
    pub type Error;

    #[wasm_bindgen(method, getter)]
    pub fn name(this: &Error) -> String;

    #[wasm_bindgen(method, getter)]
    pub fn message(this: &Error) -> JsValue;

    #[wasm_bindgen(method, getter)]
    pub fn stack(this: &Error) -> Option<String>;

    #[wasm_bindgen(static_method_of = Error, getter = prepareStackTrace)]
    pub fn prepare_stack_trace() -> Option<Function>;
    #[wasm_bindgen(static_method_of = Error, setter = prepareStackTrace)]
    pub fn set_prepare_stack_trace(closure: &Function);

    #[wasm_bindgen(method, js_name = toString)]
    pub fn to_string(this: &Error) -> String;
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "NodeJS.CallSite")]
    pub type CallSite;

    /// Value of "this"
    #[wasm_bindgen(method, js_name = getThis)]
    pub fn get_this(this: &CallSite) -> JsValue;

    /// Type of "this" as a string.
    /// This is the name of the function stored in the constructor field of
    /// "this", if available.  Otherwise the object's [[Class]] internal
    /// property.
    #[wasm_bindgen(method, js_name = getTypeName)]
    pub fn get_type_name(this: &CallSite) -> Option<String>;

    /// Current function
    #[wasm_bindgen(method, js_name = getFunction)]
    pub fn get_function(this: &CallSite) -> Option<Function>;

    /// Name of the current function, typically its name property.
    /// If a name property is not available an attempt will be made to try
    /// to infer a name from the function's context.
    #[wasm_bindgen(method, js_name = getFunctionName)]
    pub fn get_function_name(this: &CallSite) -> Option<String>;

    /// Name of the property [of "this" or one of its prototypes] that holds
    /// the current function
    #[wasm_bindgen(method, js_name = getMethodName)]
    pub fn get_method_name(this: &CallSite) -> Option<String>;

    /// Name of the script [if this function was defined in a script]
    #[wasm_bindgen(method, js_name = getFileName)]
    pub fn get_file_name(this: &CallSite) -> Option<String>;

    /// Current line number [if this function was defined in a script]
    #[wasm_bindgen(method, js_name = getLineNumber)]
    pub fn get_line_number(this: &CallSite) -> Option<i32>;

    /// Current column number [if this function was defined in a script]
    #[wasm_bindgen(method, js_name = getColumnNumber)]
    pub fn get_column_number(this: &CallSite) -> Option<i32>;

    /// A call site object representing the location where eval was called
    /// [if this function was created using a call to eval]
    #[wasm_bindgen(method, js_name = getEvalOrigin)]
    pub fn get_eval_origin(this: &CallSite) -> Option<String>;

    /// Is this a toplevel invocation, that is, is "this" the global object?
    #[wasm_bindgen(method, js_name = isToplevel)]
    pub fn is_top_level(this: &CallSite) -> bool;

    /// Does this call take place in code defined by a call to eval?
    #[wasm_bindgen(method, js_name = isEval)]
    pub fn is_eval(this: &CallSite) -> bool;

    /// Is this call in native V8 code?
    #[wasm_bindgen(method, js_name = isNative)]
    pub fn is_native(this: &CallSite) -> bool;

    /// Is this a constructor call?
    #[wasm_bindgen(method, js_name = isConstructor)]
    pub fn is_constructor(this: &CallSite) -> bool;

    /// Is this an async call (i.e. await, Promise.all(), or Promise.any())?
    #[wasm_bindgen(method, js_name = isAsync)]
    pub fn is_async(this: &CallSite) -> bool;

    /// Is this an async call to Promise.all()?
    #[wasm_bindgen(method, js_name = isPromiseAll)]
    pub fn is_promise_all(this: &CallSite) -> bool;

    /// Is this an async call to Promise.any()?
    #[wasm_bindgen(method, js_name = isPromiseAny)]
    pub fn is_promise_any(this: &CallSite) -> bool;

    /// Returns the index of the promise element that was followed in
    /// Promise.all() or Promise.any() for async stack traces, or null if the
    /// CallSite is not an async Promise.all() or Promise.any() call.
    #[wasm_bindgen(method, js_name = getPromiseIndex)]
    pub fn get_promise_index(this: &CallSite) -> Option<usize>;

    #[wasm_bindgen(method, js_name = toString)]
    pub fn to_string(this: &CallSite) -> String;
}

#[wasm_bindgen(raw_module = "../../src/AST")]
extern "C" {
    #[wasm_bindgen(typescript_type = "AST.Position")]
    pub type Position;

    #[wasm_bindgen(constructor)]
    pub fn new(line: i32, column: i32) -> Position;

    #[wasm_bindgen(method, getter)]
    pub fn column(this: &Position) -> i32;

    #[wasm_bindgen(method, getter)]
    pub fn line(this: &Position) -> i32;
}

#[wasm_bindgen(start)]
pub fn main() {
    let previous: Option<Function> = Error::prepare_stack_trace();

    let a = Closure::<dyn Fn(Error, Box<[CallSite]>) -> String>::new(
        move |error: Error, stack: Box<[CallSite]>| -> String {
            let prev = if let Some(func) = &previous {
                let this = &JsValue::null();
                let e = JsValue::from(&error);
                let s = Array::from_iter(stack.iter());

                if let Some(val) = func.call2(&this, &e, &s).ok() {
                    val.as_string()
                } else {
                    None
                }
            } else {
                None
            };

            sourcemap::stack_handler::prepare_stack_trace(error, stack, prev)
        },
    );

    Error::set_prepare_stack_trace(a.as_ref().unchecked_ref());
    a.forget();
}
