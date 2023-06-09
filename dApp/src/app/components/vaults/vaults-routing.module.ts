import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateVaultComponent } from './create-vault/create-vault.component';
import { VaultsListComponent } from './vaults-list/vaults-list.component';
import { ViewVaultComponent } from './view-vault/view-vault.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
  },
  {
    path: 'create-vault',
    component: CreateVaultComponent,
    data: {
      title: 'Create Vault'
    }
  },
  {
    path: 'view/:vaultId',
    redirectTo: 'view/d/:vaultId',
  },
  {
    path: 'view/d/:vaultId',
    component: ViewVaultComponent,
    data: {
      title: 'View Vault'
    }
  },
  {
    path: 'view/:chain/:vaultId',
    component: ViewVaultComponent,
    data: {
      title: 'View Vault'
    }
  },

  // {
  //   path: 'list',
  //   redirectTo: 'list/d',
  // },
  {
    path: 'list',
    component: VaultsListComponent,
    data: {
      title: 'View your Vaults'
    }
  },
  // {
  //   path: 'list/:chain',
  //   component: VaultsListComponent,
  //   data: {
  //     title: 'View your Vaults'
  //   }
  // },
  
  // {
  //   path: 'testator-details',
  //   redirectTo: './testator-details'
  // },
  // {
  //   path: './testator-details',
  //   component: TestatorDetailsComponent,
  //   data: {
  //     title: 'Testator Details'
  //   }
  // }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VaultsRoutingModule { }
