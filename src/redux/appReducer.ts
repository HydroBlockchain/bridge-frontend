let initialState: AppStateType = {
    status: 'idle',
}

export const appReducer = (state: AppStateType = initialState, action: ActionsType): AppStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        default:
            return {...state}
    }
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)

// Types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppStateType = {
    status: RequestStatusType
}
type ActionsType = ReturnType<typeof setAppStatusAC>
