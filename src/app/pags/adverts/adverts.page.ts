import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AppResources } from 'src/app/services/app-info.service';
import { ProductService } from 'src/app/services/product.service';
import { ReviewService } from 'src/app/services/review.service';
import { Product } from 'src/app/structure/product';
import { User } from 'src/app/structure/user';

@Component({
  selector: 'app-adverts',
  templateUrl: './adverts.page.html',
  styleUrls: ['./adverts.page.scss'],
})
export class AdvertsPage implements OnInit {
  private loadingAlertID: string;
  private user: User;

  public adverts: Product[] = [];
  public isMobile: boolean;

  //Subscriptions
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;

  constructor(private alertService: AlertService, private router: Router, private productService: ProductService, private reviewService: ReviewService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.GetPlataformInfo();
    this.GetUserAndAdverts();
  }

  ionViewWillLeave() {
    this.adverts = [];
    this.user = null;
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

  async GetUserAndAdverts() {
    await this.alertService.presentLoading().then(ans => this.loadingAlertID = ans);
    this.subscription2 = AppResources.GetUserInfo().subscribe(async ans => {
      if (!ans) {
        await this.router.navigate(["/login"]);
        await this.alertService.dismissLoading(this.loadingAlertID);
        return;
      }
      this.user = ans;
      this.GetAdverts();
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Algo deu errado, tente novamente mais tarde.");
    });
  }

  async GetAdverts() {
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    this.subscription3 = (await this.productService.GetAllFromSeller(this.user.id)).subscribe(ans => {
      this.adverts = ans;
      this.FillProductAttributes();
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Algo deu errado, tente novamente mais tarde.");
    });
  }

  async FillProductAttributes() {
    var shouldWait: boolean = true;
    var subscriptions: Subscription[] = [];
    var index = 0;
    var arrayLength = this.adverts.length;
    if (this.adverts && arrayLength > 0)
      for (var product of this.adverts) {
        product.fillSubCategory();
        subscriptions.push((await this.reviewService.GetAllFromProduct(product.id)).subscribe(ans => {
          product.reviews = ans;
          if (product.reviews)
            product.calculateAvgRating();
          index++;
          if (index >= arrayLength)
            shouldWait = false;
        }, async err => {
          shouldWait = false;
        }));
      }
    else
      shouldWait = false;
    while (shouldWait)
      await new Promise(resolve => setTimeout(resolve, 10));
    for (var sub of subscriptions)
      sub.unsubscribe();
    await this.alertService.dismissLoading(this.loadingAlertID);
  }

  async DeleteAdvert(id: string) {
    var confirm: boolean = false;
    await this.alertService.confirmationAlert("Deletar", "Tem certeza que deseja deletar esse anuncio?").then(ans => confirm = ans);
    if (!confirm)
      return;
    await this.alertService.presentLoading().then(ans => this.loadingAlertID = ans);
    await this.productService.DeleteCallFromUser(id, true).then(async () => {
      await this.alertService.presentAlert("Feito!", "O Anúncio foi deletado.")
    }).catch(err => {
      this.alertService.presentAlert("Erro", "Ocorreu um erro e não foi possivel deletar esse anúncio, tente novamente mais tarde.");
    }).finally(async () => {
      await this.alertService.dismissLoading(this.loadingAlertID);
    });
  }
}
