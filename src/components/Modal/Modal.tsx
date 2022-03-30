import React from 'react'
import s from './Modal.module.scss'
import {useDispatch} from 'react-redux'

export const Modal = (props: PropsType) => {
    const dispatch = useDispatch()

    if (!props.modalShowHide) return null

    return <div className={s.modalBackground}>
        <div className={s.swapModal}>
            Yor transaction complete successfully.
        </div>
    </div>
}

type PropsType = {
    modalShowHide: boolean
}