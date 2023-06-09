export const environment = {
  production: true,
  BaseApiUrl: 'https://zsapi.zarclays.com',
  web3StorageToken: '',
  contractAddresses : [ 
    {
      chainId: 1029,
      networkName: 'BTTC Testnet',
      networkShortName: 'BTTCT',
      heritageTokenAddress: '0x6400809865E8aff1EfE04DFDD948DFb0619331c2',
      diamondDeployAddress: '0x72110750543dEf6905E6C28191e1386A7Fe3F7b5',
      assetVault: '0x3262EDbDc937ba054D74CCF3c1E39971c14B312B', //'0x550Ee8Cf39fd9754b0911dDfBA419a3f3919AE22',   // '0x6622BF6E8dfDA439D27A617d3367E638eEb2Dc92', //'0x6DbA1FCb75849aa8D66b1b8Fb64F50f7C004fDF2',
      bundlr: {
        currencyName: 'ethereum',
        nodeUrl: 'https://devnet.bundlr.network',
        providerUrl: 'https://rpc.ankr.com/eth_goerli',
        currencyContractAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      },
    }
  ]
};
