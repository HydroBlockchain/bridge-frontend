import {chains} from "../assets/chains";

export const localAPI = {
    getAccount: async () => {
        const accounts = await window.web3.eth.getAccounts();
        return accounts[0]
    },
    setNetworkID: async () => {
        const web3 = window.web3;
        return await web3.eth.net.getId();
    },
    changeNetwork: async (networkName: string) => {
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{chainId: chains[networkName].chainId}],
            })
            return true
        } catch (error) {
            try {
                if ((error as ErrorType).code === 4902) {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [chains[networkName]],
                    });
                    return true
                }
            } catch (error) {
                return false
            }
        }
    },
}

declare let window: any // todo: maybe fix any
type ErrorType = {
    code: number
}