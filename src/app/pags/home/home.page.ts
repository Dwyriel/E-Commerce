import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { GetViewListInOrder, User } from 'src/app/structure/user';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/structure/product';
import { AppResources } from 'src/app/services/app-info.service';
import { PurchasesService } from 'src/app/services/purchases.service';
import { Purchase } from 'src/app/structure/purchases';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public loggedUser: User = null;
  public isMobile: boolean;
  public prevViewedProducts: Product[] = [];
  public salesObjs: { exemploProduct: Product, purchase: Purchase }[] = [];
  public purchasesObjs: { exemploProduct: Product, purchase: Purchase }[] = [];

  private alreadyLoaded: boolean = false;

  //Subscriptions
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  private subscription5: Subscription;
  private subscription6: Subscription;

  constructor(
    private productService: ProductService,
    private purchaseService: PurchasesService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (!this.alreadyLoaded) {
      this.GetPlataformInfo();
      this.getLoggedUser();
      this.alreadyLoaded = true;
    }
  }

  ionViewWillLeave() {
    return;
    this.loggedUser = null;
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    if (this.subscription4 && !this.subscription4.closed)
      this.subscription4.unsubscribe();
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
      if (!ans)
        return;
      this.GetPreviouslyViewedProducts((ans.viewList && ans.viewList.length > 0) ? ans.viewList : []);
      this.GetRecentSales();
      this.GetRecentPuchases();
    });
  }

  async GetPreviouslyViewedProducts(viewList: any[]) {
    var previouslyViewedProductIds = GetViewListInOrder(viewList);
    if (previouslyViewedProductIds.length < 1)
      return;
    var subscriptions: Subscription[] = [];
    var i = 0;
    var shouldWait = true;
    var tempProducts: Product[] = [];
    for (let id of previouslyViewedProductIds) {
      var shouldWait2 = true;
      subscriptions.push((await this.productService.Get(id)).subscribe(ans => {
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
    for (let sub of subscriptions)
      sub.unsubscribe();
    for (let prod of tempProducts) {
      prod.calculateAvgRating();
      prod.fillSubCategory();
    }
    this.prevViewedProducts = tempProducts.filter((product, index, array) => index === array.findIndex(prod => (prod.id === product.id)));
  }

  async GetRecentSales() {
    if (this.subscription4 && !this.subscription4.closed)
      this.subscription4.unsubscribe();
    this.subscription4 = (await this.purchaseService.GetAllFromSellerWithLimit(this.loggedUser.id, 3)).subscribe(async ans => {
      if (!ans || ans.length < 1) {
        this.salesObjs = [];
        return;
      }
      var subscriptions: Subscription[] = [];
      var shouldWait: boolean = true;
      var index: number = 0;
      var arrayLength = ans.length;
      var tempObjs: { exemploProduct: Product, purchase: Purchase }[] = [];
      for (let purchase of ans) {
        let shouldWait2: boolean = true;
        subscriptions.push((await this.productService.Get(purchase.item.productID)).subscribe(ans2 => {
          tempObjs.push({ exemploProduct: ans2, purchase: purchase })
          index++;
          if (index >= arrayLength)
            shouldWait = false;
          shouldWait2 = false;
        }, err => {
          shouldWait = false;
          shouldWait2 = false;
        }));
        while (shouldWait2)
          await new Promise(resolve => setTimeout(resolve, 10));
      }
      while (shouldWait)
        await new Promise(resolve => setTimeout(resolve, 10));
      this.salesObjs = tempObjs;
      for (let sub of subscriptions)
        sub.unsubscribe();
    });
  }

  async GetRecentPuchases() {
    if (this.subscription4 && !this.subscription4.closed)
      this.subscription4.unsubscribe();
    this.subscription4 = (await this.purchaseService.GetAllFromUserWithLimit(this.loggedUser.id, 3)).subscribe(async ans => {
      if (!ans || ans.length < 1) {
        this.purchasesObjs = [];
        return;
      }
      var subscriptions: Subscription[] = [];
      var shouldWait: boolean = true;
      var index: number = 0;
      var arrayLength = ans.length;
      var tempObjs: { exemploProduct: Product, purchase: Purchase }[] = [];
      for (let purchase of ans) {
        let shouldWait2: boolean = true;
        subscriptions.push((await this.productService.Get(purchase.item.productID)).subscribe(ans2 => {
          tempObjs.push({ exemploProduct: ans2, purchase: purchase })
          index++;
          if (index >= arrayLength)
            shouldWait = false;
          shouldWait2 = false;
        }, err => {
          shouldWait = false;
          shouldWait2 = false;
        }));
        while (shouldWait2)
          await new Promise(resolve => setTimeout(resolve, 10));
      }
      while (shouldWait)
        await new Promise(resolve => setTimeout(resolve, 10));
      this.purchasesObjs = tempObjs;
      for (let sub of subscriptions)
        sub.unsubscribe();
    });
  }
}
