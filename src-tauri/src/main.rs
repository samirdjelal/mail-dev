#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod forward;
mod smtp;
mod window;

use forward::forward_mail;
use smtp::start_smtp_server;
use tauri::Manager;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let _s = window::main_window(Some(app.get_window("main").unwrap()));
      // app.manage(MainWindow(Arc::new(Mutex::new(
      // 	app.get_window("main").unwrap(),
      // ))));
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![start_smtp_server, forward_mail])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
