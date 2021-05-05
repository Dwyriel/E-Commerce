import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AppResources } from 'src/app/services/app-info.service';
import { Category } from 'src/app/structure/categories';
import { SubCategoriesComponent } from '../sub-categories/sub-categories.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {

  @Input("categories") public categories: Category[];

  constructor(private popoverController: PopoverController, private router: Router) { }

  ngOnInit() { }

  async ShowSubCategory(event, /**value of category*/index) {
    var popover = await this.popoverController.create({
      component: SubCategoriesComponent,
      event: event,
      mode: 'md',
      componentProps: { category: index }
    });
    AppResources.popovers.push(popover);
    await popover.present();
  }

  async goToProducts() {
    await this.router.navigate([`/products`]);
    AppResources.popovers.forEach(popover => {
      popover.dismiss();
    });
  }
}
