import React from 'react';
import './App.scss'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Menu} from "./components/Menu/Menu";
import {Navbar} from "./components/Navbar/Navbar";
import {LinearProgress} from "@mui/material";
import {useSelector} from "react-redux";
import {RequestStatusType} from "./redux/appReducer";
import {AppStoreType} from "./redux/store";

function App() {
    const status = useSelector<AppStoreType, RequestStatusType>((state) => state.app.status)

    return (
        <div>
            <Navbar/>
            {status === 'loading' && <LinearProgress/>}
            <div className="container-fluid mt-5">
                <div className="row mt-5">
                    <main role="main" className="col-lg-12 ml-auto mr-auto">
                        <div className="content mr-auto ml-auto">
                            <div id="content" className="mt-5 swap-form">
                                <div className="card mb-4">
                                    <Menu className={'card-body main-form'}/>
                                </div>
                            </div>
                            <ToastContainer
                                position="bottom-left"
                                autoClose={false}
                                hideProgressBar={false}
                                newestOnTop={false}
                                rtl={false}
                                draggable
                                pauseOnHover/>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default App;