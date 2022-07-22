use lettre::message::Mailbox;
use lettre::transport::smtp::authentication::Credentials;
use lettre::transport::smtp::client::{Tls, TlsParametersBuilder};
use lettre::{Address, Message, SmtpTransport, Transport};

#[tauri::command]
pub async fn forward_mail(
  host: Option<String>,
  port: Option<String>,
  username: Option<String>,
  password: Option<String>,
  email_content: Option<String>,
  email_to: Option<String>,
  email_subject: Option<String>,
) {
  let host = host.unwrap_or_else(|| "127.0.0.1".to_string());
  let port = port
    .unwrap_or_else(|| "25".to_string())
    .parse::<u16>()
    .unwrap();
  let mut username = username.unwrap_or_else(|| "".to_string());
  let password = password.unwrap_or_else(|| "".to_string());
  let email_content = email_content.unwrap_or_else(|| "".to_string());
  let mut email_to = email_to.unwrap_or_else(|| "email@example.com".to_string());
  let email_subject = email_subject.unwrap_or_else(|| "".to_string());

  if username.is_empty() {
    username = "samir@mail-dev.com".to_string();
  }
  if email_to.is_empty() {
    email_to = "email@example.com".to_string();
  }

  let email = Message::builder()
    .from(Mailbox {
      name: Some("Mail-Dev".to_string()),
      email: username.parse::<Address>().unwrap(),
    })
    .to(email_to.parse().unwrap())
    .subject(email_subject)
    .body(email_content)
    .unwrap();

  let tls_parameters = TlsParametersBuilder::new(host.clone())
    .dangerous_accept_invalid_hostnames(true)
    .dangerous_accept_invalid_certs(true)
    .build()
    .unwrap();

  let security = vec![
    Tls::Opportunistic(tls_parameters.clone()),
    Tls::Wrapper(tls_parameters.clone()),
    Tls::Required(tls_parameters),
    Tls::None,
  ];

  for tls in security {
    let mailer = SmtpTransport::builder_dangerous(host.clone())
      .credentials(Credentials::new(username.clone(), password.clone()))
      .port(port)
      .tls(tls)
      .build();
    match mailer.send(&email) {
      Ok(_) => {
        println!("Email sent successfully!");
        break;
      }
      Err(e) => {
        println!("Could not send email: {:?}", e);
        continue;
      }
    }
  }
}
