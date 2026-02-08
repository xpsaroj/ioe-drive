import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';

export const makeStore = () => {
    return configureStore({
        reducer: rootReducer,
        devTools: process.env.NODE_ENV !== 'production',
    });
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];