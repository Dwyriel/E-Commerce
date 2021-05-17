import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchasePagePage } from './purchase-page.page';

const routes: Routes = [
  {
    path: '',
    component: PurchasePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasePagePageRoutingModule {}
