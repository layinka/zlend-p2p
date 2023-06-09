
import { Component, OnInit, ViewChild, Injectable, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators,  ValidatorFn, ValidationErrors, CheckboxRequiredValidator } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { Web3Service } from 'src/app/services/web3.service';
import {Location} from '@angular/common';
import { ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { WizardComponent } from 'angular-archwizard';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { BigNumber , constants, Contract, ethers, utils, Signer } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppToastComponent } from 'src/app/views/notifications/toasters/toast-simple/toast.component';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

const ViewStateFacetABI = require('../../../../assets/ViewStateFacet.json');
const VaultOwnerAssetFacetABI = require('../../../../assets/VaultOwnerAssetFacet.json');
const AssetVaultListABI = require('../../../../assets/AssetVaultList.json');


// import { AppToastComponent } from '../../toast/toast.component';

@Component({
  selector: 'app-create-vault',
  templateUrl: './create-vault.component.html',
  styleUrls: ['./create-vault.component.scss']
})
export class CreateVaultComponent implements OnInit {

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

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    defaultParagraphSeparator: '',
    sanitize: true,
  };


  signatories = [
      {

        exists: true,
        minimumDiggingFee: '10',
        cursedBond: '0',
        freeBond: '5000',
        maximumRewrapInterval: '30',
        bounty: 6,
        address: '0x088ab9cf56767676',       

      },
      {
        exists: true,
        minimumDiggingFee: '3.7',
        cursedBond: '0',
        freeBond: '1000',
        maximumRewrapInterval: '30',
        bounty: 4,
        address: '0x088ab9cf56767676c5456'

      }
    ];
  selectedSignatory: any;

  web3ServiceConnect$: Subscription|undefined;
  userChain: string|null = 'mtrt';
  currentChainId: any; 

  diamondProxyDetails: any;
  diamondProxyAddress: string|undefined = undefined;
  heritageTokenAddress: string = '';

  heritageTokenBalance;

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

      // console.log('hxstrip: ', ethers.utils.hexStripZeros('0x0000000000000000000000000000000000000000000000000000000000000003').replace('0x', ''))
      // console.log('stripz: ', ethers.utils.stripZeros('0x0000000000000000000000000000000000000000000000000000000000000003'))

      this.web3ServiceConnect$ = this.web3Service.onConnectChange.subscribe(async (connected: boolean)=>{
        
        if(connected){
           if(this.userChain && this.userChain!='d' ){
            await this.web3Service.switchNetworkByChainShortName(this.userChain); 
          }else{
            this.userChain = (await this.web3Service.getCurrentChain())?.chain??'';
            this.updateURLWithNewParamsWithoutReloading()
          }

          this.currentChainId = await this.web3Service.getCurrentChainId();
          
          // this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency;
          //this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency.symbol??'Coin';
          this.diamondProxyDetails = environment.contractAddresses.find(f=>f.chainId== this.currentChainId);

          this.diamondProxyAddress= this.diamondProxyDetails.assetVault;
          this.heritageTokenAddress= this.diamondProxyDetails.heritageTokenAddress;

          const viewStateContract = new Contract(this.diamondProxyAddress!, AssetVaultListABI, this.web3Service.signer);

          // const vL = await viewStateContract.getVaultOwnerAssetVaults(this.web3Service.accounts[0]);
          // console.log('vL: ', vL);
          const signatoryAddresses= await viewStateContract.getSignatoryProfileAddresses();
          

          this.signatories=[];
          await Promise.all(
            signatoryAddresses
              .map(async (element, index) => {
                const result = await viewStateContract.getSignatoryProfile( element);
                if(result){
                  this.signatories.push({
                    // ...result,
                    exists: result.exists,
                    minimumDiggingFee: ethers.utils.formatUnits(result.minimumDiggingFee, 18),
                    cursedBond: ethers.utils.formatUnits(result.cursedBond, 18),
                    freeBond: ethers.utils.formatUnits(result.freeBond, 18),
                    maximumRewrapInterval: ethers.utils.formatUnits(result.maximumRewrapInterval, 0),
                    bounty: 1,
                    address: element
                  });            
                }
                
              })
          );

          this.heritageTokenBalance = ethers.utils.formatEther( await this.web3Service.getERC20Balance(this.heritageTokenAddress, this.web3Service.accounts[0]) )

                    

          // const s1 = signatories.map((s: any) => {
          //   return {
          //     address: s.address,
          //   diggingFee: ethers.utils.formatUnits(s.minimumDiggingFee, 18),
          //   bounty: 1
          //   }
          // })

          // console.log('signatories profiles2: ', s1);
          
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
      resurrectionTime: ['Dec 23, 2022 00:00:00', [Validators.required]],
      beneficiaryPubKey: ['0x047bf824b28c4bf11ce553fa746a18754949ab4959e2ea73465778d14179211f8c87f456ff40773aafed961a226e0bfa251547013a81c24951a733f65cfed8dc5e', [Validators.required]], // 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199
      beneficiaryName: ['Lasun', [Validators.required]],
      beneficiaryEmail: ['bene@email.com', [Validators.required,Validators.email]],
      beneficiaryPercent: [100, [Validators.required,Validators.min(0), Validators.max(100)]]
    })

    // this.signatories = [
    //   {
    //     address: '0x088ab9cf56767676',
    //     diggingFee: 1.07,
    //     bounty: 6,

    //   }
    // ]

  }

  updateURLWithNewParamsWithoutReloading() {
    // const params = new HttpParams().appendAll({
        
    //     chain: this.userChain!
    // });

    // this.location.replaceState(
    //     location.pathname,
    //     params.toString()
    // );

    const url = this.router.createUrlTree(['vaults', this.userChain, 'create-vault']).toString()

    this.location.go(url);
  }

  

  ngOnDestroy(): void {
    
    this.formSubscriptions.forEach( sub=>{
      sub.unsubscribe();
    } )

    this.web3ServiceConnect$!.unsubscribe();

    
  }


  setVaultType(value: any){
    this.mainFormGroup.patchValue({ vaultType: value });
  }

  setSignatory(value: any){
    this.selectedSignatory=value;
  }

  async approveToken(){
    /** spinner starts on init */
    this.spinner.show();
    try{
      
      const currentChainId = await this.web3Service.getCurrentChainId();
      const result = await this.web3Service.approveERC20Contract(this.heritageTokenAddress, this.diamondProxyAddress!, constants.MaxUint256)
      this.spinner.hide();
      this.showToast('Approved!', 'Approved');
      return true;
    }catch(err){
      this.showToast('Oops!','Something went wrong!', 'danger');
    }
    finally{
      this.spinner.hide();
    }

    return false;
    
  }

  async checkHeritageTokenAllowance(){
    try{
      const allowance = await this.web3Service.getERC20ApprovalAllowance(this.heritageTokenAddress, this.diamondProxyAddress!);
      
      return  allowance.gt(constants.Zero);
      
    }catch(err){
      console.error('Error gting erc20 details:', err, new Date())
    }
    return false;
  }


  async submitCreateVault(){
    const currentChain = await this.web3Service.getCurrentChain();
    const currentChainId = currentChain!.chainId;

    if(! this.selectedSignatory ){
      alert('Select Signatory first');
      return;
    }


    const allowed = await this.checkHeritageTokenAllowance();
    



    if(!await this.checkHeritageTokenAllowance() ){
      const approved = await this.approveToken();
      
      if(!approved){
        return;
      }
    }
  
    this.spinner.show();

    const vaultOwnerAssetContract = new Contract(this.diamondProxyAddress!, AssetVaultListABI, this.web3Service.signer);
     
    const now = new Date();
    const nowTimeStamp = Math.floor(now.getTime() / 1000)
    const cvData = {
       name: this.mainFormGroup.get('vaultLabel')?.value,
       beneficiaries:[
       {
         /*
          address  beneficiaryAddress; 
      uint256  percent; // % multiplied by 100 e.g 25% is 2500
      string name;  
      bool claimed; 
         */

         beneficiaryAddress: ethers.utils.computeAddress(this.mainFormGroup.get('beneficiaryPubKey')?.value),
         percent: (100 * this.mainFormGroup.get('beneficiaryPercent')?.value).toFixed(0),
         name: this.mainFormGroup.get('beneficiaryName')?.value,
         claimed: false
       }
       ],
       timestamp: nowTimeStamp
    } 

    const sigData = [
      {
        /*
        address signatoryAddress;
        uint256 diggingFee;
        bytes32 unencryptedShardDoubleHash;
        uint8 v;
        bytes32 r;
        bytes32 s;*/
        signatoryAddress: this.selectedSignatory.address,
        unencryptedShardDoubleHash: ethers.utils.formatBytes32String(""),
        diggingFee: ethers.utils.parseUnits(this.selectedSignatory.minimumDiggingFee, 18),
        v: 0,
        r: ethers.utils.formatBytes32String(""),
        s: ethers.utils.formatBytes32String("")
      }
    ]

    // const utcDate = new Date(new Date(this.mainFormGroup.get('resurrectionTime')?.value).toUTCString().slice(0, -4))
    // console.log('utcDate.getTime() :', utcDate.getTime()  , ', div100: ' ,(utcDate.getTime() / 1000.0) , ', nozero: ', (utcDate.getTime() / 1000))


    const expiry = Math.floor( new Date(this.mainFormGroup.get('resurrectionTime')?.value).getTime() / 1000.0);
    
    
    let tx;

    const gasFeeData = await this.web3Service.getFeeData().catch(()=>{});

    let options ;
    if(gasFeeData){
      options = {
        //value: utils.parseEther(currentChain!.creationFee.toString()),
        gasLimit: 18000000,
        maxFeePerGas: gasFeeData.maxFeePerGas,// should use gasprice for bsc/bttc, since it doesnt support eip 1559 yet
        maxPriorityFeePerGas: gasFeeData.maxPriorityFeePerGas
      }
    }else{
      options = {
        // value: utils.parseEther(currentChain!.creationFee.toString()),
        gasLimit: 18000000
      }
    }

    try{

      
      tx = await vaultOwnerAssetContract.createAssetVault(
        cvData, 
        sigData,
        expiry,
        options
      );

      
      //Wait for the transaction to be mined...
      const txResult = await tx.wait();
      this.showToast('Success!','Vault Created succesfully');

      try{
        const vaultId = txResult.events.filter((f: any)=>f.event=='AssetVaultCreated')[0].args['vaultId'];

        console.log('VaultId: ', vaultId);
        this.router.navigate(['/vaults', 'view',  ethers.utils.hexStripZeros(vaultId).replace('0x', '')]); 
      }catch(errorEvent){
        console.error('Error getting event', txResult.events, ', ', errorEvent);
      }
                 
      this.spinner.hide();


    }catch(err){
      try{
        console.error( tx);
      }catch(e1){
        console.error('Error tx: ', e1)
      }
      console.error('error creating vault: ', err)
      this.showToast('Oops!','Vault Creation Failed', 'danger');      
    }
    this.spinner.hide();
    
  }

  // Showing of Toast
  showToast(title: string, body: string, color='info') {
    const options = {
      title,
      delay: 5000,
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

function signMessage() {
  
}

