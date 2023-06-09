import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Web3Service } from 'src/app/services/web3.service';
import { ZLend, ZLend__factory } from 'src/app/typechain-types';
import contractList from '../../models/contract-list';
import {Contract, ethers, utils} from 'ethers';

// const ZLendAbi = require('../../../../assets/zlend.json');


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  web3ServiceConnect$: Subscription|undefined;
  userChain: string|null = 'pol';
  currentChainId: any;
  nativeCoin= '';

  zLendContract: ZLend|undefined;

  zlendBalance :any ;
  deposits: any;
  loans: any;
  
  slides: any[] = new Array(1).fill({id: -1, src: '', title: '', subtitle: '', subtitle2: ''});

  constructor(private titleService: Title, public web3Service: Web3Service,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.titleService.setTitle("ZLend || Defi Lending");

    this.slides[0] = {
      id: 0,
      src: './assets/images/',
      title: 'ZLend',
      subtitle: 'DEFI LEnding',
      subtitle2: '.'
    };

    this.web3ServiceConnect$ = this.web3Service.onConnectChange.subscribe(async (connected: boolean)=>{
        
      if(connected){
        this.userChain = (await this.web3Service.getCurrentChain())?.chain??'';

        this.currentChainId = await this.web3Service.getCurrentChainId();
        // this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency;
        this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency.symbol??'Coin';
       
        
        this.zLendContract = ZLend__factory.connect(contractList[this.currentChainId].zLend!, this.web3Service.ethersSigner!)

        this.deposits = await this.web3Service.getCurrentUsersDeposit(this.zLendContract);
        
        this.loans = await this.web3Service.getCurrentUsersLoans(this.zLendContract);

        this.zlendBalance= ethers.utils.formatUnits(await this.web3Service.getERC20Balance(contractList[this.currentChainId].zLendTokenAddress, this.web3Service.accounts[0] ) );
                
      }

    });

    
    
  }

}
