import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AppResources } from 'src/app/services/app-info.service';
import { ProductService } from 'src/app/services/product.service';
import { PurchasesService } from 'src/app/services/purchases.service';
import { Product } from 'src/app/structure/product';
import { Purchase } from 'src/app/structure/purchases';
import { User } from 'src/app/structure/user';

@Component({
  selector: 'app-purchase-page',
  templateUrl: './purchase-page.page.html',
  styleUrls: ['./purchase-page.page.scss'],
})
export class PurchasePagePage implements OnInit {
  public title: string = "Compra?";
  public isMobile: boolean;
  public purchase: Purchase;
  public product: Product;

  private loadingAlertID;
  private user: User;
  private id: string;

  //Subscription
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private purchaseService: PurchasesService, private productService: ProductService, private alertService: AlertService, private router: Router) { }

  ngOnInit() { }

  async ionViewWillEnter() {
    await this.GetRequiredAttributes();
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
  }

  async GetRequiredAttributes() {
    await this.alertService.presentLoading().then(ans => this.loadingAlertID = ans);
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!this.id) {
      this.SendAway("/");
      return;
    }
    this.GetPlataformInfo();
    await this.getUserAndPurchase();
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

  async getUserAndPurchase() {
    this.subscription2 = AppResources.GetUserInfo().subscribe(async ans => {
      if (!ans) {
        this.SendAway("/login");
        return;
      }
      this.user = ans;
      this.GetPurchase();
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Algo deu errado, tente novamente mais tarde.");
    });
  }

  async GetPurchase() {
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    this.subscription3 = (await this.purchaseService.Get(this.id)).subscribe(async ans => {
      if (!ans) {
        await this.alertService.presentAlert("Erro", "Compra não encontrada.");
        this.SendAway("/");
        return;
      }
      this.purchase = ans;
      this.GetProduct();
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Ocorreu um erro ao carregar a compra, tente novamente mais tarde.");
    });
  }

  async GetProduct() {
    if (this.subscription4 && !this.subscription4.closed)
      this.subscription4.unsubscribe();
    this.subscription4 = (await this.productService.Get(this.purchase.item.productID)).subscribe(async ans => {
      this.product = ans;
      await this.alertService.dismissLoading(this.loadingAlertID);
      console.log(this.user);
      console.log(this.purchase);
      console.log(this.product);
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Ocorreu um erro ao carregar o produto, tente novamente mais tarde.");
    });
  }

  async SendAway(sendTo: string) {
    await this.router.navigate([sendTo]);
    await this.alertService.dismissLoading(this.loadingAlertID);
    return;
  }
}
