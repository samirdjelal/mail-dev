import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from "react-router";
import {setFramework} from "../store/settingReducer";

class Settings extends Component {
	render() {
		return (
			<div className="h-full w-full text-lg text-gray-700 py-3 px-4 overflow-y-auto">
				<h3>Settings</h3>
				
				<div className="mb-3">
					<label for="framework" class="block text-sm font-medium text-gray-700">Framework</label>
					<select onChange={e => this.props.setFramework(e.target.value)} defaultValue={this.props.framework}
					        id="framework" name="framework" class="mt-1 block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:ring-opacity-40 sm:text-sm rounded-md">
						<option>Laravel</option>
						<option>Symfony</option>
						<option>WordPress</option>
						<option>Yii Framework</option>
						<option>Nodemailer</option>
						<option>Ruby on Rails</option>
						<option>Ruby (net/smtp)</option>
					</select>
				</div>
				
				<div className="bg-white rounded-md px-4 py-2 border">
					<h3 className="font-semibold">{this.props.framework} configuration</h3>
					<p class="py-2 text-sm text-gray-600">
						If you are using Vagrant/Homestead, use <code class="bg-gray-100 rounded text-gray-700 px-2 py-1.5 my-2 font-mono mx-1">10.0.2.2</code> as your SMTP-Host.<br/>
						For Docker, use <code class="bg-gray-100 rounded text-gray-700 px-2 py-1.5 my-2 font-mono mx-1">host.docker.internal</code> as your SMTP-Host.
					</p>
					
					{this.props.framework === 'Laravel' && <div className="whitespace-pre-wrap text-sm text-gray-600">
						<p class="py-2 text-sm text-gray-600">
							Use these configuration values in your Laravel applications .env file:
						</p>
						
						<h4 className="py-1 font-semibold">For Laravel 7+:</h4>
						<code className="font-mono mb-2 block bg-gray-900 shadow-inner rounded-md p-2 text-gray-300">
							{`MAIL_MAILER=smtp\nMAIL_HOST=${this.props.ipAddress}\nMAIL_PORT=${this.props.port}\nMAIL_USERNAME=null\nMAIL_PASSWORD=null\nMAIL_ENCRYPTION=null`}
						</code>
						
						<h4 className="py-1 font-semibold">For Laravel 6 and below:</h4>
						<code className="font-mono mb-2 block bg-gray-900 shadow-inner rounded-md p-2 text-gray-300">
							{`MAIL_DRIVER=smtp\nMAIL_HOST=${this.props.ipAddress}\nMAIL_PORT=${this.props.port}\nMAIL_USERNAME=null\nMAIL_PASSWORD=null\nMAIL_ENCRYPTION=null`}
						</code>
					</div>}
					
					{this.props.framework === 'Symfony' && <div className="whitespace-pre-wrap text-sm text-gray-600">
						<p class="py-2 text-sm text-gray-600">
							Symfony uses SwiftMailerBundle to send emails. You can find more information on how to send email on. <br/>
							To get started you need to modify .env file in your project directory and set MAILER_URL value:
						</p>
						
						<code className="font-mono mb-2 block bg-gray-900 shadow-inner rounded-md p-2 text-gray-300">
							{`MAILER_URL=smtp://${this.props.ipAddress}:${this.props.port}?encryption=null&auth_mode=null`}
						</code>
					
					
					</div>}
					
					{this.props.framework === 'WordPress' && <div className="whitespace-pre-wrap text-sm text-gray-600">
						<p class="py-2 text-sm text-gray-600">
							You can configure your WordPress site to send mails to Mail-Dev by using :
						</p>
						
						<code className="font-mono mb-2 block bg-gray-900 shadow-inner rounded-md p-2 text-gray-300">
							{`function mail_dev($phpmailer) {\n\t$phpmailer->isSMTP();\n\t$phpmailer->Host = '${this.props.ipAddress}';\n\t$phpmailer->SMTPAuth = false;\n\t$phpmailer->Port = ${this.props.port};\n}\n\nadd_action('phpmailer_init', 'mail_dev');`}
						</code>
					</div>}
					
					{this.props.framework === 'Yii Framework' && <div className="whitespace-pre-wrap text-sm text-gray-600">
						<p class="py-2 text-sm text-gray-600">
							You can find documentation for sending emails using SMTP in Yii Framework here. <br/>
							In your config file add:
						</p>
						
						<code className="font-mono mb-2 block bg-gray-900 shadow-inner rounded-md p-2 text-gray-300">
							{`'components' => [\n\t'mailer' => [\n\t\t'class' => 'yii\\swiftmailer\\Mailer',\n\t\t'enableSwiftMailerLogging' => true,\n\t\t'transport' => [\n\t\t\t'class' => 'Swift_SmtpTransport',\n\t\t\t"host" => '${this.props.ipAddress}',\n\t\t\t"port" => ${this.props.port},\n\t\t],\n\t],\n],`}
						</code>
					
					</div>}
					
					{this.props.framework === 'Nodemailer' && <div className="whitespace-pre-wrap text-sm text-gray-600">
						<p class="py-2 text-sm text-gray-600">
							Nodemailer is an easy to use module to send e-mails with Node.JS:<br/>
						</p>
						
						<code className="font-mono mb-2 block bg-gray-900 shadow-inner rounded-md p-2 text-gray-300">
							{`let transport = nodemailer.createTransport({\n\thost: "${this.props.ipAddress}",\n\tport: ${this.props.port},\n});`}
						</code>
					</div>}
					
					{this.props.framework === 'Ruby on Rails' && <div className="whitespace-pre-wrap text-sm text-gray-600">
						<p class="py-2 text-sm text-gray-600">
							In config/environments/*.rb specify ActionMailer defaults for your development or staging servers:
						</p>
						
						<code className="font-mono mb-2 block bg-gray-900 shadow-inner rounded-md p-2 text-gray-300">
							{`config.action_mailer.delivery_method = :smtp \nconfig.action_mailer.smtp_settings = {\n\t:address => '${this.props.ipAddress}',\n\t:domain => '${this.props.ipAddress}',\n\t:port => '${this.props.port}',\n}`}
						</code>

					</div>}
					
					{this.props.framework === 'Ruby (net/smtp)' && <div className="whitespace-pre-wrap text-sm text-gray-600">
						<p class="py-2 text-sm text-gray-600">
							Sending email using net/smtp from Ruby stdlib:
						</p>
						
						<code className="font-mono mb-2 block bg-gray-900 shadow-inner rounded-md p-2 text-gray-300">
							{`require 'net/smtp'\n\nmessage = <<-END.split("\n").map!(&:strip).join("\n")\nFrom: Private Person <from@${this.props.ipAddress}>\nTo: A Test User <to@${this.props.ipAddress}>\nSubject: MAIL-DEV!\n\nThis is a test e-mail message from MAIL-DEV.\nEND\n\nNet::SMTP.start('${this.props.ipAddress}',\n              ${this.props.port},\n              '${this.props.ipAddress}') do |smtp|\nsmtp.send_message message, 'from@${this.props.ipAddress}',\n                           'to@${this.props.ipAddress}'\nend`}
						</code>

						


					
					</div>}
				
				</div>
			</div>
		);
	}
	
	
}

export default withRouter(connect(
	state => ({
		framework: state.setting.framework,
		ipAddress: state.setting.ipAddress,
		port: state.setting.port,
	}),
	{
		setFramework,
	}
)(Settings));
