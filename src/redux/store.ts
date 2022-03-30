import {applyMiddleware, combineReducers, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import {bridgeReducer} from "./bridgeReducer";
import {appReducer} from "./appReducer";
import {modalReducer} from './modalReducer'

const rootReducer = combineReducers({
    bridge: bridgeReducer,
    app: appReducer,
    modal: modalReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export type AppStoreType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store; // for dev