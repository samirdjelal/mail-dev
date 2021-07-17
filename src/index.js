import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.css';
import {invoke} from "@tauri-apps/api";
import {listen} from "@tauri-apps/api/event";
import Sidebar from "./components/Sidebar";
import {Provider} from 'react-redux';
import store from './store/store';
import Mailbox from "./screens/Mailbox";
import Settings from "./screens/Settings";
import {MemoryRouter, Switch, Route, Redirect} from 'react-router-dom';

// todo: router, store, tailwindcss
class App extends React.Component {
	componentDidMount() {
		setTimeout(() => {
			invoke("start_smtp_server").then().catch()
		}, 1000000)
		listen("mail-received", (r) => {
			console.log(r)
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

ReactDOM.render(
	// <React.StrictMode>
	// 	<App/>
	// </React.StrictMode>,
	<React.StrictMode>
		<Provider store={store}>
			<MemoryRouter>
				<App/>
			</MemoryRouter>
		</Provider>
	</React.StrictMode>,
	
	document.getElementById('root')
);
