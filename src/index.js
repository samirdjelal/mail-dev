import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.css';
import {invoke} from "@tauri-apps/api";
import {listen} from "@tauri-apps/api/event";

// todo: router, store, tailwindcss
class App extends React.Component {
	componentDidMount() {
		setTimeout(() => {
			invoke("start_smtp_server").then(r => {
				console.log(r)
			});
		}, 100)
		listen("mail-received", (r)=>{
			console.log(r)
		}).then().catch()
	}
	
	render() {
		return (
			<div>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed, tenetur?
			</div>
		)
	}
}

ReactDOM.render(
	<React.StrictMode>
		<App/>
	</React.StrictMode>,
	document.getElementById('root')
);
