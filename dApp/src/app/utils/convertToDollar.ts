
export const convertToDollar = async (contract, amount, tokenAddress) => {
  
  const amountInDollars = await contract.getAmountInDollars(amount, tokenAddress);

  return Number(amountInDollars);
};
