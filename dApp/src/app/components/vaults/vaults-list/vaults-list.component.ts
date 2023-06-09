
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
  selector: 'app-vaults-list',
  templateUrl: './vaults-list.component.html',
  styleUrls: ['./vaults-list.component.scss']
})
export class VaultsListComponent implements OnInit {


// @ViewChild('wizard') wizard!: WizardComponent;



formSubscriptions: Subscription[]=[]; 

placement = ToasterPlacement.TopCenter;

isWalletSigned= false;

@ViewChild(ToasterComponent) toaster!: ToasterComponent;

  
  

  vaults ;

  web3ServiceConnect$: Subscription|undefined;
  userChain: string|null = 'mtrt';
  currentChainId: any; 

  diamondProxyDetails: any;
  diamondProxyAddress: string|undefined = undefined;
  heritageTokenAddress: string = '';
  
  viewStateContract;

  nativeCoin;
  coinBalance= '0'


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
      

      this.web3ServiceConnect$ = this.web3Service.onConnectChange.subscribe(async (connected: boolean)=>{
        
        if(connected){
          //  if(this.userChain && this.userChain!='d' ){
          //   await this.web3Service.switchNetworkByChainShortName(this.userChain); 
          // }else {
          //   this.userChain = (await this.web3Service.getCurrentChain())?.chain??'';

          //   // this.updateURLWithNewParamsWithoutReloading()
          // }

          this.userChain = (await this.web3Service.getCurrentChain())?.chain??'';

          this.currentChainId = await this.web3Service.getCurrentChainId();
          this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency;

          
          //this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency.symbol??'Coin';
          this.diamondProxyDetails = environment.contractAddresses.find(f=>f.chainId== this.currentChainId);

          this.diamondProxyAddress= this.diamondProxyDetails.assetVault;
          this.heritageTokenAddress= this.diamondProxyDetails.heritageTokenAddress;

          this.viewStateContract = new Contract(this.diamondProxyAddress!, AssetVaultListABI, this.web3Service.signer);

          
          const vaults = await this.viewStateContract.getMyVaults();

          

          // this.coinBalance =ethers.utils.formatEther( await this.web3Service.ethersProvider!.getBalance(this.vaultAddress) );

          
          this.vaults=[];
          await Promise.all(
            vaults 
              .map(async (element, index) => {
                const assetVaultContract = new Contract(element, HeritageAssetWillVaultABI, this.web3Service.signer);
                this.vaults.push({
                  vaultId: ethers.utils.hexStripZeros(await assetVaultContract._vaultId()).replace('0x', '')  ,
                  name: await assetVaultContract._name(),
                  address: element,
                  expiryTimeJSDate: getDateFromEther(await assetVaultContract._expiryTime()),
                  expiryTime: formatEtherDateToJs(await assetVaultContract._expiryTime())
                });  
               
              })            
          );

                       
          
        }

      });      
    })

    this.titleService.setTitle('Create Vault | Heritage');



  }

  updateURLWithNewParamsWithoutReloading() {

    const url = this.router.createUrlTree(['vaults', 'list' , this.userChain]).toString()

    this.location.go(url);
  }

  

  ngOnDestroy(): void {
    
    

    this.web3ServiceConnect$!.unsubscribe();

    
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
