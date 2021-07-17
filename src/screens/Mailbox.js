import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from "react-router";
import {addMail, clearMails} from "../store/mailboxReducer";

class Mailbox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tab: "HTML"
		}
	}
	
	render() {
		return (
			<div className="flex h-full">
				<div className="h-full flex-shrink-0 w-52 lg:w-80 xl:w-96">
					{this.props.mails.map(mail => {
						return <div key={mail.subject}>{mail.subject}</div>
					})}
				</div>
				<div className="h-full bg-gray-100 w-full px-2 overflow-y-auto">
					<div className="text-xl">{this.props.mails.length > 0 ? this.props.mails[0].subject : ''}</div>
					<div className="text-sm">
						From : ddasdasd <br/>
						To : ddasdasd <br/>
						Message-ID : ddasdasd <br/>
					</div>
					<div className="flex border-t pt-1.5 mt-1 mb-2">
						{["HTML", "HTML-Source", "Text", "Raw", "Headers", "Links", "Spam Reports", "Testing"].map(item => {
							return <div key={item} className={`py-1 mr-0.5 px-2 text-sm cursor-pointer select-none whitespace-nowrap ${this.state.tab === item ? 'bg-gray-700 rounded-full text-white' : ''}`} onClick={e => this.setState({tab: item})}>{item}</div>
						})}
					</div>
					<div className="h-96 bg-white rounded-md overflow-hidden" style={{height: 1000}}>content here</div>
				</div>
			
			
			</div>
		);
	}
}

export default withRouter(connect(
	state => ({
		mails: state.mailbox.mails
	}),
	{
		clearMails,
		addMail,
	}
)(Mailbox));
