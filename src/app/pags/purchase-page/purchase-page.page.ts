import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AppResources } from 'src/app/services/app-info.service';
import { ProductService } from 'src/app/services/product.service';
import { PurchasesService } from 'src/app/services/purchases.service';
import { UserService } from 'src/app/services/user.service';
import { Product } from 'src/app/structure/product';
import { Purchase, State, StateString } from 'src/app/structure/purchases';
import { User } from 'src/app/structure/user';

export const slideOpts = {
  slidesPerView: 1,
  slidesPerColumn: 1,
  slidesPerGroup: 1,
  watchSlidesProgress: true,
}

@Component({
  selector: 'app-purchase-page',
  templateUrl: './purchase-page.page.html',
  styleUrls: ['./purchase-page.page.scss'],
})
export class PurchasePagePage implements OnInit {
  StateToString(state: State) { return StateString(state); }
  public title: string = "Carregando";
  public isMobile: boolean;
  public purchase: Purchase = new Purchase();
  public product: Product = new Product();
  public seller: User = new User();
  public purchaseLoaded: boolean = false;
  public productLoaded: boolean = false;
  public sellerLoaded: boolean = false;
  public allLoaded: boolean = false;
  public isSeller: boolean;
  public showChangeState: boolean = false;
  public stateValue: number;
  public states: { value: State }[] = [];

  private loadingAlertID;
  private user: User;
  private id: string;
  private loading = true;

  //Subscription
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  private subscription5: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private purchaseService: PurchasesService, private productService: ProductService, private userService: UserService, private alertService: AlertService, private router: Router) { }

  ngOnInit() { }

  async ionViewWillEnter() {
    await this.GetRequiredAttributes();
  }

  ionViewWillLeave() {
    this.title = "Carregando";
    this.purchase = new Purchase();
    this.product = new Product();
    this.seller = new User()
    this.purchaseLoaded = false;
    this.productLoaded = false;
    this.sellerLoaded = false;
    this.allLoaded = false;
    this.showChangeState = false;
    this.states = [];
    this.loading = true;
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

  async GetRequiredAttributes() {
    await this.alertService.presentLoading().then(ans => this.loadingAlertID = ans);
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!this.id) {
      this.SendAway("/");
      return;
    }
    this.SetStates();
    this.GetPlataformInfo();
    await this.getUserAndPurchase();
  }

  SetStates() {
    for (var state in State) {
      if (!isNaN(Number(state)))
        this.states.push({ value: Number(state) })
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
      this.purchase.id = this.id
      this.purchase.date = new Date(ans.date);
      this.purchase.finishDate = (ans.finishDate) ? new Date(ans.finishDate) : undefined;
      if (this.purchase.sellerId != this.user.id && this.purchase.userId != this.user.id) {
        this.SendAway("/");
        return;
      }
      this.isSeller = this.purchase.sellerId == this.user.id;
      this.stateValue = this.purchase.state;
      this.purchaseLoaded = true;
      var shouldWait = { shouldWait1: true, shouldWait2: true }
      this.GetProduct(shouldWait);
      this.GetSeller(shouldWait);
      while (shouldWait.shouldWait1 && shouldWait.shouldWait2)
        await new Promise(resolve => setTimeout(resolve, 10));
      this.title = `Status da compra`;
      this.allLoaded = true;
      if (this.loading) {
        await this.alertService.dismissLoading(this.loadingAlertID);
        this.loading = false;
      }
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Ocorreu um erro ao carregar a compra, tente novamente mais tarde.");
    });
  }

  async GetProduct(shouldWait) {
    if (this.subscription4 && !this.subscription4.closed)
      this.subscription4.unsubscribe();
    this.subscription4 = (await this.productService.Get(this.purchase.item.productID)).subscribe(async ans => {
      this.product = ans;
      shouldWait.shouldWait1 = false;
      this.productLoaded = true;
    }, async err => {
      shouldWait.shouldWait1 = false;
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Ocorreu um erro ao carregar o produto, tente novamente mais tarde.");
    });
  }

  async GetSeller(shouldWait) {
    if (this.subscription5 && !this.subscription5.closed)
      this.subscription5.unsubscribe();
    this.subscription5 = (await this.userService.Get(this.purchase.sellerId)).subscribe(ans => {
      this.seller = ans;
      shouldWait.shouldWait2 = false;
      this.sellerLoaded = true;
    }, async err => {
      shouldWait.shouldWait2 = false;
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Ocorreu um erro ao carregar o produto, tente novamente mais tarde.");
    })
  }

  async StateChange(event) {
    if (!this.allLoaded)
      return;
    await this.alertService.presentLoading().then(ans => this.loadingAlertID = ans);
    await this.purchaseService.updateState(this.purchase.id, this.stateValue).then(async () => {
      await this.alertService.dismissLoading(this.loadingAlertID);
    });
  }

  async SendAway(sendTo: string) {
    await this.router.navigate([sendTo]);
    await this.alertService.dismissLoading(this.loadingAlertID);
    return;
  }
}
