import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from "react-router";

class Settings extends Component {
	render() {
		return (
			<div>
				Settings
			</div>
		);
	}
}

export default withRouter(connect(
	state => ({}),
	{}
)(Settings));
