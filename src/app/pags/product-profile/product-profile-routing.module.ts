import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductProfilePage } from './product-profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProductProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductProfilePageRoutingModule {}
