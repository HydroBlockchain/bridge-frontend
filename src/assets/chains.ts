// todo: fix any
import {chainIDs, chainsNames} from "../common/common";

export const chains: any = {
    [chainIDs.bsc]: { // real money chains
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
    [chainIDs.polygon]: {
        chainId: `0x${Number(chainIDs.polygon).toString(16)}`,
        chainName: chainsNames.polygon,
        rpcUrls: [
            "https://polygon-rpc.com/",
            "https://rpc-mainnet.matic.network",
            "https://matic-mainnet.chainstacklabs.com",
            "https://rpc-mainnet.maticvigil.com",
            "https://rpc-mainnet.matic.quiknode.pro",
            "https://matic-mainnet-full-rpc.bwarelabs.com"
        ],
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        },
        blockExplorerUrls: [""]
    },
    [chainIDs.mumbaiTest]: {  // test chains
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
    [chainIDs.moonriverMainnet]: {
        chainId: `0x${Number(chainIDs.moonriverMainnet).toString(16)}`,
        chainName: chainsNames.moonriverMainnet,
        nativeCurrency: {
            name: 'Moonriver Chain Native Token',
            symbol: "MOVR",
            decimals: 18
        },
        rpcUrls: [
            "https://moonriver.blastapi.io/16f8b680-4719-4e0f-aabd-5af382c399b1",
            "wss://wss.api.moonbeam.network"
        ],
        blockExplorerUrls: ["https://moonbeam.moonscan.io"]
    },
    [chainIDs.coinex]: {
        chainId: `0x${Number(chainIDs.coinex).toString(16)}`,
        chainName: chainsNames.coinex,
        rpcUrls: [
            "https://rpc.coinex.net"
        ],
        faucets: [],
        nativeCurrency: {
            name: "CoinEx Chain Native Token",
            symbol: "CET",
            decimals: 18
        },
        infoURL: "https://www.coinex.org/",
        shortName: "CET",
        networkId: 52,
        explorers: [
            {
                "name": "coinexscan",
                "url": "https://www.coinex.net",
                "standard": "none"
            }
        ]
    },
};

type chainsType = {

}

// note: adding chains doesn't work for test nets