import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import contractList from 'src/app/models/contract-list';
import { Web3Service } from 'src/app/services/web3.service';
import { ZLend, ZLend__factory } from 'src/app/typechain-types';
import { toDp } from 'src/app/utils/numbers';
import { ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { ethers } from 'ethers';
import { AppToastComponent } from 'src/app/views/notifications/toasters/toast-simple/toast.component';

@Component({
  selector: 'your-deposits',
  templateUrl: './your-deposits.component.html',
  styleUrls: ['./your-deposits.component.scss']
})
export class YourDepositsComponent implements OnInit {


  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  placement = ToasterPlacement.TopCenter;

  deposits: any;

  web3ServiceConnect$: Subscription|undefined;
  userChain: string|null = 'pol';
  currentChainId: any;
  nativeCoin= '';

  selectedToken: any;

  zLendContract: ZLend|undefined;
  
  

  depositCoinModalVisible = false;
  assetDetailsModalVisible=false;

  withdrawModalVisible=false;

  depositFormGroup: FormGroup;
  withdrawFormGroup: FormGroup;

  validationMessages : {
    [index: string]: any
   } = {
    'amount': {
      'required'  :   'Amount is Required.',
      'min': 'Amount must be at least 0 ',
      'max': 'Amount must be at most 100 '
    },
    'startDate' : {
       'required'  :   'Start Date is Required.',
       'past': 'Start Date can not be in the past'
     },
     'endDate' : {
       'required'  :   'End Date is Required.',
       'past': 'End Date can not be in the past',
       //'less': 'End date cannot be less than Start date'
       // 'pattern'   :   'Contact No. should only contain Numbers '
     },
     
   };


  constructor( public web3Service: Web3Service,private spinner: NgxSpinnerService, private fb: FormBuilder) { }

  ngOnInit(): void {

    
    this.web3ServiceConnect$ = this.web3Service.onConnectChange.subscribe(async (connected: boolean)=>{
        
      if(connected){
        this.userChain = (await this.web3Service.getCurrentChain())?.chain??'';

        this.currentChainId = await this.web3Service.getCurrentChainId();
        // this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency;
        this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency.symbol??'Coin';
       
        
        this.zLendContract = ZLend__factory.connect(contractList[this.currentChainId].zLend!, this.web3Service.ethersSigner!);
        this.deposits = await this.web3Service.getCurrentUsersDeposit(this.zLendContract);
        
                
      }

    });

    this.depositFormGroup = this.fb.group({
          
      amount: ['', [Validators.required,Validators.min(0 ),Validators.max(1000000)]],

    })

    this.withdrawFormGroup = this.fb.group({
          
      amount: ['', [Validators.required,Validators.min(0 ),Validators.max(1000000)]],

    })

    
    
  }



  openWithdrawModal(token){
    
    this.selectedToken = token;
    this.withdrawModalVisible=true;


  }

 

  closeWithdrawModal(){
      this.withdrawModalVisible=false;
  }


  
  async withdrawCoin () {

    this.spinner.show();
    const token = this.selectedToken;
    const amount = this.withdrawFormGroup.get('amount')?.value;
    const value = ethers.utils.parseEther(amount.toString())
    
    try {
      
      

      const tx = await this.zLendContract.withdraw(token.tokenAddress, value);
      const withdrawResult = await tx.wait();

      this.showToast('Success!','Your Withdrawal has been sent succesfully!');
      
      this.spinner.hide();
      window.location.reload(); 
    } catch (err) {
      console.error('Error withdrawing: ',err);
      this.spinner.hide();
      
      
      this.showToast('Oops!','Your Deposit Failed', 'danger');
    }
  };

  openDepositModal(token){
    
    this.selectedToken = token;
    this.depositCoinModalVisible=true;


  }

 

  closeDepositModal(){
      this.depositCoinModalVisible=false;
  }


  
  async depositCoin () {

    this.spinner.show();
    const token = this.selectedToken;
    const amount = this.depositFormGroup.get('amount')?.value;
    const value = ethers.utils.parseEther(amount.toString())
    
    const tokenInst = this.web3Service.getERC20ContractWithSigner(token.tokenAddress);
    const zToken = this.web3Service.getERC20ContractWithSigner(contractList[this.currentChainId].zLendTokenAddress); 

    try {
      
      await this.web3Service.approveERC20Contract(token.tokenAddress, contractList[this.currentChainId].zLend!, value);

      const tx = await this.zLendContract.lend(token.tokenAddress, value);
      const depositResult = await tx.wait();

      const zTokenBalance = await zToken.balanceOf(this.web3Service.accounts[0]);

      await(await zToken.approve(contractList[this.currentChainId].zLend!, zTokenBalance)).wait();

      this.showToast('Success!','Your Deposit has been sent succesfully!');
      
      this.spinner.hide();
      window.location.reload(); 
    } catch (err) {
      console.error('Error depositing: ',err);
      this.spinner.hide();
      
      
      this.showToast('Oops!','Your Deposit Failed', 'danger');
    }
  }


  todp(amount, dp){
    return toDp(amount, dp);
  }

  /*Colors 
  primary = 'primary',
  secondary = 'secondary',
  success = 'success',
  info = 'info',
  warning = 'warning',
  danger = 'danger',
  dark = 'dark',
  light = 'light',*/
  showToast(title: string, body: string, color='info') {
    const options = {
      title,
      delay: 5000,
      placement: this.placement,
      color,
      autohide: true,
      body
    }
    const componentRef = this.toaster.addToast(AppToastComponent, { ...options });
  }

  addToast() {
    const options = {
      title: `Successful`,
      delay: 5000,
      placement: this.placement,
      color: 'info',
      autohide: true,
      body: 'Successful!'
    }
    const componentRef = this.toaster.addToast(AppToastComponent, { ...options });
  }

  objectKeys(o: any){
    if(!o){
      return []
    }
    return Object.keys(o)
  }

}
