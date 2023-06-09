import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VaultsRoutingModule } from './vaults-routing.module';
import { CreateVaultComponent } from './create-vault/create-vault.component';

import { ArchwizardModule } from 'angular-archwizard';
import { FormModule, ProgressModule, ToastModule } from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ViewVaultComponent } from './view-vault/view-vault.component';
import { VaultsListComponent } from './vaults-list/vaults-list.component';

@NgModule({
  declarations: [
    CreateVaultComponent,
    ViewVaultComponent,
    VaultsListComponent
  ],
  imports: [
    CommonModule,
    VaultsRoutingModule,
    // ArchwizardModule,
    ToastModule,
    FormsModule, 
    ReactiveFormsModule,
    FormModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VaultsModule { }
