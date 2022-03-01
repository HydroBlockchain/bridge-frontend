import {toast} from "react-toastify";
import React from "react";

export const serverApi = (values: any) => {
    //let address = values.returnValues.depositor
    //let amount = values.returnValues.outputAmount
    let hash = values.transactionHash


    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.REACT_APP_API_KEY as string,
            'Origin': '^'
        },

        body: JSON.stringify({
            hash: hash
        })
    };

    /*if (this.state.prev_hash === 1) {
        fetch(this.state.API_LINK, requestOptions)
            .then(async response => {
                if (response.status === 200) {
                    const tx_hash = await response.json();
                    this.setState({txHash: JSON.parse(tx_hash.receipt)}, () => console.log())
                    toast(<a href={this.state.tx_Link + this.state.txHash.transactionHash} target="blank">Swap
                    Success!</a>);
                    this.setState({
                        loading_text: 'Success, Your Hydro is on the way.',
                        swapping: false,
                        prev_hash: 0
                    })
                    console.log(response)
                } else {
                    console.log('error, please wait a couple minutes,or save your transaction hash & contact hydro admins',)
                    setTimeout(() => this.api(values), 10000);

                }
            })

    }*/

}