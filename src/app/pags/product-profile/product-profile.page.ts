import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AppResources } from 'src/app/services/app-info.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { ReviewService } from 'src/app/services/review.service';
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

  private id: string;
  private loadingAlert: string;

  public isMobile: boolean;
  public product: Product = new Product();
  public loggedUser: User = null;
  public SellerUser: User = new User();
  public reviews: Review[] = [];
  public hasReviews: boolean = false;
  public positivos: number = 0;
  public negativos: number = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private productService: ProductService,
    private userService: UserService,
    private reviewService: ReviewService,
    private cartService: CartService,
    private navController: NavController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.GetPlataformInfo();
    this.getProduct();
    this.getLoggedUser();
  }

  ionViewWillLeave() {
    this.SellerUser = null;
    this.loggedUser = null;
    this.product = new Product();
    this.id = null;
    this.reviews = [];
    this.hasReviews = false;
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
    this.subscription1 = AppResources.GetAppInfo().subscribe(info => {
      this.isMobile = info.appWidth <= AppResources.maxMobileWidth;
      this.setDivWidth(((info.appWidth * .4 > (AppResources.maxMobileWidth / 1.5)) ? "40%" : (AppResources.maxMobileWidth / 1.5) + "px"));
    });
  }

  setDivWidth(value: string) {
    document.body.style.setProperty('--maxWidth', value);
  }

  async getProduct() {
    await this.alertService.presentLoading().then(ans => this.loadingAlert = ans);
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (!this.id) {
      this.navController.back();
      await this.alertService.dismissLoading(this.loadingAlert);
      return;
    }
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    this.subscription2 = (await this.productService.Get(this.id)).subscribe(async ans => {
      if (!ans || (ans && !ans.verified)) {
        this.navController.back();
        await this.alertService.dismissLoading(this.loadingAlert);
        return;
      }
      this.product = { ...ans, fillSubCategory: this.product.fillSubCategory, calculateAvgRating: this.product.calculateAvgRating };
      this.product.id = this.id;
      var awaits = { seller: true, reviews: true }
      this.GetSeller(awaits);
      this.GetReviews(awaits);
      while (awaits.reviews || awaits.seller)
        await new Promise(resolve => setTimeout(resolve, 10));
      this.product.calculateAvgRating();
      await this.alertService.dismissLoading(this.loadingAlert);
    }, async err => {
      this.ErrorLoading("Ops", "Ocorreu um erro durante o carregamento das informações, tente denovo daqui a pouco.")
    });
  }

  async GetSeller(awaits) {
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    this.subscription3 = (await this.userService.Get(this.product.sellerID)).subscribe(async ans => {
      this.SellerUser = ans;
      awaits.seller = false;
    }, async err => {
      this.ErrorLoading("Ops", "Ocorreu um erro durante o carregamento das informações, tente denovo daqui a pouco.")
    });
  }

  async GetReviews(awaits) {
    if (this.subscription4 && !this.subscription4.closed)
      this.subscription4.unsubscribe();
    this.subscription4 = (await this.reviewService.GetAllFromProduct(this.product.id)).subscribe(async ans => {
      this.reviews = ans;
      awaits.reviews = false;
      this.hasReviews = this.reviews.length > 1;
      this.positivos = 0;
      this.negativos = 0;
      for (var product of this.reviews) {
        this.positivos = (product.recommend) ? ++this.positivos : this.positivos;
        this.negativos = (!product.recommend) ? ++this.negativos : this.negativos;
      }
    }, async err => {
      this.ErrorLoading("Ops", "Ocorreu um erro durante o carregamento das avaliações, tente denovo daqui a pouco.")
    });

  }

  async getLoggedUser() {
    if (this.subscription5 && !this.subscription5.closed)
      this.subscription5.unsubscribe();
    this.subscription5 = AppResources.GetUserInfo().subscribe(async ans => {
      this.loggedUser = ans;
    });
  }

  async ErrorLoading(title: string, description: string) {
    await this.alertService.dismissLoading(this.loadingAlert);
    await this.alertService.presentAlert(title, description);
  }

  async AddToCart() {
    if (!this.loggedUser) {
      await this.router.navigate(["/login"]);
      return;
    }
    await this.alertService.presentLoading().then(ans => this.loadingAlert = ans);
    if (!this.loggedUser.cart)
      this.loggedUser.cart = [];
    this.cartService.AddItem(this.id, this.loggedUser.cart);
    await this.userService.UpdateCart(this.loggedUser.id, this.loggedUser.cart).then(async ans => {
      await this.alertService.dismissLoading(this.loadingAlert);
      await this.alertService.ShowToast('Added to cart');
    }, async err => {
      this.cartService.RemoveItem(this.id, this.loggedUser.cart);
      await this.alertService.dismissLoading(this.loadingAlert);
      await this.alertService.presentAlert("Oops", "There was a problem adding the item to the cart");
    });

  }
}
