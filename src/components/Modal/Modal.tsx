import React from 'react'
import s from './Modal.module.scss'
import {useDispatch, useSelector} from 'react-redux'
import {AppStoreType} from '../../redux/store'
import {ModalStateType, setModalShowAC} from '../../redux/modalReducer'

export const Modal = () => {
    const dispatch = useDispatch()

    const {modalShow, transactionStatus, transactionHash, explorerLink} = useSelector<AppStoreType, ModalStateType>(state => state.modal)
    modalShow && console.log('Modal transaction', transactionStatus, transactionHash, explorerLink)

    if (!modalShow) return null

    const onClose = () => {
        dispatch(setModalShowAC(false))
    }

    return <div className={s.modalBackground}>
        <div className={s.swapModal}>
            <div>{transactionStatus}</div>
            <div>Explorer link: {explorerLink}</div>
            <div>Transaction hash: {transactionHash}</div>
            <button onClick={onClose}>Approve and close</button>
        </div>
    </div>
}