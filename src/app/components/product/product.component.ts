import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Product } from 'src/app/structure/product';
import { User } from 'src/app/structure/user';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

  @Input('product') public product: Product = new Product();
  public SellerUser: User = new User();
  public slideOpts = {
    slidesPerView: 1,
    slidesPerColumn: 1,
    slidesPerGroup: 1,
    watchSlidesProgress: true,
  }

  private subscription1: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit() { }

  async ionViewWillEnter() {
    this.GetSeller();
  }

  ionViewWillLeave() {
    this.product = new Product();
    this.SellerUser = new User();
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
  }

  async GetSeller() {
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    this.subscription1 = (await this.userService.Get(this.product.sellerID)).subscribe(ans => {
      this.SellerUser = ans;
    })
  }
}
