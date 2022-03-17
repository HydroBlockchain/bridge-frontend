import React from 'react'
import './App.scss'
import 'react-toastify/dist/ReactToastify.css'
import {Menu} from './components/Menu/Menu'
import {Navbar} from './components/Navbar/Navbar'
import {LinearProgress} from '@mui/material'
import {useSelector} from 'react-redux'
import {RequestStatusType} from './redux/appReducer'
import {AppStoreType} from './redux/store'
import s from './App.module.scss'
import {isLightTheme} from './common/common'
import {TotalSwapped} from './components/TotalSwapped/TotalSwapped'
import {Log} from './components/Log/Log'

function App() {
    const status = useSelector<AppStoreType, RequestStatusType>((state) => state.app.status)

    return (
        <div className={isLightTheme ? `${s.app} ${s.lightTheme}` : `${s.app}`}>
            <Navbar/>
            {status === 'loading' ? <LinearProgress/> : <div className={s.blank}/>}
            <div className={s.centerContainer}>
                <div className={s.container}>
                    {/*<TotalSwapped />*/}
                    <Menu/>
                    {/*<button>Show log</button>*/}
                    <Log />
                </div>
            </div>
            {/*<ToastContainer
                position="bottom-left"
                autoClose={false}
                hideProgressBar={false}
                newestOnTop={false}
                rtl={false}
                draggable
                pauseOnHover/>*/}
        </div>
    )
}

export default App