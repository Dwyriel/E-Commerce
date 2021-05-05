import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppResources } from 'src/app/services/app-info.service';
import { SubCategory } from 'src/app/structure/categories';
import { ItemClassification } from 'src/app/structure/item-classification';

@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.scss'],
})
export class SubCategoriesComponent implements OnInit {

  @Input('category') public category: number;
  public subcategories: SubCategory[];

  constructor(private router: Router) { }

  ngOnInit() {
    this.subcategories = ItemClassification.GetSubCatFrom(this.category);
  }

  async goToCat(value) {
    await this.router.navigate([`/products/all/${value}`]);
    AppResources.popovers.forEach(popover => {
      popover.dismiss();
    });
  }

  async goToSubCat(value) {
    console.log(AppResources.popovers)
    await this.router.navigate([`/products/sub/${value}`]);
    AppResources.popovers.forEach(popover => {
      popover.dismiss();
    });
  }
}
