import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AppResources } from 'src/app/services/app-info.service';
import { ChatService } from 'src/app/services/chat.service';
import { PurchasesService } from 'src/app/services/purchases.service';
import { UserService } from 'src/app/services/user.service';
import { PurchaseChat } from 'src/app/structure/purchase-chat';
import { Purchase } from 'src/app/structure/purchases';
import { User } from 'src/app/structure/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  public title: string = "Carregando";
  public loggedUser: User = new User();
  public otherUser: User = new User();
  public messages: PurchaseChat[] = [];
  public isMobile: boolean;
  public inputedText: string = ""; //wont reset when leaving view. that's intentional.

  private loadingAlertID: string;
  private purchase: Purchase = null;
  private id: string;

  //Subscription
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  private subscription5: Subscription;
  private subscription6: Subscription;
  private subscription7: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private purchaseService: PurchasesService, private chatService: ChatService, private userService: UserService, private alertService: AlertService, private router: Router, private navController: NavController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.GetPlataformInfo();
    await this.getLoggedUser();
    await this.GetPurchase();
  }

  ionViewWillLeave() {
    this.title = "Carregando";
    this.loggedUser = new User();
    this.otherUser = new User();
    this.purchase = null;
    this.messages = [];
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

  GetPlataformInfo() {
    this.subscription1 = AppResources.GetAppInfo().subscribe(info => {
      this.isMobile = info.appWidth <= AppResources.maxMobileWidth;
      this.setDivWidth(((info.appWidth * .4 > (AppResources.maxMobileWidth / 1.5)) ? "40%" : (AppResources.maxMobileWidth / 1.5) + "px"));
    });
  }

  setDivWidth(value: string) {
    document.body.style.setProperty('--maxWidth', value);
  }

  async getLoggedUser() {
    this.subscription2 = AppResources.GetUserInfo().subscribe(ans => {
      if (!ans) {
        this.SendAway("/login");
        return;
      }
      this.loggedUser = ans;
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Algo deu errado, tente novamente mais tarde.");
    });
  }

  async GetPurchase() {
    await this.alertService.presentLoading().then(ans => this.loadingAlertID = ans);
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!this.id) {
      await this.SendAway("/");
      return;
    }
    this.subscription3 = (await this.purchaseService.Get(this.id)).subscribe(async ans => {
      if (!ans) {
        await this.SendAway("/");
        return;
      }
      if (ans.sellerId != this.loggedUser.id && ans.userId != this.loggedUser.id) {
        await this.SendAway("/");
        return;
      }
      this.purchase = ans;
      this.purchase.id = this.id;
      this.title = `Conversa: Compra ${this.purchase.id}`;
      await this.GetMessages();
      await this.GetOtherUser();
      await this.alertService.dismissLoading(this.loadingAlertID);
      console.log(this.loggedUser);
      console.log(this.otherUser);
      console.log(this.purchase);
      console.log(this.messages);
    }, async err => {
      this.ErrorHandling("Ops", "Ocorreu um erro ao carregar o chat, tente novamente mais tarde.");
    });
  }

  async GetMessages() {
    var shouldWait: boolean = true;
    if (this.subscription4 && !this.subscription4.closed)
      this.subscription4.unsubscribe();
    this.subscription4 = (await this.chatService.GetAllFromPurchase(this.purchase.id)).subscribe(ans => {
      this.messages = ans;
      shouldWait = false;
    }, err => {
      this.ErrorHandling("Ops", "Ocorreu um erro ao carregar as mensagens, tente novamente mais tarde.", false);
      shouldWait = false;
    });
    while (shouldWait)
      await new Promise(resolve => setTimeout(resolve, 10));
    return;
  }

  async GetOtherUser() {
    var shouldWait: boolean = true;
    var toBeRetrivedUserId = (this.loggedUser.id == this.purchase.sellerId) ? this.purchase.userId : this.purchase.sellerId;
    if (this.subscription5 && !this.subscription5.closed)
      this.subscription5.unsubscribe();
    this.subscription5 = (await this.userService.Get(toBeRetrivedUserId)).subscribe(ans => {
      this.otherUser = ans;
      this.title = `Conversa: ${this.otherUser.name}`
      shouldWait = false;
    }, err => {
      this.ErrorHandling("Ops", "Algo deu errado, tente novamente mais tarde.", false);
      shouldWait = false;
    });
    while (shouldWait)
      await new Promise(resolve => setTimeout(resolve, 10));
    return;
  }

  async ErrorHandling(title: string, text: string, goBack: boolean = true) {
    await this.alertService.dismissLoading(this.loadingAlertID);
    await this.alertService.presentAlert(title, text);
    if (goBack) this.navController.back();
  }

  async SendAway(sendTo: string) {
    await this.router.navigate([sendTo]);
    await this.alertService.dismissLoading(this.loadingAlertID);
    return;
  }

  async SendMessage() {
    var chat: PurchaseChat = this.CreateMessageObject(this.inputedText);
    await this.chatService.Add(chat).catch(err => this.alertService.presentAlert("Erro", "Não foi possivel enviar sua mensagem. Tente novamente."));
  }

  CreateMessageObject(text: string) {
    var obj: PurchaseChat = new PurchaseChat();
    obj.purchaseId = this.purchase.id;
    obj.sellerId = this.purchase.sellerId;
    obj.buyerId = this.purchase.userId;
    obj.message = text;
    return obj;
  }
}
