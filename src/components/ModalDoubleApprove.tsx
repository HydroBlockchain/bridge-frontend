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
                You have previous approved amount. So you need to approve 2 times.<br/>
                Please approve your transaction in the Metamask and wait...
            </div>
        </CommonModal>
    )
}