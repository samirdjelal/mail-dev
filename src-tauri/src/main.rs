#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

mod smtp;
mod window;
mod forward;

use smtp::start_smtp_server;
use forward::forward_mail;
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
