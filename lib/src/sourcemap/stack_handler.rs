use crate::sourcemap::mapping::Mapping;
use crate::sourcemap::parser::parse_mappings;
use crate::{CallSite, Error, Position};
use js_sys::{Array, JsString};
use lazy_static::lazy_static;
use std::cmp::Ordering;
use std::collections::{BTreeSet, HashMap};
use std::sync::RwLock;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

#[derive(Debug)]
struct SortableMapping(Mapping);

impl Eq for SortableMapping {}

impl PartialEq<Self> for SortableMapping {
    fn eq(&self, other: &Self) -> bool {
        self.cmp(other) == Ordering::Equal
    }
}

impl PartialOrd<Self> for SortableMapping {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for SortableMapping {
    fn cmp(&self, other: &Self) -> Ordering {
        Mapping::compare_by_generated_positions_deflated(&self.0, &other.0).cmp(&0)
    }
}

lazy_static! {
    static ref FILE_MAPPINGS: RwLock<HashMap<String, BTreeSet<SortableMapping>>> =
        RwLock::new(HashMap::new());
}

fn do_prepare_stack_trace(
    error: Error,
    stack: Box<[CallSite]>,
    previous: Option<String>,
) -> Result<String, JsValue> {
    let mut processed = false;
    let mappings = FILE_MAPPINGS.read().unwrap();
    let new_stack = stack
        .iter()
        .map(|frame: &CallSite| {
            let file_name = frame.get_file_name().unwrap_or_default();
            if frame.is_native() || mappings.get(&file_name).is_none() {
                return frame.to_string();
            }

            let upper = SortableMapping(Mapping::new(
                Position::new(
                    frame.get_line_number().unwrap_or_default(),
                    frame.get_column_number().unwrap_or_default(),
                ),
                None,
                None,
                None,
            ));
            let file_mapping = mappings.get(&file_name).unwrap();

            let mapping = file_mapping.range(..=upper).last();
            if mapping.is_none() {
                return frame.to_string();
            }

            let mapping = mapping.unwrap();
            let file_location = file_name
                + &(if let Some(ol) = mapping.0.original_line {
                    format!(":{}:{}", ol, mapping.0.original_column.unwrap_or_default())
                } else {
                    "".to_string()
                });

            let mut function_name = frame.get_function_name();
            if let Some(fun) = &function_name {
                if fun.starts_with("_anonymous_xΞ") {
                    function_name = None;
                }
            }

            let method_name = frame.get_method_name();
            let type_name = frame.get_type_name();
            let is_top_level = frame.is_top_level();
            let is_constructor = frame.is_constructor();
            let is_method_call = !(is_top_level || is_constructor);

            let generate_function_call = || {
                let mut call = "".to_string();

                if is_method_call {
                    if let Some(function_name) = &function_name {
                        if let Some(type_name) = &type_name {
                            if !function_name.starts_with(type_name) {
                                call += type_name;
                                call += ".";
                            }
                        }

                        call += function_name;

                        if let Some(method_name) = &method_name {
                            if !function_name.ends_with(method_name) {
                                call += " [as ";
                                call += method_name;
                                call += "]";
                            }
                        }
                    } else {
                        if let Some(type_name) = &type_name {
                            call += type_name;
                            call += ".";
                        }

                        call += &method_name.unwrap_or("<anonymous>".to_string());
                    }
                } else if is_constructor {
                    call += "new ";
                    call += &function_name.unwrap_or("<anonymous>".to_string());
                } else if let Some(function_name) = &function_name {
                    call += function_name;
                } else {
                    call += &file_location;
                    return call;
                }

                call += " (";
                call += &file_location;
                call += ")";

                call
            };

            processed = true;
            format!(
                "{}{}{}",
                if frame.is_async() { "async " } else { "" },
                if frame.is_promise_all() {
                    format!(
                        "Promise.all (index {})",
                        frame.get_promise_index().unwrap_or_default()
                    )
                } else {
                    "".to_string()
                },
                generate_function_call()
            )
        })
        .collect::<Vec<_>>();

    if previous.is_some() && !processed {
        Ok(previous.unwrap())
    } else {
        let message: JsValue = error.message();
        let message = message
            .dyn_ref::<JsString>()
            .cloned()
            .unwrap_or_else(|| JsString::from(""));
        Ok(String::from(message) + "\n\n    at " + &new_stack.join("\n    at "))
    }
}

/// Prepares stack trace using V8 stack trace API.
#[wasm_bindgen(js_name = prepareStackTrace)]
pub fn prepare_stack_trace(
    error: Error,
    stack: Box<[CallSite]>,
    previous: Option<String>,
) -> String {
    do_prepare_stack_trace(error, stack, previous.clone()).unwrap_or_else(|_| {
        if let Some(previous) = previous {
            previous
        } else {
            "Internal Error".to_string()
        }
    })
}

/// Registers a source map.
#[wasm_bindgen(js_name = registerSourceMap)]
pub fn register_source_map(filename: String, mappings: JsValue) -> Result<(), JsValue> {
    let mut tree = BTreeSet::new();
    if mappings.is_string() {
        let mappings = mappings.as_string().unwrap();
        let parsed_mappings = parse_mappings(&mappings)?;

        let iterator = js_sys::try_iter(&parsed_mappings)
            .unwrap()
            .ok_or("Unexpected")?;
        for value in iterator {
            let value = value?;
            let mapping = Mapping::try_from(&value)?;
            tree.insert(SortableMapping(mapping));
        }
    } else if mappings.is_array() {
        let mappings = mappings.dyn_into::<Array>()?;
        mappings.for_each(&mut |js_value, _, _| {
            let mapping = Mapping::try_from(&js_value).unwrap();
            tree.insert(SortableMapping(mapping));
        });
    }

    let mut mappings = FILE_MAPPINGS.write().unwrap();
    mappings.insert(filename, tree);

    Ok(())
}
