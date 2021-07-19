import {createSlice} from "@reduxjs/toolkit";

const mailboxState = createSlice({
	name: 'mailbox',
	initialState: {
		mails: [],
		mailIndex: null,
		mail: {}
	},
	reducers: {
		clearMails: (state, _action) => ({...state, mails: [], mailIndex: null, mail: {}}),
		addMail: (state, action) => {
			const arr = action.payload.to.match(/^<(.+?)>$/);
			if (arr) action.payload.to = arr[1];
			return {...state, mails: [...state.mails, {...action.payload, key: Math.random().toString(), seen: false, spam_score: "", spam_rules: []}]};
		},
		setMailIndex: (state, action) => {
			let mail_object = {};
			let copy = state.mails.map(mail => {
				if (mail.key === action.payload) {
					mail_object = mail;
					return {...mail, seen: true};
				}
				return {...mail};
			})
			return {...state, mails: copy, mailIndex: action.payload, mail: mail_object};
		},
		setSpamScore: (state, action) => {
			console.log(action.payload)
			let mail_object = {};
			let copy = state.mails.map(mail => {
				if (mail.key === action.payload.key) {
					return mail_object = {...mail, seen: true, spam_score: action.payload.spam_score, spam_rules: action.payload.spam_rules};
				}
				return {...mail};
			})
			return {...state, mails: copy, mail: mail_object};
		},
		deleteMail: (state, action) => {
			let copy = state.mails.filter(mail => mail.key !== action.payload)
			return {...state, mails: copy, mailIndex: null, mail: {}};
		},
	}
})

export const {
	clearMails,
	addMail,
	setMailIndex,
	setSpamScore,
	deleteMail,
} = mailboxState.actions;


export default mailboxState.reducer