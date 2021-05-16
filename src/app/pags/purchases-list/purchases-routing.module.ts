import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchasesListPage } from './purchases.page';

const routes: Routes = [
  {
    path: '',
    component: PurchasesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasesListPageRoutingModule {}
