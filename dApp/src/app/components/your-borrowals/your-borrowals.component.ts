import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import contractList from 'src/app/models/contract-list';
import { Web3Service } from 'src/app/services/web3.service';
import { ZLend, ZLend__factory } from 'src/app/typechain-types';
import { toDp } from 'src/app/utils/numbers';

import { ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { ethers } from 'ethers';
import { AppToastComponent } from 'src/app/views/notifications/toasters/toast-simple/toast.component';

@Component({
  selector: 'your-borrowals',
  templateUrl: './your-borrowals.component.html',
  styleUrls: ['./your-borrowals.component.scss']
})
export class YourBorrowalsComponent implements OnInit {

  placement = ToasterPlacement.TopCenter;
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  web3ServiceConnect$: Subscription|undefined;
  userChain: string|null = 'pol';
  currentChainId: any;
  nativeCoin= '';

  loans: any;
  selectedToken: any;
  zLendContract: ZLend|undefined;
  
  borrowModalVisible = false;
  repayModalVisible=false;

  borrowFormGroup: FormGroup;
  repayFormGroup: FormGroup;

  validationMessages : {
    [index: string]: any
   } = {
    'amount': {
      'required'  :   'Amount is Required.',
      'min': 'Amount must be at least 0 ',
      'max': 'Amount must be at most 100 '
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
        this.loans = await this.web3Service.getCurrentUsersLoans(this.zLendContract);
        
                
      }

    });

    this.borrowFormGroup = this.fb.group({
          
      amount: ['', [Validators.required,Validators.min(0 ),Validators.max(1000000)]],

    })

    this.repayFormGroup = this.fb.group({
          
      amount: ['', [Validators.required,Validators.min(0 ),Validators.max(1000000)]],

    })

    
    
  }


  openBorrowModal(token){
    
    this.selectedToken = token;
    this.borrowModalVisible=true;


  }

 

  closeBorrowModal(){
      this.borrowModalVisible=false;
  }


  
  async borrowCoin () {

    this.spinner.show();
    const token = this.selectedToken;
    const amount = this.borrowFormGroup.get('amount')?.value;
    const value = ethers.utils.parseEther(amount.toString())
    
    try {
      
      

      const tx = await this.zLendContract.borrow(value,token.tokenAddress);
      const borrowResult = await tx.wait();

      this.showToast('Success!','Your Borrowal has been sent succesfully!');
      
      this.spinner.hide();
      window.location.reload(); 
    } catch (err) {
      console.error('Error borrowing: ',err);
      this.spinner.hide();
      
      
      this.showToast('Oops!','Your Borrowing Failed', 'danger');
    }
  };


  openRepayModal(token){
    
    this.selectedToken = token;
    this.repayModalVisible=true;


  }

 

  closeRepayModal(){
      this.repayModalVisible=false;
  }


  
  async repayCoin () {

    this.spinner.show();
    const token = this.selectedToken;
    let value = this.repayFormGroup.get('amount')?.value;

    //add interest
    const amount = value + Number(token.borrowAPYRate) * value;

    const amountToPayBackInWei = ethers.utils.parseEther(amount.toString());

    
    try {
      
      await this.web3Service.approveERC20Contract(token.tokenAddress, contractList[this.currentChainId].zLend!, amountToPayBackInWei);

      const tx = await this.zLendContract.payDebt(token.tokenAddress, ethers.utils.parseEther(value.toString()));
      const repayResult = await tx.wait();

      this.showToast('Success!','Your Repayment has been paid succesfully!');
      
      this.spinner.hide();
      window.location.reload(); 
    } catch (err) {
      console.error('Error repaying: ',err);
      this.spinner.hide();
      
      
      this.showToast('Oops!','Your Repayment Failed', 'danger');
    }
  };

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
