import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ReviewService } from 'src/app/services/review.service';
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
  private searchInput: string = null;
  private category: Category;
  private subcategory: SubCategory;
  public products: Product[];
  public title: string = "Produtos";

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, private reviewService: ReviewService, private router: Router) { }

  ngOnInit() {
    this.GetProducts();
  }

  async GetProducts(event = null) {
    this.searchInput = this.activatedRoute.snapshot.paramMap.get('search');
    this.allFromCat = this.activatedRoute.snapshot.paramMap.get('all');
    this.categoryValue = parseInt(this.activatedRoute.snapshot.paramMap.get('value'));
    if (this.searchInput) {
      //todo search thingy (matching string, removing spaces and looking for just the words, etc)
      return;
    }
    if (this.allFromCat === "all") {
      if (ItemClassification.CatsContains(this.categoryValue)) {
        this.category = ItemClassification.GetCatFromValue(this.categoryValue);
        this.products = await this.productService.getAllFromCat(this.categoryValue);
        await this.FillProductAttributes(event);
      }
      return;
    }
    if (this.allFromCat === "sub") {
      if (ItemClassification.SubCatsContains(this.categoryValue)) {
        this.subcategory = ItemClassification.GetSubCatFromValue(this.categoryValue);
        (await this.productService.GetAllFromSubCat(this.categoryValue)).subscribe(async ans => {
          this.products = ans;
          await this.FillProductAttributes(event);
        });
      }
      return;
    }
    (await this.productService.GetAll()).subscribe(async ans => {
      this.products = ans;
      await this.FillProductAttributes(event);
    })
  }

  async FillProductAttributes(event) {
    for (var product of this.products) {
      product.fillSubCategory();
      var subscription = (await this.reviewService.GetAllFromProduct(product.id)).subscribe(ans => {
        product.reviews = ans;
        product.calculateAvgRating();
        subscription.unsubscribe();
      });
    }
    if (event)
      await event.target.complete();
  }

  async RefreshContent(event) {
    await this.GetProducts(event);
  }
}
