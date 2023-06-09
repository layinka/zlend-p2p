import { EventEmitter, Inject, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// import { Web3ModalService} from '@mindsorg/web3modal-angular';
import { Web3Provider , JsonRpcSigner} from '@ethersproject/providers';
import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnectProvider from '@walletconnect/web3-provider';
import Fortmatic from 'fortmatic';
import { BigNumber , constants, ethers, utils } from 'ethers';
import {BehaviorEventEmitter} from '../utils/BehaviorEventEmitter';
import { getSupportedChainById, getSupportedChainByChain } from '../models/supported-chains';
import { ZLend, ZLend__factory } from '../typechain-types';
import * as UAuthWeb3Modal from '@uauth/web3modal'
import UAuthSPA from '@uauth/js'
import UAuth from '@uauth/js'
import {normalizeToken} from '../utils/normalize';
const ERC20AbiJSON = require('../../assets/ERC20.json');



@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private _accountsObservable = new BehaviorSubject<string[]>([]);
  public readonly accounts$: Observable<string[]> = this._accountsObservable.asObservable();
  // ethers:  any;
  provider: any | undefined;
  ethersProvider: Web3Provider| undefined;
  ethersSigner: JsonRpcSigner| undefined;
  // accounts: string[] | undefined;
  // balance: string | undefined;

  web3Modal: Web3Modal ;

  @Output() onConnectChange: BehaviorEventEmitter<any> = new BehaviorEventEmitter(false);
  // @Output() onDisConnect: EventEmitter<void> = new EventEmitter();
  @Output() onNetworkChanged: EventEmitter<any> = new EventEmitter();

  infuraId = '8043bb2cf99347b1bfadfb233c5325c0';

  uauth:  UAuth;

  constructor() {

    // These options are used to construct the UAuthSPA instance.
    const uauthOptions = {
      clientID: "c50ea613-3d38-4526-a677-13480acc6a18",
      redirectUri: "http://localhost:3000",
      scope: "openid wallet"
    }


    const providerOptions = {
      coinbasewallet: {
        package: CoinbaseWalletSDK, 
        options: {
          appName: "ZLend",
          infuraId: this.infuraId 
        }
      },
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: this.infuraId, // required change this with your own infura id
          description: 'Scan the qr code and sign in',
          qrcodeModalOptions: {
            mobileLinks: [
              'rainbow',
              'metamask',
              'argent',
              'trust',
              'imtoken',
              'pillar'
            ]
          },
          // rpc: {
          //   56: 'https://bsc-dataseed.binance.org',
          // },
          // network: 'binance'

          // rpc: { 
          //   1337: 'http://localhost:8545', 
          // }, 
          // chainId: 1337
        }
      },
      fortmatic: {
        package: Fortmatic,
        options: {
          // Mikko's TESTNET api key
          key: "pk_test_391E26A3B43A3350",
          network: {
            rpcUrl: 'https://rpc-mainnet.maticvigil.com',
            chainId: 137
          }
        }
      },
      injected: {
        display: {
          logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
          name: 'metamask',
          description: "Connect with the provider in your Browser"
        },
        package: null
      },

      // Currently the package isn't inside the web3modal library. For now,
      // users must use this libary to create a custom web3modal provider.

      // All custom `web3modal` providers must be registered using the "custom-"
      // prefix.
      'custom-uauth': {
        // The UI Assets
        display: UAuthWeb3Modal.display,

        // The Connector
        connector: UAuthWeb3Modal.connector,

        // The SPA libary
        package: UAuthSPA,

        // The SPA libary options
        options: uauthOptions,
      },
    };

    this.web3Modal = new Web3Modal({
      // network: "mainnet", // optional change this with the net you want to use like rinkeby etc
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });

    // Register the web3modal so the connector has access to it.
    UAuthWeb3Modal.registerWeb3Modal(this.web3Modal)

    this.uauth = new UAuth(uauthOptions);

    const cachedProvider =   window.localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER');
    if (cachedProvider) {
      // console.log('Using Cached web3modal')      
      setTimeout(()=>{
        this.connect().then(()=>{
        
        })
      }, 200)
    }
  }

  get accounts(){
    return this._accountsObservable.getValue();
  }

  get signer(){
    return this.ethersSigner;
  }

  async connect() {
    this.provider = await this.web3Modal.connect(); // set provider
    
    if (this.provider) {
      this.ethersProvider = new Web3Provider(this.provider);
      this.ethersSigner = this.ethersProvider.getSigner();  
      
      this.createProviderHooks(this.provider);

      this._accountsObservable.next(await this.ethersProvider.listAccounts());
      this.onConnectChange.emit(true);
    } // create web3 instance
    
  }

  async getCurrentChainId(){
    const n = await this.ethersProvider?.getNetwork();
    return n?.chainId??83;
  }

  async getCurrentChain(){
    const chainId = await this.getCurrentChainId();
    return getSupportedChainById(chainId);
  }

  // async accountInfo(account: any[]){
  //   const initialvalue = await this.web3js.eth.getBalance(account);
  //   this.balance = this.web3js.utils.fromWei(initialvalue , 'ether');
  //   return this.balance;
  // }

  createProviderHooks(provider: any) {
    // Subscribe to accounts change
    provider.on('accountsChanged', async (accounts: string[]) => {
      this._accountsObservable.next(await this.ethersProvider!.listAccounts());
      this.onConnectChange.emit(true);  
      
    });

    // Subscribe to chainId change
    provider.on('chainChanged', (chainId: number) => {
      // location.reload();
      location.href = '/';
      //this.onConnectChange.emit(provider);
      this.onNetworkChanged.emit(chainId);
    });

    // Subscribe to provider connection
    provider.on('connect', (info: { chainId: number }) => {
      console.log(info);
      this.onConnectChange.emit(true);
      // location.reload();
    });

    // Subscribe to provider disconnection
    provider.on('disconnect', (error: { code: number; message: string }) => {
      console.log(error);
      console.log('disconnect')
      this.onConnectChange.emit(false);
    });

    // this.ethersProvider!.on("block", async (blockNum: number)=> {
    //   console.log("On Blocked - Block ",blockNum + ": " +new Date(Date.now()))
    //   const timestamp = (await this.ethersProvider!.getBlock(blockNum)).timestamp;

    //       console.log('Block timestamp: ', timestamp, ', date stamp: ', new Date().getTime()/1000 )
    // })
  }


  /**
   * Disconnect wallet button pressed.
   */
  async disconnect() {

    console.log("Killing the wallet connection", this.provider);

    // TODO: Which providers have close method?
    if(this.provider.close) {
      await this.provider.close();

      if (this.web3Modal.cachedProvider === 'custom-uauth') {
        await this.uauth.logout()
      }
      // If the cached provider is not cleared,
      // WalletConnect will default to the existing session
      // and does not allow to re-scan the QR code with a new wallet.
      // Depending on your use case you may want or want not his behavir.      
      await this.web3Modal.clearCachedProvider();
      
      // this.web3modalService.close();
      this.provider = null;
    }

    this._accountsObservable.next([]);
    this.onConnectChange.emit(false);
  }

  public async getDisplayAccountOrDomain(){
    if (this.web3Modal.cachedProvider === 'custom-uauth') {
      const user = await this.uauth.user();
      if(!user){
        return user.sub??'';
      }
    }
    return this.accounts[0]??'';
  }

  async switchNetwork(networkInfo: {
    chainId: number;
    chainName: string;
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number,
    };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
  }  ) {

    await this._switchNetwork(networkInfo);
  };

  async switchNetworkByChainId(newChain:  number ) {
    const c = getSupportedChainById(newChain);
    let networkInfo = {
      chainId: c?.chainId??83,
      chainName: c?.name??'',
      rpcUrls: c?.rpc??[],
      nativeCurrency: c?.nativeCurrency,
      blockExplorerUrls: c?.blockExplorerUrls
    };   
    await this._switchNetwork(networkInfo);
  };

  async switchNetworkByChainShortName(newChain:  string) {
    const c = getSupportedChainByChain(newChain.toUpperCase());
    
    let networkInfo = {
      chainId: c?.chainId??97,
      chainName: c?.name??'',
      nativeCurrency: c?.nativeCurrency,
      rpcUrls: c?.rpc??[],
      blockExplorerUrls: c?.blockExplorerUrls
    };   
    
    await this._switchNetwork(networkInfo);
  };

  private async  _switchNetwork(networkInfo:  {
    chainId: number;
    chainName: string;
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number,
    };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
  } ) {

    
    
    if(this.ethersProvider){
      try {
        
        //@ts-ignore
        await this.ethersProvider?.provider?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: utils.hexValue(networkInfo.chainId) }],
        });
        
        
      } catch (switchError: any) {
        console.error('web3provider not added to metamask::', switchError);
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            //@ts-ignore
            await this.ethersProvider.provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: utils.hexValue(networkInfo.chainId),
                  nativeCurrency: networkInfo.nativeCurrency,
                  chainName: networkInfo.chainName, //"Polygon",
                  rpcUrls: networkInfo.rpcUrls, // ["https://polygon-rpc.com/"],
                  blockExplorerUrls: networkInfo.blockExplorerUrls // ["https://polygonscan.com/"],
                },
              ],
            });
          } catch (addError) {
            console.error('Error adding network: ', addError)
            throw addError;
          }
        }
      }
    }else{
      console.info('Web3provider not instantiated::');
    }

  };

  public async getFeeData(){
    return await this.ethersProvider?.getFeeData();
  }


  public getERC20Contract (address: string) {
    
    const cContract = new ethers.Contract(address, ERC20AbiJSON.abi, this.ethersProvider);
    return cContract;
  }

  public getERC20ContractWithSigner (address: string) {
    
    const cContract = new ethers.Contract(address, ERC20AbiJSON.abi, this.ethersSigner);
    return cContract;
  }

  public async getERC20Details(address: string){
    try{
      let tokenInfo = await this.getERC20Contract(address);
      // @ts-ignore
      let result = { 
        name: await tokenInfo.name(),
        symbol: await tokenInfo.symbol(), 
        decimals: await tokenInfo.decimals(), 
        totalSupply: await tokenInfo.totalSupply() 
      }
      

      return result;
    }catch(e){
      return null;
    }
  }

  public async getERC20Balance(tokenAddressOrContract: string|ethers.Contract, walletAddress: string){
    if(typeof tokenAddressOrContract === 'string'){
      tokenAddressOrContract = await this.getERC20Contract(tokenAddressOrContract)
    }
    const balance = await tokenAddressOrContract.balanceOf( walletAddress);
    return balance;
  }


  public async getERC20ApprovalAllowance(tokenAddressOrContract: string|ethers.Contract, approvedAddress: string){
    if(typeof tokenAddressOrContract === 'string'){
      tokenAddressOrContract = await this.getERC20Contract(tokenAddressOrContract)
    }
    const allowance = await tokenAddressOrContract.allowance(this.accounts[0], approvedAddress);
    return allowance;
  }



  public async addTokenToMetamask (tokenAddress: string){
    const token = await this.getERC20Details(tokenAddress);
    
    const tokenSymbol = token.name;
    const tokenDecimals = token.decimals;
    
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await this.ethersProvider?.provider?.request({
        method: "wallet_watchAsset",
        params: [{
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: token.decimals, // The number of decimals in the token
            // image: tokenImage, // A string url of the token logo
          },
        }],
      });

      return !!wasAdded;
    } catch (error) {
      console.log(error);
    }
    return false;
  };


  public async approveERC20Contract(addressOrContract: string|ethers.Contract, addressToApprove: string, amount: any){
    if(typeof addressOrContract === 'string'){
      addressOrContract = await this.getERC20ContractWithSigner(addressOrContract)
    }

    const currAllowance = await this.getERC20ApprovalAllowance(addressOrContract,addressToApprove);
    if(currAllowance.gte(BigNumber.from(amount))){
      return 'succeeded';
    }else{
      let allowanceTx = await addressOrContract.approve(addressToApprove, amount ); // Approve 1000 times the fee
      let txResult = await allowanceTx.wait();
      return txResult.status == 1 ? 'succeeded' : 'failed';
    }
    
  }


  public async getCurrentUsersDeposit(addressOrContract: string|ZLend){

    if(typeof addressOrContract === 'string'){
      
      addressOrContract = ZLend__factory.connect(addressOrContract, this.ethersProvider!);
    }
    const account = this.accounts[0];
    const deposits = [];
    let balance = 0;
    const tokenAddressTracker = [];

    const noOfTokensLent = await addressOrContract.noOfTokensLent();

    if (Number(noOfTokensLent) > 0) {
      for (let i = 0; i < Number(noOfTokensLent); i++) {
        const currentTokenAddress = await addressOrContract.tokensLent(i, account);

        if (tokenAddressTracker.includes(currentTokenAddress)) {
          continue;
        }

        if (currentTokenAddress.toString() !== ethers.constants.AddressZero) { //  "0x0000000000000000000000000000000000000000"
          const currentToken = await addressOrContract.getTokenFrom(currentTokenAddress);
          

          const normalized = await normalizeToken(this.ethersProvider,addressOrContract,currentToken, account);

          balance += parseFloat(normalized.userTokenLentAmount.inDollars);

          if (Number(normalized.userTokenLentAmount.inDollars) > 0.0000000000001) {
            deposits.push(normalized);
            tokenAddressTracker.push(currentTokenAddress);
          }
          
        }
      }


    }
    return { deposits, balance };
  }

  public async getCurrentUsersLoans(addressOrContract: string|ZLend){

    if(typeof addressOrContract === 'string'){
      
      addressOrContract = ZLend__factory.connect(addressOrContract, this.ethersProvider!);
    }
    const account = this.accounts[0];
    const loans = [];
    let balance = 0;
    const tokenAddressTracker = [];

    const noOfTokensBorrowed = await addressOrContract.noOfTokensBorrowed();

    if (Number(noOfTokensBorrowed) > 0) {
      for (let i = Number(noOfTokensBorrowed) - 1; i >= 0; i--) {
        const currentTokenAddress = await addressOrContract.tokensBorrowed(i, account);

        if (tokenAddressTracker.includes(currentTokenAddress)) {
          continue;
        }

        if (currentTokenAddress.toString() !== ethers.constants.AddressZero) {
          const currentToken = await addressOrContract.getTokenFrom(currentTokenAddress);

          const normalized = await normalizeToken(this.ethersProvider,addressOrContract,currentToken, account);

          balance += parseFloat(normalized.userTokenBorrowedAmount.inDollars);


          if (Number(normalized.userTokenBorrowedAmount.amount) > 0) {
            loans.push(normalized);
            tokenAddressTracker.push(currentTokenAddress);
          }


        }
      }

    }
    return { loans, balance };
  }

  public async getTokensForDeposit(addressOrContract: string|ZLend){

    if(typeof addressOrContract === 'string'){
      
      addressOrContract = ZLend__factory.connect(addressOrContract, this.ethersProvider!);
    }
    const account = this.accounts[0];
    const depositAssets = []

    const tokens = await addressOrContract.getTokensForLendingArray();
    
    for (let i = 0; i < tokens.length; i++){
      const currentToken = tokens[i]

      const newToken = await normalizeToken(this.ethersProvider,addressOrContract,currentToken, account);

      depositAssets.push(newToken)


    }

    return depositAssets
  }

  public async getTokensForBorrowing(addressOrContract: string|ZLend){

    if(typeof addressOrContract === 'string'){
      
      addressOrContract = ZLend__factory.connect(addressOrContract, this.ethersProvider!);
    }
    const account = this.accounts[0];
    const assets = []

    const tokens = await addressOrContract.getTokensForBorrowingArray();
    
    for (let i = 0; i < tokens.length; i++){
      const currentToken = tokens[i]

      const newToken = await normalizeToken(this.ethersProvider,addressOrContract,currentToken, account);

      assets.push(newToken)


    }

    return assets
  }

}


