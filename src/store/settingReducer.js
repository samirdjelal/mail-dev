import {createSlice} from "@reduxjs/toolkit";

const settingState = createSlice({
	name: 'setting',
	initialState: {
		tab: "mailbox",
		
	},
	reducers: {
		setTab: (state, action) => ({...state, tab: action.payload}),
		
	}
})

export const {
	setTab
} = settingState.actions;


export default settingState.reducer