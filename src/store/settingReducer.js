import {createSlice} from "@reduxjs/toolkit";

const settingState = createSlice({
	name: 'setting',
	initialState: {
		srvStatus: false,
		framework: "Laravel",
		ipAddress: "127.0.0.1",
		port: 2525,
		spamChecking: true
	},
	reducers: {
		setSrvStatus: (state, action) => ({...state, srvStatus: action.payload}),
		setFramework: (state, action) => ({...state, framework: action.payload}),
		setIpAddress: (state, action) => ({...state, ipAddress: action.payload}),
		setPort: (state, action) => ({...state, port: action.payload}),
		setSpamChecking: (state, action) => ({...state, spamChecking: action.payload}),
		
	}
})

export const {
	setSrvStatus,
	setFramework,
	setIpAddress,
	setPort,
} = settingState.actions;


export default settingState.reducer