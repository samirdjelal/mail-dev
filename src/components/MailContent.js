import React, {Component} from 'react';
import {withRouter} from "react-router";
import {connect} from 'react-redux';

class MailContent extends Component {
	render() {
		if (this.props.tab === "Raw")
			return (<div className="whitespace-pre-line p-2 text-sm font-sans text-gray-600">{this.props.mail.mime}</div>);
		
		if (this.props.tab === "Text")
			return (<div className="whitespace-pre-line p-2 text-sm font-sans text-gray-600">{this.props.mail.text}</div>);
		
		if (this.props.tab === "Headers")
			return (<div className="whitespace-pre-line p-2 text-sm font-sans text-gray-600">{this.props.mail.headers.map((header, key) => {
				return <div key={key}><span className="font-semibold">{header[0]}</span>: {header[1]}</div>
			})}</div>);
		
		if (this.props.tab === "HTML")
			return (
				<div className="h-full w-full overflow-y-auto scroll">
					<iframe id="previewIframe" title="Letter preview" src={this.mailToBlob(this.props.mail.html)} scrolling="no" frameBorder="0" className="w-full h-full scroll"></iframe>
				</div>);
		
		if (this.props.tab === "HTML-Source")
			return (<div className="whitespace-pre-line p-2 text-sm font-sans text-gray-600">{this.props.mail.html}</div>);
		
		if (this.props.tab === "Spam Reports") {
			if (this.props.mail.spam_score === "") return (<div className="p-2 text-sm font-sans text-gray-600">Loading...</div>)
			return (<div className="p-2 text-sm font-sans text-gray-600">
				<h1 className="dark:text-white font-light text-lg mb-1">Your SpamAssassin score is {this.props.mail.spam_score}! </h1>
				<p className="mb-3 font-light text-sm mb-1 text-coolGray-700 dark:text-warmGray-300">The lower your score, the more likely your email is going to be received in your subscribers' inboxes.</p>
				<div className="h-100 overflow-y-auto scroll border-t-2 border-dashed border-coolGray-300 dark:border-warmGray-700 pt-2">
					<table className="w-full border-collapse text-coolGray-700 dark:text-warmGray-200">
						<thead>
							<tr className="text-coolGray-600 dark:text-warmGray-400 text-2xs">
								<th className="uppercase text-xs font-semibold text-left pr-4 w-16">Score</th>
								<th className="uppercase text-xs font-semibold text-left">Description</th>
							</tr>
						</thead>
						<tbody>
							{this.props.mail.spam_rules.map((rule, index) => {
								return <tr key={index} className="bg-coolGray-200 dark:bg-warmGray-800 even:bg-opacity-40 odd:bg-opacity-20">
									<td className="py-2 text-sm text-coolGray-900 dark:text-warmGray-50 font-mono text-right pr-4 font-semibold">{rule.score}</td>
									<td className="py-2 text-sm text-coolGray-500 dark:text-warmGray-400 font-mono">{rule.description}</td>
								</tr>
							})}
						</tbody>
					</table>
				</div>
			</div>);
		}
		
		
		return (<div></div>);
	}
	
	mailToBlob(data = '') {
		data = `<html lang="en"><head><base target='_blank' /></head><body><div>${data || ''}</div></body></html>`
		const blob = new Blob([data], {type: 'text/html'});
		setTimeout(this.resizeIframe, 100);
		return URL.createObjectURL(blob);
	}
	
	resizeIframe() {
		const previewIframe = document.getElementById('previewIframe');
		if (previewIframe) {
			let iframeBody = previewIframe.contentWindow.document.body;
			if (iframeBody) previewIframe.style.height = `${iframeBody.offsetHeight}px`;
			previewIframe.addEventListener("load", function () {
				let iframeHeight = previewIframe.contentWindow.document.body.offsetHeight;
				if (iframeHeight < 500) iframeHeight = 500 - 10;
				previewIframe.style.height = `${iframeHeight}px`;
			});
		}
	}
}

export default withRouter(connect(
	state => ({}),
	{}
)(MailContent));
