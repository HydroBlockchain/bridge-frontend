// todo: fix any
export const chains: any = {
    polygon: {
        chainId: `0x${Number(137).toString(16)}`,
        chainName: "Polygon Mainnet",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        },
        rpcUrls: ["https://polygon-rpc.com/"],
        blockExplorerUrls: ["https://polygonscan.com/"]
    },
    bsc: {
        chainId: `0x${Number(56).toString(16)}`,
        chainName: "Binance Smart Chain Mainnet",
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
    eth: {
        chainId: `0x${Number(1).toString(16)}`,
    },
    csc: {
        chainId: `0x${Number(52).toString(16)}`,
        chainName: "CoinEx Smart Chain Mainnet",
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
    MumbaiTest: {  // for testing
        chainId: `0x${Number(80001).toString(16)}`,
        chainName: "Mumbai Testnet",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        },
        rpcUrls: [""],
        blockExplorerUrls: [""]
    },
    RinkebyTest : { // for testing
        chainId: `0x${Number(4).toString(16)}`,
        chainName: "Rinkeby Test Network",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: [""],
        blockExplorerUrls: [""]
    },
};

type chainsType = {

}

// note: adding chains doesn't work for test nets