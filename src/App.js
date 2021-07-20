import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from "react-router";
import {invoke} from "@tauri-apps/api";
import {listen} from "@tauri-apps/api/event";
import Sidebar from "./components/Sidebar";
import Mailbox from "./screens/Mailbox";
import Settings from "./screens/Settings";
import {Switch, Route, Redirect} from 'react-router-dom';
import {addMail} from "./store/mailboxReducer";

class App extends Component {
	componentDidMount() {
		setTimeout(() => {
			invoke("start_smtp_server").then().catch()
		}, 100)
		listen("mail-received", (res) => {
			console.log(res.payload)
			console.log(typeof res.payload)
			this.props.addMail(res.payload)
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
						<Redirect to="/settings"/>
					</Switch>
				</div>
			</div>
		)
	}
}

export default withRouter(connect(
	state => ({}),
	{
		addMail,
	}
)(App));
