let initialState = {
    modalShow: false,
    transactionStatus: '?',
    explorerLink: '?',
    transactionHash: '?'
}

export const modalReducer = (state: ModalStateType = initialState, action: ActionsType): ModalStateType => {
    switch (action.type) {
        case 'MODAL/SET-MODAL-SHOW':
        case 'MODAL/SET-TRANSACTION-RESULT':
            return {...state, ...action.payload}
        default:
            return {...state}
    }
}

export const setModalShowAC = (modalShow: boolean) => ({type: 'MODAL/SET-MODAL-SHOW', payload: {modalShow}} as const)
export const setTransactionResultAC = (transactionStatus: string, explorerLink: string, transactionHash: string) => ({
    type: 'MODAL/SET-TRANSACTION-RESULT', payload: {transactionStatus, explorerLink, transactionHash}
} as const)

// types
export type ModalStateType = typeof initialState
type ActionsType =
    | ReturnType<typeof setModalShowAC>
    | ReturnType<typeof setTransactionResultAC>
