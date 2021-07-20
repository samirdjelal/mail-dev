import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {withRouter} from "react-router";
import {clearMails, deleteMail, setMailIndex, setSpamScore} from "../store/mailboxReducer";
import MailContent from "../components/MailContent";
import {Body, fetch} from "@tauri-apps/api/http";

class Mailbox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tab: "HTML",
			index: 0,
		}
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
				<div className="font-mono text-sm mb-2 block bg-gray-900 shadow-inner rounded-md px-2 py-1 text-gray-300">
					{this.props.ipAddress}:{this.props.port}
				</div>
			</div>)
		
		return (
			<div className="flex h-full">
				<div className="h-full flex-shrink-0 w-52 lg:w-80 xl:w-96 border-r border-gray-300 border-opacity-70">
					<div className="py-2 px-2 items-center flex justify-end border-b border-gray-300 border-opacity-70 ">
						<button onClick={() => this.props.clearMails()} className="text-gray-500 hover:text-red-500 rounded-md px-1.5 py-0.5 uppercase text-xs font-semibold">Delete all mails</button>
					</div>
					{this.props.mails.map(mail => {
						return <Fragment key={mail.key}>
							<div className={`border-b border-gray-300 border-opacity-70 flex items-center py-2 hover:bg-gray-300 hover:bg-opacity-40 cursor-pointer select-none px-2 ${mail.key === this.props.mailIndex ? 'bg-gray-300 bg-opacity-50' : ''}`}
							     onClick={() => this.selectMail(mail)}>
								<div className={`h-2 w-2 flex-shrink-0 rounded-full mr-2 ${mail.seen === false ? 'bg-green-500' : 'bg-gray-400 bg-opacity-50'}`}></div>
								<div className="w-full py-1">
									<div className="flex items-center">
										<div className={`truncate text-xs text-gray-600 ${mail.seen === false && 'font-semibold'}`}>{mail.subject}</div>
									</div>
									<div className="text-xs text-gray-500">{mail.to}</div>
								</div>
								<div className="flex-shrink-0 ml-2">
									<svg className="w-3 h-3 fill-current text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
										<path d="M24.707 38.101L4.908 57.899c-4.686 4.686-4.686 12.284 0 16.971L185.607 256 4.908 437.13c-4.686 4.686-4.686 12.284 0 16.971L24.707 473.9c4.686 4.686 12.284 4.686 16.971 0l209.414-209.414c4.686-4.686 4.686-12.284 0-16.971L41.678 38.101c-4.687-4.687-12.285-4.687-16.971 0z"/>
									</svg>
								</div>
							</div>
						</Fragment>
					})}
				</div>
				{this.props.mailIndex !== null ? <div className="h-full bg-gray-50 w-full px-2 pb-3 overflow-y-auto">
					<div className="text-xl py-2 text-gray-800">{this.props.mail.subject || 'Subject'}</div>
					<div className="border rounded-md bg-white whitespace-pre-wrap p-2 text-sm font-sans text-gray-600">
						From : {this.props.mail.from || 'from'} <br/>
						To : {this.props.mail.to || 'to'} <br/>
						Message-ID : {this.props.mail.message_id || 'message_id'} <br/>
					</div>
					<div className="flex items-center py-2">
						{(this.props.mail.html === "" ? ["Text", "Raw", "Headers", "Spam Reports"] : ["HTML", "HTML-Source", "Text", "Raw", "Headers", "Spam Reports"]).map(item => {
							return <div key={item} className={`flex justify-center py-1 mr-0.5 px-2 text-sm cursor-pointer select-none whitespace-nowrap ${this.state.tab === item ? 'bg-gray-600 rounded-full text-white' : ''}`} onClick={e => this.setState({tab: item})}>
								{(item === "Spam Reports" && this.props.mail.spam_score !== "") ? <Fragment>{item}
									<div className={`ml-1 rounded-full text-xs px-2 flex justify-center items-center font-semibold ${this.state.tab === item ? 'bg-white text-gray-500' : 'bg-gray-500 text-white'}`}>{this.props.mail.spam_score}</div>
								</Fragment> : item}
							</div>
						})}
						<button onClick={() => this.props.deleteMail(this.props.mail.key)}
						        className="block ml-auto bg-red-400 text-white hover:bg-red-500 hover:text-white rounded-md px-2.5 py-1.5 uppercase text-xs font-semibold">Delete
						</button>
					</div>
					<div className={`bg-white rounded-md border `}>
						<MailContent tab={this.state.tab} mail={this.props.mail}/>
					</div>
				</div> : <div className="h-full bg-gray-50 w-full px-2 pb-3 overflow-y-auto flex flex-col justify-center items-center w-full text-lg text-gray-700">
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
	
	
	selectMail(mail) {
		this.props.setMailIndex(mail.key)
		this.setState({tab: mail.html === "" ? 'Text' : 'HTML'});
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
}

export default withRouter(connect(
	state => ({
		ipAddress: state.setting.ipAddress,
		port: state.setting.port,
		mails: state.mailbox.mails,
		mailIndex: state.mailbox.mailIndex,
		mail: state.mailbox.mail,
	}),
	{
		clearMails,
		setMailIndex,
		setSpamScore,
		deleteMail,
		
	}
)(Mailbox));
