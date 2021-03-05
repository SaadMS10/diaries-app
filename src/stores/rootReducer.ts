import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/auth/userSlice';
import diaryReducer from "../features/diary/diarySlice";
import entryReducer from "../features/entry/entrySlice";
import editorReducer from '../features/entry/editorSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    diary: diaryReducer,
    entries: entryReducer,
    user: userReducer,
    editor: editorReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;