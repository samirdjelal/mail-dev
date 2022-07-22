use std::sync::Once;
use tauri::Window;

pub(crate) fn main_window(window: Option<Window>) -> Window {
  static mut SINGLETON: *const Window = 0 as *const Window;
  static ONCE: Once = Once::new();
  if window.is_some() {
    ONCE.call_once(|| {
      let main_window = window.unwrap();
      unsafe {
        SINGLETON = std::mem::transmute(Box::new(main_window));
      }
    });
  }
  unsafe { (*SINGLETON).clone() }
}
