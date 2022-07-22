use std::sync::Once;
use tauri::Window;

pub(crate) fn main_window(window: Option<Window>) -> Window {
  static mut SINGLETON: *const Window = 0 as *const Window;
  static ONCE: Once = Once::new();
  if let Some(window) = window {
    ONCE.call_once(|| unsafe {
      SINGLETON = std::mem::transmute(Box::new(window));
    });
  }
  unsafe { (*SINGLETON).clone() }
}
