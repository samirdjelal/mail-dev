use mailin_embedded::{Server, SslConfig, Handler, Response};
use mailin_embedded::response::{OK};
use mailparse::parse_mail;
use mailparse::*;
use crate::window;
use tauri::Manager;

#[derive(Clone, serde::Serialize, Debug)]
struct Payload {
	mime: String,
	headers: Vec<(String, String)>,
	text: String,
	html: String,
	from: String,
	to: String,
	message_id: String,
	subject: String,
	x_priority: String,
}

#[derive(Clone, Debug)]
struct MyHandler {
	mime: Vec<String>,
}

impl MyHandler {
	pub fn new() -> MyHandler {
		MyHandler {
			mime: vec![]
		}
	}
}

impl Handler for MyHandler {
	fn data(&mut self, buf: &[u8]) -> std::io::Result<()> {
		self.mime.push(String::from_utf8(Vec::from(buf)).unwrap());
		Ok(())
	}

	fn data_end(&mut self) -> Response {
		let mime = self.mime.join("");
		self::parse(mime.clone());
		OK
	}
}

#[tauri::command]
pub async fn start_smtp_server() {
	println!("Smtp server running: 127.0.0.1:2525");
	let handler = MyHandler::new();
	let mut server = Server::new(handler);
	server.with_name("localhost")
		.with_ssl(SslConfig::None).unwrap()
		.with_addr("127.0.0.1:2525").unwrap();
	match server.serve() {
		Ok(_) => {}
		Err(error) => println!("Error: {:?}", error)
	}
}

pub fn parse(mime: String) {
	let mut payload = Payload {
		mime: mime.clone(),
		headers: vec![],
		subject: "".to_string(),
		from: "".to_string(),
		to: "".to_string(),
		message_id: "".to_string(),
		x_priority: "".to_string(),
		text: "".to_string(),
		html: "".to_string(),
	};

	let parsed = parse_mail(mime.as_ref()).unwrap();
	// println!("parsed: {:?}", parsed);
	for header in parsed.headers.iter() {
		payload.headers.push((header.get_key(), header.get_value()));
		match header.get_key().as_str() {
			"Subject" => payload.subject = header.get_value(),
			"From" => payload.from = header.get_value(),
			"To" => payload.to = header.get_value(),
			"Message-ID" => payload.message_id = header.get_value(),
			"X-Priority" => payload.x_priority = header.get_value(),
			_ => {}
		}
	}

	let mut add_body_part = |x: ParsedMail| {
		if x.ctype.mimetype == "text/plain" {
			payload.text = x.get_body().unwrap();
		} else if x.ctype.mimetype == "text/html" {
			payload.html = x.get_body().unwrap();
		}
		payload.html = x.get_body().unwrap()
	};

	if parsed.subparts.len() == 0 {
		add_body_part(parsed);
	} else {
		for subpart in parsed.subparts.into_iter() {
			if subpart.subparts.len() == 0 {
				add_body_part(subpart);
			} else {
				for subpart in subpart.subparts.into_iter() {
					add_body_part(subpart);
				}
			}
		}
	}


	let win = window::main_window(None);
	let _ = win.emit_all("mail-received", payload);
}