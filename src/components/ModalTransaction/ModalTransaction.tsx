import React from 'react'
import s from './ModalTransaction.module.scss'
import {useDispatch, useSelector} from 'react-redux'
import {AppStoreType} from '../../redux/store'
import {ModalStateType, setModalTransactionShowAC} from '../../redux/modalReducer'
import {isLightTheme} from '../../common/common'
import cn from 'classnames'
import {CommonModal} from '../../common/CommonModal/CommonModal'

export const ModalTransaction = () => {
    const dispatch = useDispatch()

    const {modalTransactionShow, transactionStatus, transactionHash, explorerLink} = useSelector<AppStoreType, ModalStateType>(state => state.modal)

    if (!modalTransactionShow) return null

    const onClose = () => {
        dispatch(setModalTransactionShowAC(false))
    }

    return (
        <CommonModal>
            <div>{transactionStatus}</div>
            <div>Explorer link: {explorerLink}</div>
            <div>Transaction hash: {transactionHash}</div>
            <button onClick={onClose} className={isLightTheme ? cn(s.buttonLight, s.button) : cn(s.button)}>Approve and close</button>
        </CommonModal>
    )

}