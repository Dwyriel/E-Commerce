import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AppResources } from 'src/app/services/app-info.service';
import { ProductService } from 'src/app/services/product.service';
import { PurchasesService } from 'src/app/services/purchases.service';
import { Product } from 'src/app/structure/product';
import { Purchase, State, StateString } from 'src/app/structure/purchases';
import { User } from 'src/app/structure/user';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.page.html',
  styleUrls: ['./purchases.page.scss'],
})
export class PurchasesListPage implements OnInit {
  private loadingAlertID: string;
  private user: User;
  private purchases: Purchase[] = [];

  public purchasesObjs: { exemploProduct: Product, purchase: Purchase }[] = [];
  public hasPurchases: boolean;
  public isMobile: boolean;

  //Subscription
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscriptions: Subscription[] = [];

  constructor(private alertService: AlertService, private purchaseService: PurchasesService, private router: Router, private productService: ProductService) { }

  ngOnInit() {
    this.GetPlataformInfo();
  }

  ionViewWillEnter() {
    this.GetUserAndPurchases();
  }

  ionViewWillLeave() {
    this.purchases = [];
    this.user = null;
    this.purchasesObjs = [];
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    if (this.subscriptions && this.subscriptions.length > 0) {
      for (var sub of this.subscriptions) {
        if (sub && !sub.closed)
          sub.unsubscribe();
      }
      this.subscriptions = [];
    }
  }

  GetPlataformInfo() {
    this.subscription1 = AppResources.GetAppInfo().subscribe(info => {
      this.isMobile = info.appWidth <= AppResources.maxMobileWidth;
      this.setDivWidth(((info.appWidth * .4 > (AppResources.maxMobileWidth / 1.5)) ? "40%" : (AppResources.maxMobileWidth / 1.5) + "px"));
    });
  }

  setDivWidth(value: string) {
    document.body.style.setProperty('--maxWidth', value);
  }

  async GetUserAndPurchases() {
    await this.alertService.presentLoading().then(ans => this.loadingAlertID = ans);
    this.subscription2 = AppResources.GetUserInfo().subscribe(async ans => {
      if (!ans) {
        await this.router.navigate(["/login"]);
        await this.alertService.dismissLoading(this.loadingAlertID);
        return;
      }
      this.user = ans;
      this.GetPurchases();
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Algo deu errado, tente novamente mais tarde.");
    });
  }

  async GetPurchases() {
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    this.subscription3 = (await this.purchaseService.GetAllFromUser(this.user.id)).subscribe(async ans => {
      if (this.subscriptions && this.subscriptions.length > 0) {
        for (var sub of this.subscriptions) {
          if (sub && !sub.closed)
            sub.unsubscribe();
        }
        this.subscriptions = [];
      }
      this.hasPurchases = (ans && ans.length > 0);
      this.purchases = (this.hasPurchases) ? ans : [];
      var tempPurchasesObjs: { exemploProduct: Product, purchase: Purchase }[] = [];
      var shouldWait: boolean = true;
      var shouldWait2: boolean = true;
      var index: number = 0;
      var arrayLength = this.purchases.length;
      for (var purchase of this.purchases) {
        shouldWait2 = true;
        this.subscriptions.push((await this.productService.Get(purchase.item.productID)).subscribe(ans => {
          tempPurchasesObjs.push({ exemploProduct: ans, purchase: purchase });
          index++;
          if (index >= arrayLength)
            shouldWait = false;
          shouldWait2 = false;
        }));
        while (shouldWait2)
          await new Promise(resolve => setTimeout(resolve, 10));
      }
      while (shouldWait)
        await new Promise(resolve => setTimeout(resolve, 10));
      this.purchasesObjs = tempPurchasesObjs;
      await this.alertService.dismissLoading(this.loadingAlertID);
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Algo deu errado, tente novamente mais tarde.");
    })
  }

  public StateToString(state: State) {
    return StateString(state);
  };
}
