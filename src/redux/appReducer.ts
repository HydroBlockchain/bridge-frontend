const isTestNetsLS = localStorage.getItem('isTestNets')
let initialState: AppStateType = {
    status: 'idle',
    isTestNets: isTestNetsLS ? JSON.parse(isTestNetsLS) : false
}

export const appReducer = (state: AppStateType = initialState, action: ActionsType): AppStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-IS-TEST-NETS':
            return {...state, isTestNets: action.isTestNets}
        default:
            return {...state}
    }
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setIsTestNetsAC = (isTestNets: boolean) => ({type: 'APP/SET-IS-TEST-NETS', isTestNets} as const)

// Types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppStateType = {
    status: RequestStatusType
    isTestNets: boolean
}
type ActionsType =
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setIsTestNetsAC>
