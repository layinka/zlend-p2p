import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';
import { Web3Service } from './services/web3.service';
import { ethers } from 'ethers';




@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  title = 'Heritage - Dead Man Switch';

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    private web3Service: Web3Service
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });

    // try{
    // const oneTokenToDollar = ethers.utils.parseUnits(`1000000000000000000`).div((10 ** 18).toString()).toString();
    // // const oneTokenToDollar = BigNumber.from(`${price}`).div(10 ** decimal).toString();
    // console.log('result2:', oneTokenToDollar);
    // }catch(err){
    //   console.error('Error load app: ',err)
    // }
  }

  // async connect (){
  //   await this.web3Service.connect();
  // }
}
