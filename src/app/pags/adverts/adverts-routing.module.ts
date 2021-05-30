import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvertsPage } from './adverts.page';

const routes: Routes = [
  {
    path: '',
    component: AdvertsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvertsPageRoutingModule {}
