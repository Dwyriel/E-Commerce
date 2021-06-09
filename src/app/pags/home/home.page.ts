import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { GetViewListInOrder, User } from 'src/app/structure/user';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/structure/product';
import { AppResources } from 'src/app/services/app-info.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public loggedUser: User = null;
  public isMobile: boolean;
  public prevViewedProducts: Product[] = [];

  //Subscriptions
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;

  constructor(
    private productService: ProductService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.GetPlataformInfo();
    this.getLoggedUser();
  }

  ionViewWillLeave() {
    this.loggedUser = null;
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
  }

  GetPlataformInfo() {
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    this.subscription1 = AppResources.GetAppInfo().subscribe(info => {
      this.isMobile = info.appWidth <= AppResources.maxMobileWidth;
      var value = ((info.appWidth * .4 > (AppResources.maxMobileWidth / 1.5)) ? "40%" : (AppResources.maxMobileWidth / 1.5) + "px");
      document.body.style.setProperty('--maxWidth', value);
    });
  }

  async getLoggedUser() {
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    this.subscription2 = AppResources.GetUserInfo().subscribe(async ans => {
      this.loggedUser = ans;
      this.GetPreviouslyViewedProducts((ans && ans.viewList && ans.viewList.length > 0) ? ans.viewList : []);
    });
  }

  async GetPreviouslyViewedProducts(viewList: any[]) {
    var previouslyViewedProductIds = GetViewListInOrder(viewList);
    if (previouslyViewedProductIds.length < 1)
      return;
    var subs: Subscription[] = [];
    var i = 0;
    var shouldWait = true;
    var tempProducts: Product[] = []
    for (let id of previouslyViewedProductIds) {
      var shouldWait2 = true;
      subs.push((await this.productService.Get(id)).subscribe(ans => {
        tempProducts.push({ ...ans, id: id, fillSubCategory: new Product().fillSubCategory, calculateAvgRating: new Product().calculateAvgRating })
        i++;
        if (i >= previouslyViewedProductIds.length)
          shouldWait = false;
        shouldWait2 = false;
      }, err => {
        shouldWait2 = false;
        shouldWait = false;
      }));
      while (shouldWait2)
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    while (shouldWait)
      await new Promise(resolve => setTimeout(resolve, 10));
    for (let sub of subs)
      sub.unsubscribe();
    for (let prod of tempProducts) {
      prod.calculateAvgRating();
      prod.fillSubCategory();
    }
    this.prevViewedProducts = tempProducts.filter((product, index, array) => index === array.findIndex(prod => (prod.id === product.id)));
  }
}
