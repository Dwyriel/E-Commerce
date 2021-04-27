import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductProfilePageRoutingModule } from './product-profile-routing.module';

import { ProductProfilePage } from './product-profile.page'
import { ComponentModule } from 'src/app/components/component.module';;

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductProfilePageRoutingModule,
    ComponentModule
  ],
  declarations: [ProductProfilePage]
})
export class ProductProfilePageModule {}
