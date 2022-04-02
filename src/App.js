import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from "react-router";
import {listen} from "@tauri-apps/api/event";
import Sidebar from "./components/Sidebar";
import Mailbox from "./screens/Mailbox";
import Settings from "./screens/Settings";
import {Switch, Route, Redirect} from 'react-router-dom';
import {addMail} from "./store/mailboxReducer";
import {invoke} from "@tauri-apps/api";

class App extends Component {
	componentDidMount() {
		listen("mail-received", (res) => {
			this.props.addMail(res.payload)
			if (this.props.forwardEnabled === true) {
				console.log(res.payload)
				invoke('forward_mail', {
					host: this.props.forwardEmailHost,
					port: this.props.forwardEmailPort,
					username: this.props.forwardEmailUsername,
					password: this.props.forwardEmailPassword,
					email_content: res.payload.mime,
					email_to: res.payload.to,
					email_subject: res.payload.subject
				}).then(r => console.log(r))
			}
		}).then().catch()
	}
	
	render() {
		return (
			<div className="min-h-screen h-screen flex">
				<Sidebar/>
				<div className="w-full h-full">
					<Switch>
						<Route path="/mailbox" component={Mailbox} exact/>
						<Route path="/settings" component={Settings} exact/>
						<Redirect to="/mailbox"/>
					</Switch>
				</div>
			</div>
		)
	}
}

export default withRouter(connect(
	state => ({
		forwardEmailHost: state.setting.forwardEmailHost,
		forwardEmailPort: state.setting.forwardEmailPort,
		forwardEmailUsername: state.setting.forwardEmailUsername,
		forwardEmailPassword: state.setting.forwardEmailPassword,
		forwardEnabled: state.setting.forwardEnabled,
	}),
	{
		addMail,
	}
)(App));
