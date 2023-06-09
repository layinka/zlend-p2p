import { Component, OnInit, Input } from '@angular/core';
import { toDp } from 'src/app/utils/numbers';

@Component({
  selector: 'asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.scss']
})
export class AssetDetailsComponent implements OnInit {

  @Input() token : any;

  constructor() { }

  ngOnInit(): void {
  }

  todp(amount, dp){
    return toDp(amount, dp);
  }

}
