use mailin_embedded::{Server, SslConfig, Handler, Response};
use mailin_embedded::response::{OK};
use mailparse::*;
use crate::window;
use tauri::Manager;

#[derive(Clone, serde::Serialize, Debug)]
struct Payload {
	message: String,
	headers: Vec<(String, String)>,
}

#[derive(Clone, Debug)]
struct MyHandler {
	buffer: Vec<String>,
}

impl Handler for MyHandler {
	fn data(&mut self, buf: &[u8]) -> std::io::Result<()> {
		self.buffer.push(String::from_utf8(Vec::from(buf)).unwrap());
		Ok(())
	}
	
	fn data_end(&mut self) -> Response {
		let buffer = self.buffer.join("");
		self::parse(buffer.clone());
		OK
	}
}

#[tauri::command]
pub async fn start_smtp_server() {
	println!("Starting smtp server");
	let handler = MyHandler { buffer: vec![] };
	let mut server = Server::new(handler);
	server.with_name("localhost")
		.with_ssl(SslConfig::None).unwrap()
		.with_addr("127.0.0.1:25").unwrap();
	match server.serve() {
		Ok(_) => {}
		Err(error) => println!("Error: {:?}", error)
	}
}

pub fn parse(buffer: String) {
	let mut payload = Payload {
		message: "".into(),
		headers: vec![],
	};
	
	let parsed = parse_mail(buffer.as_ref()).unwrap();
	// println!("parsed: {:?}", parsed);
	for header in parsed.headers.iter() {
		payload.headers.push((header.get_key(), header.get_value()))
	}
	
	for subpart in parsed.subparts.into_iter() {
		println!("subparts: {:?}", subpart);
	}
	
	// println!("Subject: {:?}", parsed.headers.get_first_value("Subject"));
	// println!("Subparts: {:?}", parsed.subparts.len());
	
	payload.message = String::from(buffer);
	// println!("payload: {:?}", payload);
	let win = window::main_window(None);
	let _ = win.emit_all("mail-received", payload);
	
	
	// println!("Subparts: {:?}", parsed.subparts.len());
	// println!("Subparts 0 get_body: {:?}", parsed.subparts[0].get_body().unwrap());
	// println!("Subparts 1 headers: {:?}", parsed.subparts[1].headers[1].get_value());
	// println!("Subparts 1 ctype mimetype: {:?}", parsed.subparts[1].ctype.mimetype);
	// println!("Subparts 1 get_body: {:?}", parsed.subparts[1].get_body().unwrap());
	// println!("Date: {:?}", dateparse(parsed.headers.get_first_value("Date").unwrap().as_str()).unwrap());
}