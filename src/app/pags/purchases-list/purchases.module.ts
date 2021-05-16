import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchasesListPageRoutingModule } from './purchases-routing.module';

import { PurchasesListPage } from './purchases.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchasesListPageRoutingModule,
    ComponentModule
  ],
  declarations: [PurchasesListPage]
})
export class PurchasesListPageModule {}
