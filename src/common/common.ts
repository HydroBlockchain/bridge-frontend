import binanceBNB from '../assets/images/chainSymbols/binanceBNB.png'
import coinexCETT from '../assets/images/chainSymbols/coinexCett.png'
import ethereumETH from '../assets/images/chainSymbols/ethereumETH.png'
import polygonMatic from '../assets/images/chainSymbols/polygonMatic.png'
import moonriverMVR from '../assets/images/chainSymbols/moonriver.svg'

// === IMPORTANT: ===
// export const addressForWeb3 = 'https://hydroblockchain.github.io/hydro-bridge-ui' // for github.io
export const addressForWeb3 = 'https://hydro-bridge.org/'
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
    moonbeamAlphaTestnet = 1287,
    moonriverMainnet = 1285,
    coinex = 52,
}

export const chainsPictures = {
    [chainIDs.notSelected]: '',
    [chainIDs.eth]: ethereumETH,
    [chainIDs.bsc]: binanceBNB,
    [chainIDs.polygon]: polygonMatic,
    [chainIDs.mumbaiTest]: polygonMatic,
    [chainIDs.rinkebyTest]: ethereumETH,
    [chainIDs.coinExTest]: coinexCETT,
    [chainIDs.moonbeamAlphaTestnet]: ethereumETH,
    [chainIDs.moonriverMainnet]: moonriverMVR,
    [chainIDs.coinex]: coinexCETT
}

export const chainsNationalSymbols: ChainsNationalSymbolsType = {
    [chainIDs.eth]: 'ETH',
    [chainIDs.bsc]: 'BNB',
    [chainIDs.polygon]: 'MATIC',
    [chainIDs.mumbaiTest]: 'MATIC',
    [chainIDs.rinkebyTest]: 'ETH',
    [chainIDs.coinExTest]: 'CETT',
    [chainIDs.moonbeamAlphaTestnet]: 'DEV',
    [chainIDs.moonriverMainnet]: 'MOVR',
    [chainIDs.coinex]: 'CET',
}

export type RealizedChainsRightType =
    | 1
    | 56
    | 137
    | 80001
    | 4
    | 53
    | 1287
    | 1285
    | 52

export const chainNamesForGetHydroBalance = {
    [chainIDs.eth]: 'ethereum',
    [chainIDs.bsc]: 'binanceMainnet',
    [chainIDs.polygon]: 'polygonMainnet',
    [chainIDs.mumbaiTest]: 'polygonTestnet',
    [chainIDs.rinkebyTest]: 'rinkebyTestnet',
    [chainIDs.coinExTest]: 'coinexTestNetwork',
    [chainIDs.moonbeamAlphaTestnet]: 'moonbeamAlphaTestnet',
    [chainIDs.moonriverMainnet]: 'moonriverMainnet',
    [chainIDs.coinex]: 'coinex',
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
    moonbeamAlphaTestnet = 'Moonbeam Alpha Testnet',
    moonriverMainnet = 'Moonriver Network',
    coinex = 'Coinex Smart Chain',
}

export const hydroAddresses = {
    forEth: '0x946112efaB61C3636CBD52DE2E1392D7A75A6f01',
    forBsc: '0xf3DBB49999B25c9D6641a9423C7ad84168D00071',
    forPolygon: '0x946112efaB61C3636CBD52DE2E1392D7A75A6f01',
    forMoonriver: '0x946112efaB61C3636CBD52DE2E1392D7A75A6f01',
    forCoinex: '0x946112efaB61C3636CBD52DE2E1392D7A75A6f01',
    forTestNets: '0x9477B2d4442FCd35368c029a0016e6800437BAe2'
}
export const swapContractAddresses = {
    eth: '0xfa41d158Ea48265443799CF720a120BFE77e41ca',
    bsc: '0x7f00F1B8825064B109Dcc85aAd1f074652D97AAd',
    polygon: '0xc8ea800fb6c6f8419758741b3ea1b85dddf2c5b8',
    coinexSmartChainTestnet: '0x0ca32D03C30F9911a93E6516272EB6635387261d',
    mumbaiTestnet: '0x1500D17ECa72d87331db5f5dd634d755D73a0041',
    rinkebyTestnet: '0xFBCf060541596047e47Db0ddcf37818D2B2eD4c0',
    moonbeamAlphaTestnet: '0xC62cfE5c4780b9f9d24209036BA0764B43C0F279',
    moonriverMainnet: '0x7f45Fd12651F397Db4916d32762bc9ce01740e3C',
    coinex: '0x7f45Fd12651F397Db4916d32762bc9ce01740e3C',
}

// for dark and light theme switch
export const isLightTheme = window.matchMedia("(prefers-color-scheme:light)").matches

type ChainsNationalSymbolsType = {
    [key: number]: string
}

