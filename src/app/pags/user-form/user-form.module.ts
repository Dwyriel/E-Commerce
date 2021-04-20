import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserFormPageRoutingModule } from './user-form-routing.module';

import { UserFormPage } from './user-form.page';

import { ComponentModule } from '../../components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserFormPageRoutingModule,
    ComponentModule
  ],
  declarations: [UserFormPage]
})
export class UserFormPageModule {}
