// todo: fix any
import {chainIDs, chainsNames} from "../common/common";

export const chains: any = {
    [chainIDs.bsc]: {
        chainId: `0x${Number(chainIDs.bsc).toString(16)}`,
        chainName: chainsNames.bsc,
        nativeCurrency: {
            name: "Binance Chain Native Token",
            symbol: "BNB",
            decimals: 18
        },
        rpcUrls: [
            "https://bsc-dataseed1.binance.org",
            "https://bsc-dataseed2.binance.org",
            "https://bsc-dataseed3.binance.org",
            "https://bsc-dataseed4.binance.org",
            "https://bsc-dataseed1.defibit.io",
            "https://bsc-dataseed2.defibit.io",
            "https://bsc-dataseed3.defibit.io",
            "https://bsc-dataseed4.defibit.io",
            "https://bsc-dataseed1.ninicoin.io",
            "https://bsc-dataseed2.ninicoin.io",
            "https://bsc-dataseed3.ninicoin.io",
            "https://bsc-dataseed4.ninicoin.io",
            "wss://bsc-ws-node.nariox.org"
        ],
        blockExplorerUrls: ["https://bscscan.com"]
    },
    [chainIDs.eth]: {
        chainId: `0x${Number(chainIDs.eth).toString(16)}`,
    },
    [chainIDs.mumbaiTest]: {  // for testing
        chainId: `0x${Number(chainIDs.mumbaiTest).toString(16)}`,
        chainName: chainsNames.mumbaiTest,
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        },
        rpcUrls: [""],
        blockExplorerUrls: [""]
    },
    [chainIDs.rinkebyTest] : { // for testing
        chainId: `0x${Number(chainIDs.rinkebyTest).toString(16)}`,
        chainName: chainsNames.rinkebyTest,
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: [""],
        blockExplorerUrls: [""]
    },
    [chainIDs.coinExTest]: {
        chainId: `0x${Number(chainIDs.coinExTest).toString(16)}`,
        chainName: chainsNames.coinExTest,
        nativeCurrency: {
            name: 'CoinEx Chain Test Native Token',
            symbol: "cett",
            decimals: 18
        },
        rpcUrls: [
            "https://testnet-rpc.coinex.net/"
        ],
        blockExplorerUrls: ["https://testnet.coinex.net"]
    },
};

type chainsType = {

}

// note: adding chains doesn't work for test nets