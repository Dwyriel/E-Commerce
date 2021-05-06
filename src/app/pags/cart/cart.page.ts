import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AppResources } from 'src/app/services/app-info.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { Product } from 'src/app/structure/product';
import { User } from 'src/app/structure/user';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  public user: User;
  public products: { product: Product, amount: number }[] = [];
  private loadingAlert: string;

  //Subscriptions
  private subscriptions: Subscription[] = [];
  private subscription1: Subscription;

  constructor(private userService: UserService, private alertService: AlertService, private router: Router, private prodServ: ProductService, private cartServ: CartService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUserAndCart();
  }

  ionViewWillLeave() {
    this.user = null;
    this.products = [];
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscriptions && this.subscriptions.length > 0) {
      for (var sub of this.subscriptions) {
        if (sub && !sub.closed)
          sub.unsubscribe();
      }
      this.subscriptions = [];
    }
  }

  async getUserAndCart() {
    await this.alertService.presentLoading().then(ans => this.loadingAlert = ans);
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    this.subscription1 = AppResources.GetUserInfo().subscribe(async ans => {
      if (!ans) {
        await this.router.navigate(["/login"]);
        await this.alertService.dismissLoading(this.loadingAlert);
      }
      this.user = ans;
      if (this.user && this.user.cart && this.user.cart.length > 0) {
        await this.getProducts();
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
    var index: number = 0;
    var arrayLength = (this.user.cart && this.user.cart.length > 0) ? this.user.cart.length : null;
    for (var item of this.user.cart) {
      this.subscriptions.push((await this.prodServ.Get(item.productID)).subscribe(product => {
        product.id = item.productID;
        var item2: { product: Product, amount: number } = { product: product, amount: item.amount }
        products.push(item2);
        index++;
        if (index >= arrayLength)
          shouldWait = false;
      }));
    }
    while (shouldWait)
      await new Promise(resolve => setTimeout(resolve, 10));
    //if this bugs and duplicates appear uncomment the code below: 
    //this.products = this.products.filter((item, index, array) => index === array.findIndex(item2 => (item2.product.id === item.product.id)));
    this.products = products;
    await this.alertService.dismissLoading(this.loadingAlert);
    return;
  }

  async DecreaseAmount(id: string) {
    await this.alertService.presentLoading().then(ans => this.loadingAlert = ans);
    this.cartServ.RemoveItem(id, this.user.cart);
    await this.SendChanges(id, false);
  }

  async IncreaseAmount(id: string) {
    await this.alertService.presentLoading().then(ans => this.loadingAlert = ans);
    this.cartServ.AddItem(id, this.user.cart);
    await this.SendChanges(id, true);
  }

  async SendChanges(productID: string, increasing: boolean) {
    await this.userService.UpdateCart(this.user.id, this.user.cart).then(async ans => {
      await this.alertService.ShowToast('Itens Changed');
      //await this.getProducts(); //todo finish testing this
    }, async err => {
      if (increasing)
        this.cartServ.RemoveItem(productID, this.user.cart);
      else
        this.cartServ.AddItem(productID, this.user.cart);
      await this.alertService.presentAlert("Oops", "There was a problem adding the item to the cart");
    });
  }

  FinishPurchase() {
    this.alertService.presentAlert("Wheee", "The itens you purchased will be shipped in the next 2534 years");
    //then clear cart etc, etc. 
  }

}
