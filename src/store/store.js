import {configureStore} from "@reduxjs/toolkit";
import settingReducer from "./settingReducer";
import mailboxReducer from "./mailboxReducer";

export default configureStore({
	reducer: {
		setting: settingReducer,
		mailbox: mailboxReducer,
	}
})