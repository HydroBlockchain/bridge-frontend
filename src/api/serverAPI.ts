import {toast} from "react-toastify";
import React from "react";
import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/1.0.0',
    withCredentials: true,
})

export const serverApi = {
    /*getSwapCostInHydroTokens: function{

    }*/
    getSwapCostInHydroTokens() {
        return instance.get(`/getSwapCostInHydroTokens?destinationChain=ethereum`)
    }
}
