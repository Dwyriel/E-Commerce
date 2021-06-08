import { IonContent } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Review } from 'src/app/structure/review';
import { Rating } from 'src/app/structure/rating';
import { ReviewService } from 'src/app/services/review.service';
import { RatingService } from 'src/app/services/rating.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/structure/notification';

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
  public reviewExists: boolean;
  public purchaseLoaded: boolean = false;
  public productLoaded: boolean = false;
  public sellerLoaded: boolean = false;
  public allLoaded: boolean = false;
  public isSeller: boolean;
  public finished: boolean;
  public showChangeState: boolean = false;
  public showReviewDiv: boolean = false;
  public stateValue: number;
  public states: { value: State }[] = [];
  public review: { title: string, content: string, recommend: string } = { title: undefined, content: undefined, recommend: undefined };
  public slideOpts = {
    slidesPerView: 1,
    slidesPerColumn: 1,
    slidesPerGroup: 1,
    watchSlidesProgress: true,
  };

  private loadingAlertID;
  private user: User;
  private id: string;
  private loading = true;
  private ratingId: string;
  private reviewId: string;
  private prevReview: { title: string, content: string, recommend: boolean } = { title: undefined, content: undefined, recommend: undefined };

  //Subscription
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  private subscription5: Subscription;
  private subscription6: Subscription;
  private subscription7: Subscription;

  @ViewChild(IonContent) content: IonContent;

  constructor(private activatedRoute: ActivatedRoute, private purchaseService: PurchasesService, private productService: ProductService, private userService: UserService, private alertService: AlertService, private reviewService: ReviewService, private ratingService: RatingService, private router: Router, private notificationService: NotificationService) { }

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
    this.showReviewDiv = false;
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
    if (this.subscription6 && !this.subscription6.closed)
      this.subscription6.unsubscribe();
    if (this.subscription7 && !this.subscription7.closed)
      this.subscription7.unsubscribe();
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
      this.finished = this.purchase.state == State.Entregue;
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
    this.subscription4 = (await this.productService.GetNoRestriction(this.purchase.item.productID)).subscribe(async ans => {
      this.product = ans;
      await this.GetReview();
      await this.GetRating();
      shouldWait.shouldWait1 = false;
      this.productLoaded = true;
    }, async err => {
      shouldWait.shouldWait1 = false;
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Ocorreu um erro ao carregar o produto, tente novamente mais tarde.");
    });
  }

  async GetReview() {
    if (this.subscription6 && !this.subscription6.closed)
      this.subscription6.unsubscribe();
    this.subscription6 = (await this.reviewService.GetReviewFromPurchase(this.purchase.id)).subscribe(ans => {
      if (ans.length < 1) {
        this.reviewExists = false;
        return;
      }
      this.review.title = ans[0].title;
      this.review.content = ans[0].text;
      this.review.recommend = (ans[0].recommend) ? "true" : "false";
      //repeting to make sure those objects aren't a reference of each other.
      this.prevReview.title = ans[0].title;
      this.prevReview.content = ans[0].text;
      this.prevReview.recommend = ans[0].recommend;
      this.reviewId = ans[0].id;
      this.reviewExists = true;
    }, err => {
      this.reviewExists = false;
    });
  }

  async GetRating() {
    if (this.subscription7 && !this.subscription7.closed)
      this.subscription7.unsubscribe();
    this.subscription7 = (await this.ratingService.GetRatingFromPurchase(this.purchase.id)).subscribe(ans => {
      if (ans.length < 1)
        return;
      this.ratingId = ans[0].id;
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
      await this.alertService.ShowToast("Status foi modificado");
      this.showChangeState = !this.showChangeState;
      this.notificationService.SentNotificationToFirebase(`Status da sua compra foi modificado para ${StateString(this.stateValue)}`, `/purchase/${this.id}`, this.purchase.userId, NotificationType.boughtItemChanged);
    }).catch(async () => {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.ShowToast("Ocorreu um erro ao modificar status");
    });
  }

  segmentChanged(event) {
    this.review.recommend = event.detail.value;
  }

  async SendReview() {
    await this.alertService.presentLoading().then(ans => this.loadingAlertID = ans);
    if (this.reviewExists)
      await this.UpdateReview();
    else
      await this.SendNewReview();
  }

  async UpdateReview() {
    var shouldWait = { shouldWait1: true, shouldWait2: true }
    var waitError = false;
    var hadError = false;
    var wentThrough = { wt1: undefined, wt2: undefined }
    await this.reviewService.Update(this.reviewId, this.review.title, this.review.content, this.review.recommend == "true").then(() => wentThrough.wt1 = true).catch(() => wentThrough.wt1 = false).finally(() => shouldWait.shouldWait1 = false);;
    await this.ratingService.Update(this.ratingId, this.review.recommend == "true").then(() => wentThrough.wt2 = true).catch(() => wentThrough.wt2 = false).finally(() => shouldWait.shouldWait2 = false);;
    while (shouldWait.shouldWait1 && shouldWait.shouldWait2)
      await new Promise(resolve => setTimeout(resolve, 10));
    waitError = (!wentThrough.wt1 || !wentThrough.wt2) ? true : false;
    hadError = waitError;
    if (!wentThrough.wt1 && wentThrough.wt2)
      await this.ratingService.Update(this.ratingId, this.prevReview.recommend).finally(() => waitError = false);
    if (!wentThrough.wt2 && wentThrough.wt1)
      await this.reviewService.Update(this.reviewId, this.prevReview.title, this.prevReview.content, this.prevReview.recommend).finally(() => waitError = false);
    if (!wentThrough.wt2 && !wentThrough.wt1) {
      await this.ratingService.Update(this.ratingId, this.prevReview.recommend);
      await this.reviewService.Update(this.reviewId, this.prevReview.title, this.prevReview.content, this.prevReview.recommend);
      waitError = false;
    }
    while (waitError)
      await new Promise(resolve => setTimeout(resolve, 10));
    if (hadError) {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ocorreu um erro.", "Avaliação não foi atualizada, tente novamente mais tarde.");
      return;
    }
    await this.alertService.dismissLoading(this.loadingAlertID);
    await this.alertService.ShowToast("Avaliação foi atualizada");
    this.showReviewDiv = !this.showReviewDiv;
  }

  async SendNewReview() {
    var rating: Rating = this.FillRating();
    var review: Review = this.FillReview();
    var shouldWait = { shouldWait1: true, shouldWait2: true }
    var waitError = false;
    var hadError = false;
    var wentThrough = { wt1: undefined, wt2: undefined }
    var reviewID;
    var ratingID;
    await this.reviewService.Add(review).then(ans => { reviewID = ans.id; wentThrough.wt1 = true; }).catch(() => wentThrough.wt1 = false).finally(() => shouldWait.shouldWait1 = false);
    await this.ratingService.Add(rating).then(ans => { ratingID = ans.id; wentThrough.wt2 = true; }).catch(() => wentThrough.wt2 = false).finally(() => shouldWait.shouldWait2 = false);
    while (shouldWait.shouldWait1 && shouldWait.shouldWait2)
      await new Promise(resolve => setTimeout(resolve, 10));
    waitError = (!wentThrough.wt1 || !wentThrough.wt2) ? true : false;
    hadError = waitError;
    if (!wentThrough.wt1 && wentThrough.wt2)
      await this.ratingService.Delete(ratingID).finally(() => waitError = false);
    if (!wentThrough.wt2 && wentThrough.wt1)
      await this.reviewService.Delete(reviewID).finally(() => waitError = false);
    if (!wentThrough.wt2 && !wentThrough.wt1) {
      await this.ratingService.Delete(ratingID);
      await this.reviewService.Delete(reviewID);
      waitError = false;
    }
    while (waitError)
      await new Promise(resolve => setTimeout(resolve, 10));
    if (hadError) {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ocorreu um erro.", "Avaliação não foi enviada, tente novamente mais tarde.");
      return;
    }
    await this.alertService.dismissLoading(this.loadingAlertID);
    await this.alertService.ShowToast("Avaliação foi enviada");
    this.showReviewDiv = !this.showReviewDiv;
  }

  FillRating() {
    var rating = new Rating();
    rating.linkedPurchaseId = this.purchase.id;
    rating.ratedUserId = this.purchase.sellerId;
    rating.raterUserId = this.purchase.userId;
    rating.recommend = this.review.recommend == "true";
    return rating;
  }

  FillReview() {
    var review = new Review();
    review.userID = this.purchase.userId;
    review.productID = this.purchase.item.productID;
    review.linkedPurchaseId = this.purchase.id;
    review.title = this.review.title;
    review.text = this.review.content;
    review.recommend = this.review.recommend == "true";
    return review;
  }

  async SendAway(sendTo: string) {
    await this.router.navigate([sendTo]);
    await this.alertService.dismissLoading(this.loadingAlertID);
    return;
  }

  scrollToBotton() {
    setTimeout(() => {
      this.content.scrollToBottom(500);
    }, 100);
  }
}
