import {appReducer, AppStateType, setAppStatusAC} from "./appReducer";

let startState: AppStateType;

beforeEach(() => {
    startState = {
        status: 'idle',
    }
})

test('app status must be loading', () => {
    const action = setAppStatusAC('loading')
    const endState = appReducer(startState, action)
    expect(endState.status).toBe('loading')
})

test('app status must be succeeded', () => {
    const action = setAppStatusAC("succeeded")
    const endState = appReducer(startState, action)
    expect(endState.status).toBe('succeeded')
})