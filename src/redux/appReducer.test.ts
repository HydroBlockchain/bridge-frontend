import {appReducer, AppStateType, RequestStatusType, setAppStatusAC} from './appReducer'

let startState: AppStateType;

const isTestNetsLS = localStorage.getItem('isTestNets')
beforeEach(() => {
    startState = {
        status: 'idle' as RequestStatusType,
        isTestNets: isTestNetsLS ? JSON.parse(isTestNetsLS) : false,
        isSwapButtonDisabled: true,
        isSupportedChain: false,
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