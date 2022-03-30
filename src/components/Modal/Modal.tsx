import React from 'react'
import s from './Modal.module.scss'
import {useDispatch, useSelector} from 'react-redux'
import {AppStoreType} from '../../redux/store'
import {ModalStateType, setModalShowAC} from '../../redux/modalReducer'

export const Modal = () => {
    const dispatch = useDispatch()

    const {modalShow, transactionStatus, transactionHash, explorerLink} = useSelector<AppStoreType, ModalStateType>(state => state.modal)

    if (!modalShow) return null

    const onClose = () => {
        dispatch(setModalShowAC(false))
    }


    return <div className={s.modalBackground}>
        <div className={s.swapModal}>
            <div>{transactionStatus}</div>
            <div>Explorer link: {transactionHash}</div>
            <div>Transaction hash: {explorerLink}</div>
            <button onClick={onClose}>Approve and close</button>
        </div>
    </div>
}