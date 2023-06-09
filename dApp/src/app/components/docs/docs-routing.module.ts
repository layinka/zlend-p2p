import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocsMainComponent } from './docs-main/docs-main.component';

const routes: Routes = [
  {
    path: 'docs-main',
    redirectTo: './docs-main'
  },
  {
    path: './docs-main',
    component: DocsMainComponent,
    data: {
      title: 'Documentation Home'
    } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocsRoutingModule { }
