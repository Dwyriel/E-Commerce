import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AppResources } from 'src/app/services/app-info.service';
import { Category } from 'src/app/structure/categories';
import { SidebarModalSubcategory } from '../sidebar-modal-subcategory/sidebar-modal-subcategory.component';

@Component({
  selector: 'app-sidebar-modal',
  templateUrl: './sidebar-modal.component.html',
  styleUrls: ['./sidebar-modal.component.scss'],
})
export class SidebarModalCategory implements OnInit {

  @Input("categories") public categories: Category[];

  constructor(private modalController: ModalController, private router: Router) { }

  ngOnInit() { }

  async dismissModal() {
    await AppResources.modals[AppResources.modals.length - 1].dismiss().then(() => {
      AppResources.modals.pop();
    });
  }

  async goToProducts() {
    await this.dismissModal();
    await this.router.navigate([`/products`]);
  }

  async ShowSubCategory(/**value of category*/index) {
    var modal = await this.modalController.create({
      component: SidebarModalSubcategory,
      mode: 'md',
      componentProps: { category: index }
    });
    AppResources.modals.push(modal);
    await modal.present();
  }
}
