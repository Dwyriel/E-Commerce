import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductFormPage } from './product-form.page';

const routes: Routes = [
  {
    path: '',
    component: ProductFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductFormPageRoutingModule {}
