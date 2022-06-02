use mailin_embedded::{Server, SslConfig, Handler, Response};
use mailin_embedded::response::{OK};
use mailparse::*;
use crate::window;
use tauri::Manager;
use mailparse::body::Body;

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
	attachments: Vec<(String, String, Option<String>, Option<Vec<u8>>)>,
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

// Start the SMTP server
// bind to custom port, fallback to 25.
#[tauri::command]
pub async fn start_smtp_server(address: Option<String>) -> String {
	let address = address.unwrap_or_else(|| "127.0.0.1:25".into());
	let handler = MyHandler::new();
	let mut server = Server::new(handler);
	server.with_name("localhost")
		.with_ssl(SslConfig::None).unwrap()
		.with_addr(address).unwrap();
	match server.serve() {
		Ok(_) => {
			"".to_string()
		}
		Err(error) => {
			format!("{}", error)
		}
	}
}

// Parse the mail content and send it to the webview
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
		attachments: vec![],
	};
	
	let parsed = parse_mail(mime.as_ref()).unwrap();
	// println!("{:?}", parsed);
	
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
		match x.get_content_disposition().disposition {
			DispositionType::Inline => {
				if x.ctype.mimetype == "text/plain" {
					payload.text = x.get_body().unwrap();
				} else if x.ctype.mimetype == "text/html" {
					payload.html = x.get_body().unwrap();
				} else {
					payload.html = x.get_body().unwrap();
				}
			}
			// DispositionType::FormData => {
			//
			// }
			// DispositionType::Extension(ext) => {
			//
			// }
			DispositionType::Attachment => {
				let filename = x.get_content_disposition().params.get("filename").unwrap().to_owned();
				
				let mut content_type: String = String::new();
				for header in x.get_headers() {
					if header.get_key() == "Content-Type" {
						content_type = header.get_value()
					}
				}
				
				match x.get_body_encoded() {
					Body::Base64(body) => {
						let binary = body.get_decoded().unwrap();
						payload.attachments.push((filename, content_type, None, Some(binary)));
					}
					_ => {
						let text = x.get_body().unwrap();
						payload.attachments.push((filename, content_type, Some(text), None));
					}
				};
			}
			_ => {}
		}
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