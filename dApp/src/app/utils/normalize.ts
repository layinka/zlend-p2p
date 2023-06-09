// import ade from "../abis/ADE.json";
// import dai from "../assets/dai.svg";
// import weth from "../assets/weth.svg";
// import link from "../assets/chainlink.svg";
// import fau from "../assets/fau_2.png";

import { BigNumber , constants, Contract, ethers, utils } from 'ethers';
import {  BigNumberish } from 'ethers';

const ERC20AbiJSON = require('../../assets/ERC20.json');
// const tokenImages = {
//   DAI: dai,
//   WETH: weth,
//   LINK: link,
//   FAU: fau,
// };










export const normalizeToken = async (provider, contract, currentToken, account) => {
  const fromWei = (amount: BigNumberish) => {
    
    try{
      return ethers.utils.formatUnits(amount, 18);
    }catch{
      console.error('error fromweing ', amount)
      return '0';
    }
  };
  
  

  const tokenInst = new ethers.Contract(currentToken.tokenAddress, ERC20AbiJSON.abi, provider);
  if(!tokenInst){
    return undefined;
  }

  const decimals = await tokenInst.decimals();

  const walletBalance = await tokenInst.balanceOf(account);
  
  const totalSuppliedInContract = await contract.getTotalTokenSupplied(currentToken.tokenAddress);
  const totalBorrowedInContract = await contract.getTotalTokenBorrowed(currentToken.tokenAddress);
  
  
  let utilizationRate =ethers.constants.Zero;
  if(  !totalSuppliedInContract.isZero()){
    utilizationRate = totalBorrowedInContract.mul(100).div(totalSuppliedInContract).toString();

  }
  
  const userTokenBorrowedAmount = await contract.tokensBorrowedAmount(currentToken.tokenAddress, account);
  
  const userTokenLentAmount = await contract.tokensLentAmount(currentToken.tokenAddress, account);
  
  const userTotalAmountAvailableToWithdrawInDollars = await contract.getTokenAvailableToWithdraw(account);
  
  const userTotalAmountAvailableForBorrowInDollars = await contract.getUserTotalAmountAvailableForBorrowInDollars(account);
  
  const walletBalanceInDollars = await contract.getAmountInDollars(walletBalance, currentToken.tokenAddress);
  
  const totalSuppliedInContractInDollars = await contract.getAmountInDollars(totalSuppliedInContract, currentToken.tokenAddress);
  
  const totalBorrowedInContractInDollars = await contract.getAmountInDollars(totalBorrowedInContract, currentToken.tokenAddress);
  
  const userTokenBorrowedAmountInDollars = await contract.getAmountInDollars(userTokenBorrowedAmount, currentToken.tokenAddress);
  
  const userTokenLentAmountInDollars = await contract.getAmountInDollars(userTokenLentAmount, currentToken.tokenAddress);
  
  const availableAmountInContract = totalSuppliedInContract.sub(totalBorrowedInContract).toString();
  
  const availableAmountInContractInDollars = await contract.getAmountInDollars(availableAmountInContract, currentToken.tokenAddress);
  
  const result = await contract.oneTokenEqualsHowManyDollars(currentToken.tokenAddress);
  
  const price = result[0];
  const decimal = +ethers.utils.formatUnits(result[1], 0);

  
  // const oneTokenToDollar = ethers.utils.parseUnits(`${price}`, 18).div((10 ** decimal).toString() ).toString();
  // const oneTokenToDollar = BigNumber.from(`${price}`).div(10 ** decimal).toString();

  const oneTokenToDollar =(parseFloat(`${price}`)/(10 ** decimal)).toString();
  
  return {
    name: currentToken.name,
    // image: tokenImages[currentToken.name],
    tokenAddress: currentToken.tokenAddress,
    userTotalAmountAvailableToWithdrawInDollars: fromWei(userTotalAmountAvailableToWithdrawInDollars),
    userTotalAmountAvailableForBorrowInDollars: fromWei(userTotalAmountAvailableForBorrowInDollars),
    walletBalance: {
      amount: fromWei(walletBalance),
      inDollars: fromWei(walletBalanceInDollars),
    },
    totalSuppliedInContract: {
      amount: fromWei(totalSuppliedInContract),
      inDollars: fromWei(totalSuppliedInContractInDollars),
    },
    totalBorrowedInContract: {
      amount: fromWei(totalBorrowedInContract),
      inDollars: fromWei(totalBorrowedInContractInDollars),
    },
    availableAmountInContract: {
      amount: fromWei(availableAmountInContract),
      inDollars: fromWei(availableAmountInContractInDollars),
    },
    userTokenBorrowedAmount: {
      amount: fromWei(userTokenBorrowedAmount),
      inDollars: fromWei(userTokenBorrowedAmountInDollars),
    },
    userTokenLentAmount: {
      amount: fromWei(userTokenLentAmount),
      inDollars: fromWei(userTokenLentAmountInDollars),
    },
    LTV: fromWei(currentToken.LTV),
    borrowAPYRate: fromWei(currentToken.stableRate),
    utilizationRate: utilizationRate,
    oneTokenToDollar,
    decimals
  }
}