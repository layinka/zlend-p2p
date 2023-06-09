// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BaseApiUrl: 'https://localhost:3053',
  web3StorageToken: '',  
  contractAddresses : [
    {
      chainId: 31337,
      networkName: 'Hardhat Local Network',
      networkShortName: 'HardHat',
      zTokenAddress: '0x313F922BE1649cEc058EC0f076664500c78bdc0b',
      heritageTokenAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      diamondDeployAddress: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
      assetVault: '0x67d269191c92Caf3cD7723F116c85e6E9bf55933',
      bundlr: {
        currencyName: 'ethereum',
        nodeUrl: 'https://devnet.bundlr.network',
        providerUrl: 'https://rpc.ankr.com/eth_goerli',
        currencyContractAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      },
    }, // 
    {
      chainId: 1029,
      networkName: 'BTTC Testnet',
      networkShortName: 'BTTCT',
      zTokenAddress: '0x313F922BE1649cEc058EC0f076664500c78bdc0b',
      heritageTokenAddress: '0x6400809865E8aff1EfE04DFDD948DFb0619331c2',
      diamondDeployAddress: '0x72110750543dEf6905E6C28191e1386A7Fe3F7b5',
      assetVault: '0x3262EDbDc937ba054D74CCF3c1E39971c14B312B', //'0x550Ee8Cf39fd9754b0911dDfBA419a3f3919AE22',   // '0x6622BF6E8dfDA439D27A617d3367E638eEb2Dc92', //'0x6DbA1FCb75849aa8D66b1b8Fb64F50f7C004fDF2',
      bundlr: {
        currencyName: 'ethereum',
        nodeUrl: 'https://devnet.bundlr.network',
        providerUrl: 'https://rpc.ankr.com/eth_goerli',
        currencyContractAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      },
    },
    {
      chainId: 1313161555,
      networkName: 'Aurora Testnet',
      networkShortName: 'AuroraT',
      zTokenAddress: '0x313F922BE1649cEc058EC0f076664500c78bdc0b',
      heritageTokenAddress: '0xCdb63c58b907e76872474A0597C5252eDC97c883',
      diamondDeployAddress: '0x72110750543dEf6905E6C28191e1386A7Fe3F7b5',
      assetVault: '0x15BB2cc3Ea43ab2658F7AaecEb78A9d3769BE3cb', 
      bundlr: {
        currencyName: 'ethereum',
        nodeUrl: 'https://devnet.bundlr.network',
        providerUrl: 'https://rpc.ankr.com/eth_goerli',
        currencyContractAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      },
    }
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
