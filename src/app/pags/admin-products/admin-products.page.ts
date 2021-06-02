import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ProductComponent } from 'src/app/components/product/product.component';
import { AlertService } from 'src/app/services/alert.service';
import { AppResources } from 'src/app/services/app-info.service';
import { ProductService } from 'src/app/services/product.service';
import { ReviewService } from 'src/app/services/review.service';
import { Product } from 'src/app/structure/product';
import { User, UserType } from 'src/app/structure/user';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.page.html',
  styleUrls: ['./admin-products.page.scss'],
})
export class AdminProductsPage implements OnInit {

  private loadingAlertID: string;
  private user: User;

  public isMobile: boolean;
  public products: Product[] = [];

  //Subscriptions
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;

  constructor(private alertService: AlertService, private router: Router, private productService: ProductService, private reviewService: ReviewService, private popoverController: PopoverController) { }

  ngOnInit() { }

  async ionViewWillEnter() {
    this.GetPlataformInfo();
    this.GetUser();
  }

  ionViewWillLeave() {
    this.user = null;
    this.products = [];
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
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

  async GetUser() {
    await this.alertService.presentLoading().then(ans => this.loadingAlertID = ans);
    this.subscription2 = AppResources.GetUserInfo().subscribe(async ans => {
      if (!ans) {
        await this.router.navigate(["/login"]);
        await this.alertService.dismissLoading(this.loadingAlertID);
        return;
      }
      if (ans.userType != UserType.Admin) {
        await this.router.navigate(["/"]);
        await this.alertService.dismissLoading(this.loadingAlertID);
        return;
      }
      this.user = ans;
      this.GetProducts();
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Algo deu errado, tente novamente mais tarde.");
    });
  }

  async GetProducts() {
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    this.subscription3 = (await this.productService.GetAllVerified(false)).subscribe(async ans => {
      this.products = ans;
      await this.alertService.dismissLoading(this.loadingAlertID);
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Algo deu errado, tente novamente mais tarde.");
    })
  }

  async Verify(product: Product) {
    var confirmation: boolean;
    await this.alertService.confirmationAlert("Confirmação", "Tem ceteza que deseja verificar esse produto?").then(ans => confirmation = ans);
    if (!confirmation)
      return;
    await this.alertService.presentLoading().then(ans => this.loadingAlertID = ans);
    await this.productService.UpdateVerified(product.id, !product.verified).then(async () => {
      await this.alertService.ShowToast("Produto modificado com sucesso!");
    }).catch(async () => {
      await this.alertService.ShowToast("Ocorreu um erro, tente novamente mais tarde");
    }).finally(async () => {
      await this.alertService.dismissLoading(this.loadingAlertID);
    })
  }

  async ShowProduct(product: Product) {
    var popover = await this.popoverController.create({
      component: ProductComponent,
      mode: 'md',
      componentProps: { product: product },
      animated: true
    });
    await popover.present();
  }
}
