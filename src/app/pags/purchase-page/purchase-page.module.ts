import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchasePagePageRoutingModule } from './purchase-page-routing.module';

import { PurchasePagePage } from './purchase-page.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchasePagePageRoutingModule,
    ComponentModule
  ],
  declarations: [PurchasePagePage]
})
export class PurchasePagePageModule {}
