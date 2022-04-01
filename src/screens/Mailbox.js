import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {withRouter} from "react-router";
import {clearMails, deleteMail, setMailIndex, setSpamScore} from "../store/mailboxReducer";
import MailContent from "../components/MailContent";
import {Body, fetch} from "@tauri-apps/api/http";
import {dialog, invoke} from "@tauri-apps/api";
import {setSrvStatus} from "../store/settingReducer";
import {writeBinaryFile, writeFile} from "@tauri-apps/api/fs";

class Mailbox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tab: "HTML",
			index: 0,
		}
		this.startServer = this.startServer.bind(this);
	}
	
	render() {
		if (this.props.mails.length === 0)
			return (<div className="flex flex-col justify-center items-center h-full w-full text-lg text-gray-700">
				<div>
					<svg className="w-20 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
						<path className="opacity-40" d="M432 64H144a144 144 0 0 1 144 144v208a32 32 0 0 1-32 32h288a32 32 0 0 0 32-32V208A144 144 0 0 0 432 64zm80 208a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16v-48h-56a8 8 0 0 1-8-8v-16a8 8 0 0 1 8-8h104a16 16 0 0 1 16 16z"/>
						<path d="M143.93 64C64.2 64 0 129.65 0 209.38V416a32 32 0 0 0 32 32h224a32 32 0 0 0 32-32V208A144 144 0 0 0 143.93 64zM224 240a16 16 0 0 1-16 16H80a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h128a16 16 0 0 1 16 16zm272-48H392a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h56v48a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16z"/>
					</svg>
				</div>
				<div className="font-semibold text-gray-500 mb-2">No mail to show!</div>
				<div className="text-sm text-gray-500 mb-2">Send emails using this smtp server:</div>
				<div className="flex items-center mb-2">
					<div className="font-mono text-sm block bg-gray-900 shadow-inner rounded-md px-2 py-1 text-gray-300">{this.props.ipAddress}:{this.props.port}</div>
					<div className={`underline ml-2 cursor-pointer font-semibold hover:opacity-80 text-xs ${this.props.srvStatus === true && 'hidden'}`}
					     onClick={this.startServer}>Start Server
					</div>
					{this.props.srvStatus === true && <div>
						<svg className="ml-2 h-4 w-4 fill-current text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
							<path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"/>
						</svg>
					</div>}
				</div>
			</div>)
		
		if (this.state.tab === 'Spam Reports')
			this.getSpamScore(this.props.mail)
		
		return (
			<div className="flex h-full">
				<div className="h-full flex-shrink-0 w-64 lg:w-80 xl:w-96 border-r border-gray-300 border-opacity-70 scroll overflow-y-auto">
					<div className="py-2 px-2 items-center flex justify-end border-b border-gray-300 border-opacity-70 ">
						<button onClick={() => this.props.clearMails()} className="block ml-auto rounded-md px-2.5 py-1.5 uppercase text-xs font-semibold flex items-center gap-x-1 hover:text-red-500 ">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
							</svg>
							Delete all mails
						</button>
					</div>
					{this.props.mails.map(mail => {
						return <Fragment key={mail.key}>
							<div className={`border-b border-gray-300 border-opacity-70 flex items-center py-3 cursor-pointer select-none px-2 ${mail.key === this.props.mailIndex ? 'bg-gray-700' : 'hover:bg-gray-300 hover:bg-opacity-40'}`}
							     onClick={() => this.selectMail(mail)}>
								<div className={`h-2 w-2 flex-shrink-0 rounded-full mr-2 ${mail.seen === false ? 'bg-green-500' : (mail.key === this.props.mailIndex ? 'bg-gray-200' : 'bg-gray-400 bg-opacity-50')}`}></div>
								<div className={`w-full py-1 ${mail.seen === false ? 'text-gray-600' : (mail.key === this.props.mailIndex ? 'text-gray-100' : 'text-gray-700')}`}>
									<div className={`truncate text-sm font-medium w-44 lg:w-60 xl:w-72 ${mail.seen === false && 'font-bold'}`}>{mail.subject}</div>
									<div className="text-xs truncate">{mail.to}</div>
								</div>
								
								{mail.attachments.length > 0 && <svg className={`h-5 w-5 fill-current ${mail.key === this.props.mailIndex ? 'text-gray-100' : 'text-gray-700'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
									<path
										d="M67.508 468.467c-58.005-58.013-58.016-151.92 0-209.943l225.011-225.04c44.643-44.645 117.279-44.645 161.92 0 44.743 44.749 44.753 117.186 0 161.944l-189.465 189.49c-31.41 31.413-82.518 31.412-113.926.001-31.479-31.482-31.49-82.453 0-113.944L311.51 110.491c4.687-4.687 12.286-4.687 16.972 0l16.967 16.971c4.685 4.686 4.685 12.283 0 16.969L184.983 304.917c-12.724 12.724-12.73 33.328 0 46.058 12.696 12.697 33.356 12.699 46.054-.001l189.465-189.489c25.987-25.989 25.994-68.06.001-94.056-25.931-25.934-68.119-25.932-94.049 0l-225.01 225.039c-39.249 39.252-39.258 102.795-.001 142.057 39.285 39.29 102.885 39.287 142.162-.028A739446.174 739446.174 0 0 1 439.497 238.49c4.686-4.687 12.282-4.684 16.969.004l16.967 16.971c4.685 4.686 4.689 12.279.004 16.965a755654.128 755654.128 0 0 0-195.881 195.996c-58.034 58.092-152.004 58.093-210.048.041z"/>
								</svg>}
								<div className={`flex-shrink-0 ml-2 ${mail.key === this.props.mailIndex ? 'text-gray-100' : 'text-gray-600'}`}>
									<svg className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
										<path d="M24.707 38.101L4.908 57.899c-4.686 4.686-4.686 12.284 0 16.971L185.607 256 4.908 437.13c-4.686 4.686-4.686 12.284 0 16.971L24.707 473.9c4.686 4.686 12.284 4.686 16.971 0l209.414-209.414c4.686-4.686 4.686-12.284 0-16.971L41.678 38.101c-4.687-4.687-12.285-4.687-16.971 0z"/>
									</svg>
								</div>
							</div>
						</Fragment>
					})}
				</div>
				{this.props.mailIndex !== null ? <div className="h-full bg-gray-50 w-full px-6 py-3 scroll overflow-y-auto">
					<div className="text-xl pt-2 pb-4 text-gray-800">{this.props.mail.subject || 'Subject'}</div>
					<div className="border rounded-md bg-white whitespace-pre-wrap p-4 text-sm font-sans text-gray-600 mb-2">
						<span className="font-medium">From</span> : <span className="text-gray-500">{this.props.mail.from || ''}</span> <br/>
						<span className="font-medium">To</span> : <span className="text-gray-500">{this.props.mail.to || ''}</span> <br/>
						<span className="font-medium">Message-ID</span> : <span className="text-gray-500">{this.props.mail.message_id || ''}</span> <br/>
					</div>
					{this.props.mail.attachments.length > 0 && <div className="border rounded-md bg-white whitespace-pre-wrap p-2 mb-2 mt-4 text-sm font-sans text-gray-600">
						{this.props.mail.attachments.map((attachment, key) => {
							return <div key={key} onClick={() => this.saveAttachment(attachment)} className="py-0.5">
								<div className="flex w-full items-center cursor-pointer text-gray-500 hover:text-gray-900">
									<svg className="h-4 w-4 mr-1.5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
										<path
											d="M67.508 468.467c-58.005-58.013-58.016-151.92 0-209.943l225.011-225.04c44.643-44.645 117.279-44.645 161.92 0 44.743 44.749 44.753 117.186 0 161.944l-189.465 189.49c-31.41 31.413-82.518 31.412-113.926.001-31.479-31.482-31.49-82.453 0-113.944L311.51 110.491c4.687-4.687 12.286-4.687 16.972 0l16.967 16.971c4.685 4.686 4.685 12.283 0 16.969L184.983 304.917c-12.724 12.724-12.73 33.328 0 46.058 12.696 12.697 33.356 12.699 46.054-.001l189.465-189.489c25.987-25.989 25.994-68.06.001-94.056-25.931-25.934-68.119-25.932-94.049 0l-225.01 225.039c-39.249 39.252-39.258 102.795-.001 142.057 39.285 39.29 102.885 39.287 142.162-.028A739446.174 739446.174 0 0 1 439.497 238.49c4.686-4.687 12.282-4.684 16.969.004l16.967 16.971c4.685 4.686 4.689 12.279.004 16.965a755654.128 755654.128 0 0 0-195.881 195.996c-58.034 58.092-152.004 58.093-210.048.041z"/>
									</svg>
									<div>{attachment[0]}</div>
								</div>
							</div>
						})}
					</div>}
					<div className="flex items-center pb-2 pt-2">
						{(this.props.mail.html === "" ? ["Text", "Raw", "Headers", "Spam Reports"] : ["HTML", "HTML-Source", "Text", "Raw", "Headers", "Spam Reports"]).map(item => {
							return <div key={item} className={`flex justify-center py-1 mr-0.5 px-2 text-sm cursor-pointer select-none whitespace-nowrap ${this.state.tab === item ? 'bg-gray-600 rounded-md text-white' : ''}`} onClick={e => this.setState({tab: item})}>
								{(item === "Spam Reports" && this.props.mail.spam_score !== "") ? <Fragment>{item}
									<div className={`ml-1 rounded text-xs px-2 flex justify-center items-center font-semibold ${this.state.tab === item ? 'bg-white text-gray-500' : 'bg-gray-500 text-white'}`}>{this.props.mail.spam_score}</div>
								</Fragment> : item}
							</div>
						})}
						<button onClick={() => this.props.deleteMail(this.props.mail.key)} className="block ml-auto rounded-md px-2.5 py-1.5 uppercase text-xs font-semibold flex items-center gap-x-1 hover:text-red-500">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
							</svg>
							Delete
						</button>
					
					</div>
					<div className={`bg-white rounded-md border `}>
						<MailContent tab={this.state.tab} mail={this.props.mail}/>
					</div>
				</div> : <div className="h-full bg-gray-50 w-full px-2 pb-3 scroll overflow-y-auto flex flex-col justify-center items-center w-full text-lg text-gray-700">
					<div>
						<svg className="w-20 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
							<path className="opacity-40" d="M432 64H144a144 144 0 0 1 144 144v208a32 32 0 0 1-32 32h288a32 32 0 0 0 32-32V208A144 144 0 0 0 432 64zm80 208a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16v-48h-56a8 8 0 0 1-8-8v-16a8 8 0 0 1 8-8h104a16 16 0 0 1 16 16z"/>
							<path d="M143.93 64C64.2 64 0 129.65 0 209.38V416a32 32 0 0 0 32 32h224a32 32 0 0 0 32-32V208A144 144 0 0 0 143.93 64zM224 240a16 16 0 0 1-16 16H80a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h128a16 16 0 0 1 16 16zm272-48H392a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h56v48a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16z"/>
						</svg>
					</div>
					<div className="font-semibold text-gray-500">Select a mail!</div>
				</div>}
			
			</div>
		);
	}
	
	startServer() {
		invoke("start_smtp_server", {address: `${this.props.ipAddress}:${this.props.port}`}).then().catch()
		this.props.setSrvStatus(true)
	}
	
	selectMail(mail) {
		this.props.setMailIndex(mail.key)
		this.setState({tab: mail.html === "" ? 'Text' : 'HTML'});
	}
	
	getSpamScore(mail) {
		if (mail.spam_score === "") {
			fetch("https://spamcheck.postmarkapp.com/filter", {
				method: "POST",
				responseType: 1,
				mode: 'no-cors',
				body: Body.json({email: mail.mime.toString(), options: "long"}),
				headers: {"Accept": "application/json", "Content-Type": "application/json"}
			}).then(res => {
				console.log(res)
				this.props.setSpamScore({
					key: mail.key,
					spam_score: res.data.score,
					spam_rules: res.data.rules,
				});
			}).catch(err => console.log(err))
		}
	}
	
	async saveAttachment(attachment) {
		let path = await dialog.save({
			defaultPath: attachment[0],
			filters: [{name: 'Save Attachment.', extensions: []}]
		});
		
		if (path !== null) {
			if (attachment[2] === null) {
				await writeBinaryFile({path, contents: attachment[3]});
			} else {
				await writeFile({path, contents: attachment[2]});
			}
		}
	}
	
	
}

export default withRouter(connect(
	state => ({
		srvStatus: state.setting.srvStatus,
		ipAddress: state.setting.ipAddress,
		port: state.setting.port,
		mails: state.mailbox.mails,
		mailIndex: state.mailbox.mailIndex,
		mail: state.mailbox.mail,
	}),
	{
		setSrvStatus,
		clearMails,
		setMailIndex,
		setSpamScore,
		deleteMail,
		
	}
)(Mailbox));
