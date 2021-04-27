import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AppInfoService } from 'src/app/services/app-info.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { Product } from 'src/app/structure/product';
import { Review } from 'src/app/structure/review';
import { User } from 'src/app/structure/user';

export const slideOpts = {
  slidesPerView: 1,
  slidesPerColumn: 1,
  slidesPerGroup: 1,
  watchSlidesProgress: true,
}

@Component({
  selector: 'app-product-profile',
  templateUrl: './product-profile.page.html',
  styleUrls: ['./product-profile.page.scss'],
})
export class ProductProfilePage implements OnInit {

  
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  private subscription5: Subscription;


  public isMobile: boolean;

  public product: Product = new Product();
  private id: string;
  private loadingAlert: string;

  private loggedUser: User = null;
  private SellerUser: User = new User();
  private newComment: Review = new Review();
  public firebaseAns: boolean;
  public comment: string = "";
  public commenting: boolean = false;
  public comments: Review[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private productService: ProductService,
    private userService: UserService,
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.getProduct();
    this.GetPlataformInfo();
  }
  ionViewWillLeave() {
    this.SellerUser = null;
    this.loggedUser = null;
    this.product = new Product();
    this.id = null;
    this.comment = "";
    this.commenting = false;
    this.loggedUser = null;
    this.newComment = new Review();
    this.comments = [];
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

  GetPlataformInfo() {
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    this.subscription1 = AppInfoService.GetAppInfo().subscribe(info => {
      this.isMobile = info.appWidth <= AppInfoService.maxMobileWidth;
      this.setDivWidth(((info.appWidth * .4 > (AppInfoService.maxMobileWidth / 1.5)) ? "40%" : (AppInfoService.maxMobileWidth / 1.5) + "px"));
    });
  }

  setDivWidth(value: string) {
    document.body.style.setProperty('--maxWidth', value);
  }
  async getProduct() {
    await this.alertService.presentLoading().then(ans => this.loadingAlert = ans);
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (!this.id) {
      this.router.navigate(["/"]);
      return;
    }
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    this.subscription2 = (await this.productService.Get(this.id)).subscribe(async ans => {
      if (!ans.verified) {
        this.router.navigate(["/"]);
        return;
      }
      this.product = ans;

      if (this.subscription3 && !this.subscription3.closed)
        this.subscription3.unsubscribe();
      this.subscription3 = (await this.userService.Get(this.product.sellerID)).subscribe(async ans2 => {
        this.SellerUser.name = ans2.name;
        await this.alertService.dismissLoading(this.loadingAlert);
      }, async err => {
        console.log(err);
        await this.alertService.dismissLoading(this.loadingAlert);
      });
    }, async err => {
      console.log(err);
      await this.alertService.dismissLoading(this.loadingAlert);
    });
  }
}
