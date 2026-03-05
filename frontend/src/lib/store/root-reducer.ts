import { combineReducers } from "@reduxjs/toolkit";
import meReducer from "./features/me/me.slice";
import academicsReducer from "./features/academics/academcis.slice";

export const rootReducer = combineReducers({
    me: meReducer,
    academics: academicsReducer,
});