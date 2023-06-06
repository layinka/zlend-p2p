# ZLend 
## DeFi Lending DApp
DeFi Lending platform which lets you lend, borrow crypto assets and helps you earn some passive income as interest on your deposits.

Depositors are rewarded with zLend tokens for depositing into the Lending Pool. Depositors will also be able to share from the interest made on the platforms from loans.

## Networks supported
zLend aims to be multichain. Current networks supported are

- Polygon testnet
- Klaytyn Testnet
- XDC(XinFin) Apothem Testnet


# Features
1. Supported tokens are dependent on Network
2. Depositors supply some tokens to the pool to provide liquidity or collateral for loans.
3. Depositors get rewarded with ZLend token when they supply to the pool. Reward is calculated based on the token amount in dollars users supplied to the pool.
4. To borrow from the pool, User has to deposit collateral. Loans are over collaterized, and LTV (Loan To Value) ratio varies from coin to coin.
5. The contract currently supports only stable APY rate for all tokens that can be borrowed.
6. On debt repayment, the interest and token borrowed is retrieved from the user. Interest is calculated based on stable APY rate. 
7. After repayment, user can withdraw the tokens staked as collateral from lending pool.
8. On withdrawal from lending pool, contract also collects some ZLend tokens rewarded to the user. The ZLend token that will be collected from the user is equivalent in value to the amount of token user wants to withdraw.

# Tools
1. **Open Zeppelin**
2. **Chainlink**: The contract uses the AggregatorV3Interface of chainlink to fetch real time price feeds.
3. **Hardhat**
4. **Ethers Js** 
5. **Angular**
6. **Bootstrap**
7. **Wallet Connect/ Coinbase wallet/ Web3Modal/Unstoppable Domains**
8. **web3.js**



# How to use
1. Deploy solidity smart contract to all Networks ( check Contracts folder readme for deploy instructions)
2. Update DAPP with Contract addresses (/models/contract-list)
3. Run Dapp (Check Dapp folder readme for run instructions)
```
ng serve
```
 

