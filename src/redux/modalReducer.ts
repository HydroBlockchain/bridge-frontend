let initialState = {
    modalTransactionShow: false,
    modalApproveShow: false,
    modalSwapShow: false,
    transactionStatus: '?',
    explorerLink: '?',
    transactionHash: '?',
}

export const modalReducer = (state: ModalStateType = initialState, action: ActionsType): ModalStateType => {
    switch (action.type) {
        case 'MODAL/SET-MODAL-TRANSACTION-SHOW':
        case 'MODAL/SET-MODAL-APPROVE-SHOW':
        case 'MODAL/SET-TRANSACTION-RESULT':
        case 'MODAL/SET-MODAL-SWAP-SHOW':
            return {...state, ...action.payload}
        default:
            return {...state}
    }
}

export const setModalTransactionShowAC = (modalTransactionShow: boolean) => ({type: 'MODAL/SET-MODAL-TRANSACTION-SHOW', payload: {modalTransactionShow}} as const)
export const setModalApproveShowAC = (modalApproveShow: boolean) => ({type: 'MODAL/SET-MODAL-APPROVE-SHOW', payload: {modalApproveShow}} as const)
export const setModalSwapShowAC = (modalSwapShow: boolean) => ({type: 'MODAL/SET-MODAL-SWAP-SHOW', payload: {modalSwapShow}} as const)
export const setTransactionResultAC = (transactionStatus: string, explorerLink: string, transactionHash: string) => ({
    type: 'MODAL/SET-TRANSACTION-RESULT', payload: {transactionStatus, explorerLink, transactionHash}
} as const)


// types
export type ModalStateType = typeof initialState
type ActionsType =
    | ReturnType<typeof setModalTransactionShowAC>
    | ReturnType<typeof setModalApproveShowAC>
    | ReturnType<typeof setTransactionResultAC>
    | ReturnType<typeof setModalSwapShowAC>
