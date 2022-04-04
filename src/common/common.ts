import binanceBNB from '../assets/images/chainSymbols/binanceBNB.png'
import coinexCETT from '../assets/images/chainSymbols/coinexCett.png'
import ethereumETH from '../assets/images/chainSymbols/ethereumETH.png'
import polygonMatic from '../assets/images/chainSymbols/polygonMatic.png'

// === IMPORTANT: ===
// export const addressForWeb3 = 'https://hydroblockchain.github.io/hydro-bridge-ui' // for github.io
export const addressForWeb3 = 'http://127.0.0.1:3001'
// export const isTestChains = true
// === ===

export enum chainIDs {
    notSelected = 0,
    eth = 1,
    bsc = 56,
    polygon = 137,
    mumbaiTest = 80001,
    rinkebyTest = 4,
    coinExTest = 53,
}

export const chainsPictures = {
    [chainIDs.notSelected]: '',
    [chainIDs.eth]: ethereumETH,
    [chainIDs.bsc]: binanceBNB,
    [chainIDs.polygon]: polygonMatic,
    [chainIDs.mumbaiTest]: polygonMatic,
    [chainIDs.rinkebyTest]: ethereumETH,
    [chainIDs.coinExTest]: coinexCETT
}

export const chainsNationalSymbols: ChainsNationalSymbolsType = {
    [chainIDs.eth]: 'ETH',
    [chainIDs.bsc]: 'BNB',
    [chainIDs.polygon]: 'CETT',
    [chainIDs.mumbaiTest]: 'MATIC',
    [chainIDs.rinkebyTest]: 'ETH',
    [chainIDs.coinExTest]: 'CETT'
}

export type RealizedChainsRightType =
    | 1
    | 56
    | 137
    | 80001
    | 4
    | 53

export const chainNamesForGetHydroBalance = {
    [chainIDs.eth]: 'ethereum',
    [chainIDs.bsc]: 'binanceMainnet',
    [chainIDs.polygon]: 'polygonMainnet',
    [chainIDs.mumbaiTest]: 'polygonTestnet',
    [chainIDs.rinkebyTest]: 'rinkebyTestnet',
    [chainIDs.coinExTest]: 'coinexTestNetwork',
}


export enum chainsNames {
    notSelected = 'Please click Connect Wallet and unlock you Metamask.',
    eth = 'Ethereum Mainnet',
    bsc = 'Binance Smart Chain Mainnet',
    polygon = 'Polygon Mainnet',
    coinEx = 'CoinEx Smart Chain Mainnet',
    mumbaiTest = 'Mumbai Testnet',
    rinkebyTest = 'Rinkeby Test Network',
    coinExTest = 'CoinEx Smart Chain Testnet',
}

export const hydroAddresses = {
    forEth: '0x946112efaB61C3636CBD52DE2E1392D7A75A6f01',
    forBsc: '0xf3DBB49999B25c9D6641a9423C7ad84168D00071',
    forPolygon: '0x946112efaB61C3636CBD52DE2E1392D7A75A6f01 ',
    forTestNets: '0x9477B2d4442FCd35368c029a0016e6800437BAe2'
}
export const swapContractAddresses = {
    eth2bsc: '0xfa41d158Ea48265443799CF720a120BFE77e41ca',
    bsc2eth: '0xa8377d8A0ee92120095bC7ae2d8A8E1973CcEa95',
    polygon: '0xc8ea800fb6c6f8419758741b3ea1b85dddf2c5b8',
    coinexSmartChainTestnet: '0x1500D17ECa72d87331db5f5dd634d755D73a0041',
    mumbaiTestnet: '0x1500D17ECa72d87331db5f5dd634d755D73a0041',
    rinkebyTestnet: '0xFBCf060541596047e47Db0ddcf37818D2B2eD4c0',
}

// for dark and light theme switch
export const isLightTheme = window.matchMedia("(prefers-color-scheme:light)").matches

type ChainsNationalSymbolsType = {
    [key: number]: string
}

