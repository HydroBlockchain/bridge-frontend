import React from 'react'
import {CommonModal} from '../common/CommonModal/CommonModal'
import {useSelector} from 'react-redux'
import {AppStoreType} from '../redux/store'
import {ModalStateType} from '../redux/modalReducer'

export const ModalSwap = () => {

    const {modalSwapShow} = useSelector<AppStoreType, ModalStateType>(state => state.modal)

    if (!modalSwapShow) return null

    return(
        <CommonModal>
            <div>
                Please confirm Swap and wait...
            </div>
        </CommonModal>
    )
}