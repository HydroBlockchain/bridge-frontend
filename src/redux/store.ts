import {applyMiddleware, combineReducers, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import {bridgeReducer} from "./bridgeReducer";
import {appReducer} from "./appReducer";

const rootReducer = combineReducers({
    bridge: bridgeReducer,
    app: appReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export type AppStoreType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store; // for dev