import React from 'react'
import {CommonModal} from '../common/CommonModal/CommonModal'
import {useSelector} from 'react-redux'
import {AppStoreType} from '../redux/store'
import {ModalStateType} from '../redux/modalReducer'

export const ModalApprove = () => {

    const {modalApproveShow} = useSelector<AppStoreType, ModalStateType>(state => state.modal)

    if (!modalApproveShow) return null

    return(
        <CommonModal>
            <div>
                Please Approve you transaction in the Metamask and wait...
            </div>
        </CommonModal>
    )
}