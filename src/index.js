import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.css';
import './styles/tailwind.css';
import {Provider} from 'react-redux';
import App from './App';
import store from './store/store';
import {MemoryRouter} from 'react-router-dom';

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<MemoryRouter>
				<App/>
			</MemoryRouter>
		</Provider>
	</React.StrictMode>,
	
	document.getElementById('root')
);
