import { Component, Input, OnInit } from '@angular/core';
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

  constructor() { }

  ngOnInit() {
    this.subcategories = ItemClassification.GetSubCatFrom(this.category);
  }

}
