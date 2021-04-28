import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
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
  private LoadingAlertID: string;
  private category: Category;
  private subcategory: SubCategory;
  public products: Product[];
  public title: string = "Produtos";

  //Subscriptions
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  private subscription5: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, private reviewService: ReviewService, private router: Router,
    private alertService: AlertService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.GetProducts();
  }

  ionViewWillLeave() {
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    if (this.subscription4 && !this.subscription4.closed)
      this.subscription4.unsubscribe();
    if (this.subscription5 && !this.subscription5.closed)
      this.subscription5.unsubscribe();
  }

  async GetProducts(event = null) {
    await this.alertService.presentLoading().then(ans => this.LoadingAlertID = ans)
    this.searchInput = this.activatedRoute.snapshot.paramMap.get('search');
    this.allFromCat = this.activatedRoute.snapshot.paramMap.get('cat');
    this.categoryValue = parseInt(this.activatedRoute.snapshot.paramMap.get('value'));
    if (this.searchInput) {
      //todo search thingy (matching string, removing spaces and looking for just the words, etc)
      return;
    }
    if (this.allFromCat === "all") {
      if (ItemClassification.CatsContains(this.categoryValue)) {
        this.category = ItemClassification.GetCatFromValue(this.categoryValue);
        this.title = `Categoria: ${this.category.title}`;
        this.products = await this.productService.getAllFromCat(this.categoryValue);
        await this.FillProductAttributes(event);
      }
      return;
    }
    if (this.allFromCat === "sub") {
      if (ItemClassification.SubCatsContains(this.categoryValue)) {
        this.subcategory = ItemClassification.GetSubCatFromValue(this.categoryValue);
        this.title = `${this.subcategory.title} em ${ItemClassification.GetCatFromValue(this.subcategory.category).title}`;
        if (this.subscription1 && !this.subscription1.closed)
          this.subscription1.unsubscribe();
        this.subscription1 = (await this.productService.GetAllFromSubCat(this.categoryValue)).subscribe(async ans => {
          this.products = ans;
          await this.FillProductAttributes(event);
        });
      }
      return;
    }
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    this.subscription2 = (await this.productService.GetAll()).subscribe(async ans => {
      this.title = `Produtos`;
      this.products = ans;
      await this.FillProductAttributes(event);
    })
  }

  async FillProductAttributes(event) {
    var shouldWait: boolean = true;
    var subscriptions: Subscription[] = [];
    var index = 0;
    for (var product of this.products) {
      product.fillSubCategory();
      subscriptions.push((await this.reviewService.GetAllFromProduct(product.id)).subscribe(ans => {
        product.reviews = ans;
        if (product.reviews)
          product.calculateAvgRating();
        index++;
        if (index >= this.products.length)
          shouldWait = false;
      }));
    }
    while (shouldWait)
      await new Promise(resolve => setTimeout(resolve, 10));
    for (var sub of subscriptions)
      sub.unsubscribe();
    if (event)
      await event.target.complete();
    await this.alertService.dismissLoading(this.LoadingAlertID);
  }

  async RefreshContent(event) {
    await this.GetProducts(event);
  }
}
