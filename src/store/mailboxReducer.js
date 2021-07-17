import {createSlice} from "@reduxjs/toolkit";

const mailboxState = createSlice({
	name: 'mailbox',
	initialState: {
		mails: [
			{subject: "mail 1"},
			{subject: "mail 2"},
		],
		
	},
	reducers: {
		clearMails: (state, _action) => ({...state, mails: []}),
		addMail: (state, action) => ({...state, mails: [...state.mails, action.payload]}),
		
	}
})

export const {
	clearMails,
	addMail,
} = mailboxState.actions;


export default mailboxState.reducer