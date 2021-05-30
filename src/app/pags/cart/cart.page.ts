import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AppResources } from 'src/app/services/app-info.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { PurchasesService } from 'src/app/services/purchases.service';
import { UserService } from 'src/app/services/user.service';
import { Product } from 'src/app/structure/product';
import { NewPurchase, Purchase } from 'src/app/structure/purchases';
import { User } from 'src/app/structure/user';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  public isMobile: boolean;
  public hasProducts: boolean;
  public user: User;
  public products: { product: Product, amount: number }[] = [];
  private loadingAlert: string;
  private loading: boolean = true;

  //Subscriptions
  private subscriptions: Subscription[] = [];
  private subscription1: Subscription;
  private subscription2: Subscription;

  constructor(private userService: UserService, private alertService: AlertService, private router: Router, private prodServ: ProductService, private cartServ: CartService,
    private purchaseService: PurchasesService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUserAndCart();
    this.GetPlataformInfo();
  }

  ionViewWillLeave() {
    this.loading = true;
    this.user = null;
    this.products = [];
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    if (this.subscriptions && this.subscriptions.length > 0) {
      for (var sub of this.subscriptions) {
        if (sub && !sub.closed)
          sub.unsubscribe();
      }
      this.subscriptions = [];
    }
  }

  GetPlataformInfo() {
    this.subscription2 = AppResources.GetAppInfo().subscribe(info => {
      this.isMobile = info.appWidth <= AppResources.maxMobileWidth;
      this.setDivWidth(((info.appWidth * .4 > (AppResources.maxMobileWidth / 1.5)) ? "40%" : (AppResources.maxMobileWidth / 1.5) + "px"));
    });
  }

  setDivWidth(value: string) {
    document.body.style.setProperty('--maxWidth', value);
  }

  async getUserAndCart() {
    await this.alertService.presentLoading().then(ans => this.loadingAlert = ans);
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    this.subscription1 = AppResources.GetUserInfo().subscribe(async ans => {
      if (!ans) {
        await this.router.navigate(["/login"]);
        await this.alertService.dismissLoading(this.loadingAlert);
        return;
      }
      this.user = ans;
      if (this.user && this.user.cart && this.user.cart.length > 0) {
        this.hasProducts = true;
        await this.getProducts();
      } else {
        this.hasProducts = false;
        if (this.loading) {
          await this.alertService.dismissLoading(this.loadingAlert);
          this.loading = false;
        }
      }
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlert);
      await this.alertService.presentAlert("Ops", "Algo deu errado, tente novamente mais tarde.");
    });
  }

  async getProducts() {
    var products: { product: Product, amount: number }[] = [];
    if (this.subscriptions && this.subscriptions.length > 0) {
      for (var sub of this.subscriptions) {
        if (sub && !sub.closed)
          sub.unsubscribe();
      }
      this.subscriptions = [];
    }
    var shouldWait: boolean = true;
    var shouldWait2: boolean = true;
    var index: number = 0;
    var arrayLength = (this.user.cart && this.user.cart.length > 0) ? this.user.cart.length : null;
    for (var item of this.user.cart) {
      shouldWait2 = true;
      this.subscriptions.push((await this.prodServ.Get(item.productID)).subscribe(product => {
        var prod: Product = product;
        prod.id = item.productID;
        var item2: { product: Product, amount: number } = { product: prod, amount: item.amount }
        products.push(item2);
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
    //if this bugs and duplicates appear uncomment the code below: 
    //this.products = this.products.filter((item, index, array) => index === array.findIndex(item2 => (item2.product.id === item.product.id)));
    this.products = products;
    if (this.loading) {
      await this.alertService.dismissLoading(this.loadingAlert);
      this.loading = false;
    }
    return;
  }

  async DecreaseAmount(id: string) {
    await this.alertService.presentLoading().then(ans => this.loadingAlert = ans);
    this.cartServ.RemoveItem(id, this.user.cart);
    await this.SendChanges(id, false);
  }

  async IncreaseAmount(id: string, stock: number, currentAmount: number) {
    if(currentAmount >= stock){
      this.alertService.presentAlert("Ops", "O produto não possui mais estoque.");
      return;
    }
    await this.alertService.presentLoading().then(ans => this.loadingAlert = ans);
    this.cartServ.AddItem(id, this.user.cart);
    await this.SendChanges(id, true);
  }

  async SendChanges(productID?: string, increasing?: boolean) {
    await this.userService.UpdateCart(this.user.id, this.user.cart).then(async ans => {
      await this.alertService.dismissLoading(this.loadingAlert);
      await this.alertService.ShowToast('Itens Changed');
    }, async err => {
      if (productID && increasing != undefined) {
        if (increasing)
          this.cartServ.RemoveItem(productID, this.user.cart);
        else
          this.cartServ.AddItem(productID, this.user.cart);
        await this.alertService.presentAlert("Oops", `There was a problem ${(increasing) ? "increasing" : "decreasing"} the amount of the item from the cart`);
      }
    });
  }

  async FinishPurchase() {
    var confirmation: boolean;
    await this.alertService.confirmationAlert("Comprar", "Clique em ok para efetuar a compra.").then(ans => confirmation = ans);
    if (!confirmation)
      return;
    await this.alertService.presentLoading().then(ans => this.loadingAlert = ans);
    for (var item of this.products) {
      var shouldWait = true;
      var purchase: Purchase = NewPurchase(this.user.id, item.product.sellerID, { productID: item.product.id, amount: item.amount });
      await this.purchaseService.Add(purchase).then(async () => {
        await this.prodServ.UpdateStock(item.product.id, item.product.stock - item.amount);
      }).catch(err => {
        this.alertService.presentAlert("Ocorreu um erro", `Produto ${item.product.name} não pode ser comprado, tente novamente mais tarde.`);
      }).finally(() => { shouldWait = false; });
      while (shouldWait)
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    await this.userService.UpdateCart(this.user.id, []).then(async () => {
      this.user.cart = [];
      this.products = [];
      await this.alertService.dismissLoading(this.loadingAlert);
      await this.alertService.presentAlert("Wheee", "The itens you purchased will be shipped in the next 2534 years");
      await this.router.navigate(["/purchases/purchases"]);
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlert);
      await this.alertService.presentAlert("Ops", "Não foi possivel remover os itens do carrinho apos a compra, Por favor verifique suas compras antes de comprar novamente.");
    });
  }
}