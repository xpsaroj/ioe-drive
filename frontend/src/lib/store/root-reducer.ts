import { combineReducers } from "@reduxjs/toolkit";
import meReducer from "./features/me/me.slice";

export const rootReducer = combineReducers({
    me: meReducer,
});