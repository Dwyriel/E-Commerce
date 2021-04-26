import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category, SubCategory } from 'src/app/structure/categories';
import { ItemClassification } from 'src/app/structure/item-classification';
import { Product } from 'src/app/structure/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

  /**sub or all*/
  private allFromCat: string;
  private categoryValue: number;
  private category: Category;
  private subcategory: SubCategory;
  public products: Product[];

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.GetProducts();
  }

  async GetProducts() {
    this.allFromCat = this.activatedRoute.snapshot.paramMap.get('all');
    this.categoryValue = parseInt(this.activatedRoute.snapshot.paramMap.get('value'));
    if (this.allFromCat === "all") {
      this.category = ItemClassification.GetCatFromValue(this.categoryValue);
    }
    if (this.allFromCat = "sub") {
      this.subcategory = ItemClassification.GetSubCatFromValue(this.categoryValue);
    }
  }
}
