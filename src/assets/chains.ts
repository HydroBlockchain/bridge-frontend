// todo: fix any
import {networkIDs, networkNames} from "../common/variables";

export const chains: any = {
    [networkIDs.polygon]: {
        chainId: `0x${Number(networkIDs.polygon).toString(16)}`,
        chainName: networkNames.polygon,
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        },
        rpcUrls: ["https://polygon-rpc.com/"],
        blockExplorerUrls: ["https://polygonscan.com/"]
    },
    [networkIDs.bsc]: {
        chainId: `0x${Number(networkIDs.bsc).toString(16)}`,
        chainName: networkNames.bsc,
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
    [networkIDs.eth]: {
        chainId: `0x${Number(networkIDs.eth).toString(16)}`,
    },
    [networkIDs.coinEx]: {
        chainId: `0x${Number(networkIDs.coinEx).toString(16)}`,
        chainName: networkNames.coinEx,
        nativeCurrency: {
            name: "CoinEx Chain Native Token",
            symbol: "cet",
            decimals: 18
        },
        rpcUrls: [
            "https://rpc.coinex.net"
        ],
        blockExplorerUrls: ["https://www.coinex.net"]
    },
    [networkIDs.mumbaiTest]: {  // for testing
        chainId: `0x${Number(networkIDs.mumbaiTest).toString(16)}`,
        chainName: networkNames.mumbaiTest,
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        },
        rpcUrls: [""],
        blockExplorerUrls: [""]
    },
    [networkIDs.rinkebyTest] : { // for testing
        chainId: `0x${Number(networkIDs.rinkebyTest).toString(16)}`,
        chainName: networkNames.rinkebyTest,
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: [""],
        blockExplorerUrls: [""]
    },
    [networkIDs.coinExTest]: {
        chainId: `0x${Number(networkIDs.coinExTest).toString(16)}`,
        chainName: networkNames.coinExTest,
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