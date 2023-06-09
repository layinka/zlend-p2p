import { Component, OnInit , ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router,Params } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { Web3Service } from '../../../services/web3.service';
import contractList from '../../../models/contract-list';
import {getDateFromEther, formatEtherDateToJs, formatDateToJsString} from '../../../utils/date';
import {formatPercent} from '../../../utils/numbers'
import {Contract, ethers, utils} from 'ethers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { cilList, cilShieldAlt } from '@coreui/icons';
import { ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { AppToastComponent } from '../../../views/notifications/toasters/toast-simple/toast.component';
import { NgxSpinnerService } from "ngx-spinner";

import {Location} from '@angular/common';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { IconSetService } from '@coreui/icons-angular';
import { brandSet,  freeSet } from '@coreui/icons';

const keccak256 = require('keccak256');
const ViewStateFacetABI = require('../../../../assets/ViewStateFacet.json');
const VaultOwnerAssetFacetABI = require('../../../../assets/VaultOwnerAssetFacet.json');
const HeritageAssetWillVaultABI = require('../../../../assets/HeritageAssetWillVault.json');
const AssetVaultListABI = require('../../../../assets/AssetVaultList.json');


@Component({
  selector: 'app-view-vault',
  templateUrl: './view-vault.component.html',
  styleUrls: ['./view-vault.component.scss']
})
export class ViewVaultComponent implements OnInit {


// @ViewChild('wizard') wizard!: WizardComponent;

mainFormGroup!: FormGroup;

formSubscriptions: Subscription[]=[]; 

placement = ToasterPlacement.TopCenter;

isWalletSigned= false;

@ViewChild(ToasterComponent) toaster!: ToasterComponent;

  
  
  validationMessages : {
    [index: string] : any
  } = {

    "vaultType":{
      required: "Required"
    },
    "vaultLabel":{
      required: "Required"
    },
    "payLoad":{
      required: "Required"
    },
    "resurrectionTime":{
      required: "Required"
    },
    "beneficiaryPubKey":{
      required:"Required"
    },
    "beneficiaryName":{
      required:"Required"
    },
    "beneficiaryEmail":{
      required:"Required",
      email:"Valid Email Required",
    },
    "email":{
      required:"Required",
      email:"Valid Email Required",
    },
    "beneficiaryPercent" : {
      required:"Required",
      min:"Min is 0",
      max:"Max is 100",
    }
   }



  signatories = [];
  selectedSignatory: any;

  beneficiaries = [];

  web3ServiceConnect$: Subscription|undefined;
  userChain: string|null = 'mtrt';
  currentChainId: any; 

  diamondProxyDetails: any;
  diamondProxyAddress: string|undefined = undefined;
  heritageTokenAddress: string = '';
  vaultId='';
  vaultAddress='';
  assetVaultContract ;
  viewStateContract;

  vault;
  nativeCoin;
  coinBalance= '0'

  isSignatory=false;
  isBeneficiary=false;
  isOwner = false;

  hasClaimed = false;

  expiryTime ;

  constructor(private titleService: Title,
    public web3Service: Web3Service,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private location: Location,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      this.userChain = params['chain'];
      this.vaultId = params['vaultId'];

      this.web3ServiceConnect$ = this.web3Service.onConnectChange.subscribe(async (connected: boolean)=>{
        
        if(connected){
           if(this.userChain && this.userChain!='d' ){
            await this.web3Service.switchNetworkByChainShortName(this.userChain); 
          }else{
            this.userChain = (await this.web3Service.getCurrentChain())?.chain??'';
            this.updateURLWithNewParamsWithoutReloading()
          }

          this.currentChainId = await this.web3Service.getCurrentChainId();
          this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency;

          
          //this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency.symbol??'Coin';
          this.diamondProxyDetails = environment.contractAddresses.find(f=>f.chainId== this.currentChainId);

          this.diamondProxyAddress= this.diamondProxyDetails.assetVault;
          this.heritageTokenAddress= this.diamondProxyDetails.heritageTokenAddress;

          this.viewStateContract = new Contract(this.diamondProxyAddress!, AssetVaultListABI, this.web3Service.signer);

          
          this.vaultAddress = await this.viewStateContract.getAssetVault( ethers.utils.hexZeroPad(ethers.utils.hexlify( parseInt(this.vaultId)), 32)  ); // ethers.utils.formatBytes32String(this.vaultId)
          
          this.assetVaultContract = new Contract(this.vaultAddress!, HeritageAssetWillVaultABI, this.web3Service.signer);

          
          console.log( 'My Vaults: ', await this.viewStateContract.getMyVaults());

          this.vault= {
            vaultId: this.vaultId,
            name: await this.assetVaultContract._name(),
            address: this.vaultAddress,
            expiryTimeJSDate: getDateFromEther(await this.assetVaultContract._expiryTime()),
            expiryTime: formatEtherDateToJs(await this.assetVaultContract._expiryTime())
          }

          this.coinBalance =ethers.utils.formatEther( await this.web3Service.ethersProvider!.getBalance(this.vaultAddress) );

          const userWallet = this.web3Service.accounts[0];

          this.isSignatory = await this.assetVaultContract.isSignatory(userWallet);

          this.isOwner = userWallet == await this.assetVaultContract.owner();

          this.beneficiaries=[];
          const beneficiariesCount= await this.assetVaultContract._beneficiaryCount();



          await Promise.all(
            Array(parseInt( ethers.utils.formatUnits( beneficiariesCount, 0)))
              .fill(undefined)  
              .map(async (element, index) => {
                const beneficiary = await this.assetVaultContract._beneficiaries(index);
                
                if(beneficiary){
                  this.beneficiaries.push({
                    // ...result,
                    ...beneficiary,
                    percent: parseFloat(ethers.utils.formatUnits(beneficiary.percent, 0))/ 100.0
                  });            
                }

                // console.log('this.beneficiaries: ', this.beneficiaries)

                
              })            
          );

          this.isBeneficiary = this.beneficiaries.findIndex(f=>f.beneficiaryAddress==userWallet)!= -1 ;

          // if(!this.isBeneficiary && !this.isOwner && !this.isSignatory){

          // }
          
          this.signatories=[];
          const signatoriesCount= await this.assetVaultContract._signatoriesCount();

          await Promise.all(
            Array(parseInt( ethers.utils.formatUnits( signatoriesCount, 0)))
              .fill(undefined)  
              .map(async (element, index) => {
                const signatoryAddress = await this.assetVaultContract._signatories(index);
                const signatory = await this.viewStateContract.getSignatoryProfile( signatoryAddress);
                if(signatory){
                  this.signatories.push({
                    // ...result,
                    exists: signatory.exists,
                    minimumDiggingFee: ethers.utils.formatUnits(signatory.minimumDiggingFee, 18),
                    cursedBond: ethers.utils.formatUnits(signatory.cursedBond, 18),
                    freeBond: ethers.utils.formatUnits(signatory.freeBond, 18),
                    maximumRewrapInterval: ethers.utils.formatUnits(signatory.maximumRewrapInterval, 0),
                    bounty: 1,
                    address: signatoryAddress
                  });            
                }

                
              })            
          );

          // await this.deceiveTime();
          
        }

      });      
    })

    this.titleService.setTitle('Create Vault | Heritage');



    // mainForm Group
    this.mainFormGroup = this.fb.group({
      vaultType: ['Custodial',  [Validators.required]],
      vaultLabel: ['Vault1',  [Validators.required]],
      email: ['email@email.com', [Validators.required,Validators.email]],
      payLoad: ['',  [/*Validators.required*/]],
      resurrectionTime: ['Dec 23, 2022', []],
      beneficiaryPubKey: ['0x047bf824b28c4bf11ce553fa746a18754949ab4959e2ea73465778d14179211f8c87f456ff40773aafed961a226e0bfa251547013a81c24951a733f65cfed8dc5e', [Validators.required]], // 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199
      beneficiaryName: ['Lasun', [Validators.required]],
      beneficiaryEmail: ['bene@email.com', [Validators.required,Validators.email]],
      beneficiaryPercent: [100, [Validators.required,Validators.min(0), Validators.max(100)]]
    })

  }

  updateURLWithNewParamsWithoutReloading() {

    const url = this.router.createUrlTree(['vaults', 'view', this.userChain, this.vaultId]).toString()

    this.location.go(url);
  }

  

  ngOnDestroy(): void {
    
    this.formSubscriptions.forEach( sub=>{
      sub.unsubscribe();
    } )

    this.web3ServiceConnect$!.unsubscribe();

    
  }

  async topup(){
    
    alert(`To Topup, send your Assets to ${this.vault.address}`)
  }



  async submitRefresh(){
    
    this.spinner.show();
    try{
      const result = await this.assetVaultContract.refresh();
      this.spinner.hide();
      this.showToast('Extended!', "This Vault's asset will remain in the Asset bag for another 30 days");
      
    }catch(err){
      this.showToast('Oops!','Something went wrong!', 'danger');
    }
    finally{
      this.spinner.hide();
    }
  }

  async releaseAssets(){
    this.spinner.show();
    if(new Date() < this.vault.expiryTimeJSDate ){
      this.showToast('Oops!','Expiry Time has not yet been reached!', 'danger');
      this.spinner.hide();
      return;
    }
    try{
      const result = await this.assetVaultContract.signToRelease();
      this.spinner.hide();
      this.showToast('Signed!', "This Vault's asset can be claimed by the Beneficiaries now provided all other Signatories have also signed");
      
    }catch(err){
      this.showToast('Oops!','Something went wrong!', 'danger');
    }
    finally{
      this.spinner.hide();
    }
  }

  async claimAssets(){
    this.spinner.show();
    if(new Date() < this.vault.expiryTimeJSDate ){
      this.showToast('Oops!','Expiry Time has not yet been reached!', 'danger');
      this.spinner.hide();
      return;
    }
    try{
      // const result = await this.assetVaultContract.claimAmount(ethers.constants.AddressZero, ethers.utils.parseEther('450'));

      const result = await this.assetVaultContract.claim(ethers.constants.AddressZero);
      
      this.spinner.hide();
      this.showToast('Claimed!', "This Vault's asset has been sent to your Wallet");
      this.hasClaimed=true;
    }catch(err){
      this.showToast('Oops!','Something went wrong!', 'danger');
    }
    finally{
      this.spinner.hide();
    }
  }

  async deceiveTime(){
    this.spinner.show();
    
    try{
      const result = await this.assetVaultContract.modifyDate();
      this.spinner.hide();
      this.showToast('Deceived!', "This Vault's resurrection Time has been altered");
      
    }catch(err){
      this.showToast('Oops!','Something went wrong!', 'danger');
    }
    finally{
      this.spinner.hide();
    }
  }


  showToast(title: string, body: string, color='info') {
    const options = {
      title,
      delay: 7000,
      placement: this.placement,
      color,
      autohide: true,
      body
    }
    const componentRef = this.toaster.addToast(AppToastComponent, { ...options});
  }

  

  objectKeys(o: any){
    if(!o){
      return []
    }
    return Object.keys(o)
  }

}
