import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppResources } from 'src/app/services/app-info.service';
import { SubCategory } from 'src/app/structure/categories';
import { ItemClassification } from 'src/app/structure/item-classification';

@Component({
  selector: 'app-sidebar-modal-subcategory',
  templateUrl: './sidebar-modal-subcategory.component.html',
  styleUrls: ['./sidebar-modal-subcategory.component.scss'],
})
export class SidebarModalSubcategory implements OnInit {

  @Input('category') public category: number;
  public categ;
  public subcategories: SubCategory[];

  constructor(private router: Router) { }

  ngOnInit() {
    this.subcategories = ItemClassification.GetSubCatFrom(this.category);
    this.categ = ItemClassification.GetCatFromValue(this.category);
  }

  async dismissModal() {
    await AppResources.modals[AppResources.modals.length - 1].dismiss().then(() => {
      AppResources.modals.pop();
    });
  }

  async goToCat(value) {
    await this.router.navigate([`/products/all/${value}`]);
    AppResources.modals.forEach(modal => {
      modal.dismiss();
    });
  }

  async goToSubCat(value) {
    await this.router.navigate([`/products/sub/${value}`]);
    AppResources.modals.forEach(modal => {
      modal.dismiss();
    });
  }
}
