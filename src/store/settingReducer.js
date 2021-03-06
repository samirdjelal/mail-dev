import {createSlice} from "@reduxjs/toolkit";

const settingState = createSlice({
	name: 'setting',
	initialState: {
		srvStatus: false,
		srvErrorMessage: "",
		framework: "Laravel",
		ipAddress: "127.0.0.1",
		port: 2525,
		spamChecking: true,
		
		forwardEmailHost: "smtp.gmail.com",
		forwardEmailPort: "587",
		forwardEmailUsername: "",
		forwardEmailPassword: "",
		forwardEnabled: false,
		
		useNotification: true,
		
	},
	reducers: {
		setSrvStatus: (state, action) => ({...state, srvStatus: action.payload}),
		setSrvResponseMessage: (state, action) => ({...state, srvResponseMessage: action.payload}),
		setFramework: (state, action) => ({...state, framework: action.payload}),
		setIpAddress: (state, action) => ({...state, ipAddress: action.payload}),
		setPort: (state, action) => ({...state, port: action.payload}),
		setSpamChecking: (state, action) => ({...state, spamChecking: action.payload}),
		
		setForwardEmailHost: (state, action) => ({...state, forwardEmailHost: action.payload}),
		setForwardEmailPort: (state, action) => ({...state, forwardEmailPort: action.payload}),
		setForwardEmailUsername: (state, action) => ({...state, forwardEmailUsername: action.payload}),
		setForwardEmailPassword: (state, action) => ({...state, forwardEmailPassword: action.payload}),
		setForwardEnabled: (state, action) => ({...state, forwardEnabled: action.payload}),
		
		setUseNotification: (state, action) => ({...state, useNotification: action.payload}),
		
	}
})

export const {
	setSrvStatus,
	setSrvResponseMessage,
	setFramework,
	setIpAddress,
	setPort,
	setForwardEmailHost,
	setForwardEmailPort,
	setForwardEmailUsername,
	setForwardEmailPassword,
	setForwardEnabled,
	setUseNotification,
} = settingState.actions;


export default settingState.reducer