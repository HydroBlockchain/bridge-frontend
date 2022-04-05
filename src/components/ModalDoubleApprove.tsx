import React from 'react'
import {CommonModal} from '../common/CommonModal/CommonModal'
import {useSelector} from 'react-redux'
import {AppStoreType} from '../redux/store'
import {ModalStateType} from '../redux/modalReducer'

export const ModalDoubleApprove = () => {

    const {modalDoubleApproveShow} = useSelector<AppStoreType, ModalStateType>(state => state.modal)

    if (!modalDoubleApproveShow) return null

    return(
        <CommonModal>
            <div>
                You have previous approve amount. So you need to approve 2 times.<br/>
                Please Approve you transaction in the Metamask and wait...
            </div>
        </CommonModal>
    )
}