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
  public product: Product = new Product();
  public test: string[] = [];

  private subscription1: Subscription;

  constructor(
    private productService: ProductService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.getLoggedUser();
  }

  ionViewWillEnter() {
  }

  ionViewWillLeave() {
    this.loggedUser = null;
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
  }

  async getLoggedUser() {
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    this.subscription1 = AppResources.GetUserInfo().subscribe(async ans => {
      this.loggedUser = ans;
      this.test = (ans && ans.viewList && ans.viewList.length > 0) ? GetViewListInOrder(ans.viewList) : [];
    });
  }
}
