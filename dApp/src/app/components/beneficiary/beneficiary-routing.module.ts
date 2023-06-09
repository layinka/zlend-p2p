import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeneficiaryDetailsComponent } from './beneficiary-details/beneficiary-details.component';
import { CreateBeneficiaryComponent } from './create-beneficiary/create-beneficiary.component';

const routes: Routes = [
  {
    path: 'beneficiary-details',
    redirectTo: './beneficiary-details'
  },
  {
    path: './beneficiary-details',
    component: BeneficiaryDetailsComponent,
    data: {
      title: 'Beneficiary Details'
    }
  },
  {
    path: 'create-beneficiary',
    redirectTo: './create-beneficiary'
  },
  {
    path: './create-beneficiary',
    component: CreateBeneficiaryComponent,
    data: {
      title: 'Create Beneficiary Account'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeneficiaryRoutingModule { }
