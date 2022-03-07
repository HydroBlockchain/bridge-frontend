let initialState: InitialStateType = {
    status: 'idle',
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        default:
            return {...state}
    }
}

export const setIsInitializeAC = (isInitilize: boolean) => {
    return ({type: 'APP/SET-IS-INITIALIZE', isInitilize} as const)
}
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)

// Types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type InitialStateType = {
    status: RequestStatusType
}
type ActionsType = ReturnType<typeof setAppStatusAC>
