export interface Campaign{
    softCap: any; 
    hardCap: any; 
    saleStartTime: any; 
    saleEndTime: any; 
    listRate: any; 
    dexListRate: any; 
    liquidity: any; 
    liquidityReleaseTime: any; 
    totalParticipant: any; 
    useWhiteList: boolean; 
    
    purchaseTokenAddress: string;
    name: string; 
    symbol: string; 
    totalSupply: any; 
    tokenAddress: string; 
    minAllocationPerUser: any; 
    maxAllocationPerUserTierOne: any; 
    maxAllocationPerUserTierTwo: any; 
    campaignAddress: string; 
    logoUrl: string; 
    hasKYC: boolean; 
    isAudited: boolean; 
    auditUrl: string;
    totalCoinReceived: any; 
    owner: string; 
    /**
     * IPFS CID For Description Html
     */
    description: string;
    status: any;
    twitter: any;
    website: any;
    discord: any;
    telegram: any;
    tierOneHardCap: any,
    tierTwoHardCap: any,
}