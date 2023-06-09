import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiaryRoutingModule } from './beneficiary-routing.module';
import { BeneficiaryDetailsComponent } from './beneficiary-details/beneficiary-details.component';
import { CreateBeneficiaryComponent } from './create-beneficiary/create-beneficiary.component';


@NgModule({
  declarations: [
    BeneficiaryDetailsComponent,
    CreateBeneficiaryComponent
  ],
  imports: [
    CommonModule,
    BeneficiaryRoutingModule
  ]
})
export class BeneficiaryModule { }
