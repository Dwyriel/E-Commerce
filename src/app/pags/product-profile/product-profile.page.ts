import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
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
import { Question } from 'src/app/structure/question'
import { QuestionService } from 'src/app/services/question.service'
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/structure/notification';

@Component({
  selector: 'app-product-profile',
  templateUrl: './product-profile.page.html',
  styleUrls: ['./product-profile.page.scss'],
})
export class ProductProfilePage implements OnInit {
  private id: string;
  private loadingAlert: string;
  private newQuestion: Question = new Question();
  private gotProduct: boolean = false;

  public isMobile: boolean;
  public product: Product = new Product();
  public loggedUser: User = null;
  public SellerUser: User = new User();
  public reviews: Review[] = [];
  public hasReviews: boolean = false;
  public positivos: number = 0;
  public negativos: number = 0;
  public title: string = "Product";
  public loadReviews: number = 2;
  public questions: Question[] = [];
  public question: string = "";
  public hasQuestions: boolean = false;
  public loadQuestions: number = 2;
  public numberQuestions: number;
  public numberReviews: number;
  public slideOpts = {
    slidesPerView: 1,
    slidesPerColumn: 1,
    slidesPerGroup: 1,
    watchSlidesProgress: true,
  }

  //Subscriptions
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  private subscription5: Subscription;
  private subscription6: Subscription;

  @ViewChild(IonContent) content: IonContent;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private productService: ProductService,
    private userService: UserService,
    private reviewService: ReviewService,
    private cartService: CartService,
    private navController: NavController,
    private questionService: QuestionService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.gotProduct = false;
    this.GetPlataformInfo();
    this.getProduct();
    this.getLoggedUser();
  }

  ionViewWillLeave() {
    this.SellerUser = new User();
    this.loggedUser = null;
    this.product = new Product();
    this.id = null;
    this.reviews = [];
    this.hasReviews = false;
    this.question = "";
    this.questions = [];
    this.hasQuestions = false;
    this.newQuestion = new Question();
    this.loadQuestions = 2;
    this.loadReviews = 2;
    this.gotProduct = false;
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
      this.title = this.product.name;
      this.gotProduct = true;
      var awaits = { seller: true, reviews: true, questions: true }
      this.GetSeller(awaits);
      this.getQuestions(awaits);
      this.GetReviews(awaits);
      while (awaits.reviews || awaits.seller || awaits.questions)
        await new Promise(resolve => setTimeout(resolve, 10));
      this.product.calculateAvgRating();
      await this.alertService.dismissLoading(this.loadingAlert);
    }, async err => {
      this.gotProduct = true;
      this.ErrorLoading("Ops", "Ocorreu um erro durante o carregamento das informações, tente denovo daqui a pouco.")
    });
  }

  async getQuestions(awaits) {
    if (this.subscription6 && !this.subscription6.closed)
      this.subscription6.unsubscribe();
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.subscription6 = (await this.questionService.getQuestions(this.id)).subscribe(async ans => {
      for (let question of ans) {
        var shouldWait: boolean = true;
        var subscription = (await this.userService.Get(question.idUser)).subscribe(ans2 => {
          question.user = ans2;
          question.user.id = question.idUser;
          subscription.unsubscribe();
          shouldWait = false;
        }, err => {
          shouldWait = false;
        });
        while (shouldWait)
          await new Promise(resolve => setTimeout(resolve, 10));
      }
      this.questions = ans;
      this.hasQuestions = this.questions.length > 0;
      this.numberQuestions = this.questions.length;
      awaits.questions = false;
    }, err => {
      awaits.questions = false;
    });
  }

  async GetSeller(awaits) {
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    this.subscription3 = (await this.userService.Get(this.product.sellerID)).subscribe(async ans => {
      this.SellerUser = ans;
      awaits.seller = false;
    }, async err => {
      awaits.seller = false;
      this.ErrorLoading("Ops", "Ocorreu um erro durante o carregamento das informações, tente denovo daqui a pouco.")
    });
  }

  async GetReviews(awaits) {
    if (this.subscription4 && !this.subscription4.closed)
      this.subscription4.unsubscribe();
    this.subscription4 = (await this.reviewService.GetAllFromProduct(this.product.id)).subscribe(async ans => {
      this.product.reviews = ans;
      this.hasReviews = this.product.reviews.length > 0;
      this.numberReviews = this.product.reviews.length;
      this.positivos = 0;
      this.negativos = 0;
      for (var vote of this.product.reviews) {
        this.positivos = (vote.recommend) ? ++this.positivos : this.positivos;
        this.negativos = (!vote.recommend) ? ++this.negativos : this.negativos;
      }
      awaits.reviews = false;
    }, async err => {
      awaits.reviews = false;
      this.ErrorLoading("Ops", "Ocorreu um erro durante o carregamento das avaliações, tente denovo daqui a pouco.")
    });

  }

  async getLoggedUser() {
    var shouldWait = true;
    if (this.subscription5 && !this.subscription5.closed)
      this.subscription5.unsubscribe();
    this.subscription5 = AppResources.GetUserInfo().subscribe(async ans => {
      this.loggedUser = ans;
      shouldWait = (ans) ? false : true;
      setTimeout(() => shouldWait = false, 5000);
    });
    while (shouldWait)
      await new Promise(resolve => setTimeout(resolve, 10));
    this.AddRecentView();
  }

  async AddRecentView() {
    if (!this.loggedUser)
      return;
    if (!this.loggedUser.viewList)
      this.loggedUser.viewList = [];
    if (!this.loggedUser.viewList[0] || this.loggedUser.viewList[0] >= 3) {
      this.PutOnViewList(1);
      return;
    }
    this.PutOnViewList(this.loggedUser.viewList[0] + 1);
  }

  async PutOnViewList(nextIndex: number) {
    while (!this.gotProduct)
      await new Promise(resolve => setTimeout(resolve, 10));
    if (!this.product || !this.product.id)
      return;
    this.PutIdInArray(nextIndex);
    await this.userService.UpdateViewList(this.loggedUser.id, this.loggedUser.viewList).catch(err => {
      console.log(err);
    });
  }

  PutIdInArray(nextIndex: number) {
    var indexOfRepeated: number = null;
    for (let i = 1; i < 4; i++) {
      if (this.loggedUser.viewList[i] == this.product.id)
        indexOfRepeated = i;
    }
    if (!indexOfRepeated) {
      this.loggedUser.viewList[0] = nextIndex;
      this.loggedUser.viewList[nextIndex] = this.product.id;
      return;
    }
    if (indexOfRepeated == this.loggedUser.viewList[0])
      return;
    if (indexOfRepeated == nextIndex) {
      this.loggedUser.viewList[0] = nextIndex;
      return;
    }
    var currentIndex = this.loggedUser.viewList[0];
    var tempValue = this.loggedUser.viewList[currentIndex];
    this.loggedUser.viewList[currentIndex] = this.loggedUser.viewList[indexOfRepeated];
    this.loggedUser.viewList[indexOfRepeated] = tempValue;
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

  async submitButton() {
    if (!this.question || this.question.trim().length < 1) {
      await this.alertService.presentAlert("Ops", "Mensagem não pode estar vazia.");
      this.question = "";
      return;
    }
    await this.alertService.presentLoading().then(ans => this.loadingAlert = ans);
    this.newQuestion.text = this.question;
    this.newQuestion.idUser = this.loggedUser.id;
    await this.questionService.add(this.newQuestion, this.id).then(async ans => {
      this.newQuestion = new Question();
      this.question = "";
      await this.alertService.dismissLoading(this.loadingAlert);
      await this.alertService.ShowToast("Sucesso. Comentario Enviado.");
      await this.notificationService.SentNotificationToFirebase(`${this.loggedUser.name} fez uma pergunta sobre ${this.product.name}`, `/product/${this.product.id}`, this.product.sellerID, NotificationType.advertNewQuestion);
    }, async err => {
      console.log(err)
      await this.alertService.ShowToast("Erro. Não foi possível enviar seu comentario");
    });
  }

  cancelButton() {
    this.question = "";
  }

  async submitReply(id: string, text: string, user: User) {
    if (!text || text.trim().length < 1) {
      await this.alertService.presentAlert("Ops", "Mensagem não pode estar vazia.");
      text = "";
      return;
    }
    await this.alertService.presentLoading().then(ans => this.loadingAlert = ans);
    this.newQuestion = new Question();
    this.newQuestion.id = id;
    this.newQuestion.vendorText = text;
    await this.questionService.update(this.newQuestion).then(async ans => {
      this.newQuestion = new Question();
      await this.alertService.dismissLoading(this.loadingAlert);
      await this.alertService.ShowToast("Sucesso. Comentario respondido");
      await this.notificationService.SentNotificationToFirebase(`${this.loggedUser.name} respondeu a sua pergunta sobre o produto ${this.product.name}`, `/product/${this.product.id}`, user.id, NotificationType.advertNewAnwser);
    }, async erro => {
      console.log(erro);
      await this.alertService.ShowToast("Erro. Não foi possível responder");
    });
  }

  async loadingMoreQuestions() {
    this.loadQuestions += 2;
  }

  async hideQuestions() {
    this.loadQuestions = 2;
  }

  async loadingMoreReviews() {
    this.loadReviews += 2;
  }

  async hideReviews() {
    this.loadReviews = 2;
  }

  scrollTo(id: string) {
    if (!this.hasReviews)
      return;
    let y = document.getElementById(id).offsetTop;
    this.content.scrollToPoint(0, y, 1500);
  }
}
