import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocsRoutingModule } from './docs-routing.module';
import { DocsMainComponent } from './docs-main/docs-main.component';


@NgModule({
  declarations: [
    DocsMainComponent
  ],
  imports: [
    CommonModule,
    DocsRoutingModule
  ]
})
export class DocsModule { }
