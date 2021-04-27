import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Category } from 'src/app/structure/categories';
import { SubCategoriesComponent } from '../sub-categories/sub-categories.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {

  @Input("categories") public categories: Category[];

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  async ShowSubCategory(event, index/**value of category*/){
    var thingy = await this.popoverController.create({
      component: SubCategoriesComponent,
      event: event,
      mode: 'md',
      componentProps: {category: index}
    });
    thingy.present();
  }
}
