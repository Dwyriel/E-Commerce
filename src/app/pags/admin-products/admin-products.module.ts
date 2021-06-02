import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminProductsPageRoutingModule } from './admin-products-routing.module';

import { AdminProductsPage } from './admin-products.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminProductsPageRoutingModule,
    ComponentModule
  ],
  declarations: [AdminProductsPage]
})
export class AdminProductsPageModule {}
