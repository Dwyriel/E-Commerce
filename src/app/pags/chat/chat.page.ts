import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AppResources, PlatformType } from 'src/app/services/app-info.service';
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
  public isDesktopPlatform: boolean;
  public inputedText: string = ""; //wont reset when leaving view. that's intentional.

  private loadingAlertID: string;
  private purchase: Purchase = null;
  private id: string;
  private shouldBreak = false;
  private interruptWhile = false;
  private messageSent = true;

  //Subscription
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  private subscription5: Subscription;
  private subscription6: Subscription;

  @ViewChild(IonContent) content: IonContent;

  constructor(private activatedRoute: ActivatedRoute, private purchaseService: PurchasesService, private chatService: ChatService, private userService: UserService, private alertService: AlertService, private router: Router, private navController: NavController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.shouldBreak = false;
    this.GetPlataformInfo();
    await this.getLoggedUser();
    await this.GetPurchase();
    this.setInputPadding();
  }

  ionViewWillLeave() {
    this.shouldBreak = true;
    this.messageSent = true;
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
  }

  GetPlataformInfo() {
    this.subscription1 = AppResources.GetAppInfo().subscribe(info => {
      this.isMobile = info.appWidth <= AppResources.maxMobileWidth;
      this.isDesktopPlatform = info.platform == PlatformType.desktop;
      this.setDivWidth(((info.appWidth * .4 > (AppResources.maxMobileWidth / 1.5)) ? "40%" : (AppResources.maxMobileWidth / 1.5) + "px"));
    });
  }

  setDivWidth(value: string) {
    document.body.style.setProperty('--maxWidth', value);
  }

  async setInputPadding() {
    //quick note, this is not good performance wise, but it's "the best way" to do it. it's not, but other methods are either more complex and not worth the trouble or wasn't compiling (ResizeObserver, which is amazing but as I said, wasn't compiling).
    await new Promise(resolve => setTimeout(resolve, 1000));
    var element = document.getElementById("input-textarea")
    var prevVal = -1;
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (this.interruptWhile) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.interruptWhile = false;
      }
      if (element.offsetHeight == prevVal)
        continue;
      var toSet = (element.offsetHeight) + ((element.offsetHeight == 0) ? 65 : 30); //love them magic numbers :d
      document.body.style.setProperty('--reqPadding', toSet + "px");
      this.content.scrollByPoint(0, toSet, 0);
      prevVal = element.offsetHeight;
      if (this.shouldBreak)
        break;
    }
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
      this.scrollToBotton();
      if (this.subscription4 && !this.subscription4.closed)
        this.subscription4.unsubscribe();
      this.PostMessagesSubscription();
      shouldWait = false;
    }, err => {
      this.ErrorHandling("Ops", "Ocorreu um erro ao carregar as mensagens, tente novamente mais tarde.", false);
      shouldWait = false;
    });
    while (shouldWait)
      await new Promise(resolve => setTimeout(resolve, 10));
    return;
  }

  async PostMessagesSubscription() {
    if (this.subscription5 && !this.subscription5.closed)
      this.subscription5.unsubscribe();
    this.subscription5 = (await this.chatService.GetAllFromPurchase(this.purchase.id)).subscribe(ans => {
      if (this.messageSent) {
        this.messageSent = false;
        return;
      }
      this.messages.push(ans[ans.length - 1]);
      this.scrollToBotton();
    }, async err => {
      this.ErrorHandling("Ops", "Ocorreu um erro ao carregar novas mensagens, tente novamente mais tarde.", false);
    })

  }

  async GetOtherUser() {
    var shouldWait: boolean = true;
    var toBeRetrivedUserId = (this.loggedUser.id == this.purchase.sellerId) ? this.purchase.userId : this.purchase.sellerId;
    if (this.subscription6 && !this.subscription6.closed)
      this.subscription6.unsubscribe();
    this.subscription6 = (await this.userService.Get(toBeRetrivedUserId)).subscribe(ans => {
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

  async EnterKeyInput() {
    if (!this.isDesktopPlatform)
      return;
    await this.SendMessage();
  }

  async SendMessage() {
    if (this.inputedText == "" || this.inputedText == null)
      return;
    var chat: PurchaseChat = this.CreateMessageObject(this.inputedText);
    if (this.subscription5 && !this.subscription5.closed)
      this.subscription5.unsubscribe();
    this.messageSent = true;
    await this.chatService.Add(chat).then(ans => {
      this.inputedText = "";
      this.interruptWhile = true;
      chat.date = new Date();
      this.messages.push(chat);
      this.scrollToBotton();
      this.PostMessagesSubscription();
    }).catch(err => {
      this.PostMessagesSubscription();
      this.alertService.presentAlert("Erro", "Não foi possivel enviar sua mensagem. Tente novamente.");
    });
  }

  CreateMessageObject(text: string) {
    var obj: PurchaseChat = new PurchaseChat();
    obj.purchaseId = this.purchase.id;
    obj.senderId = this.loggedUser.id;
    obj.message = text;
    return obj;
  }

  scrollToBotton() {
    this.interruptWhile = true;
    setTimeout(() => {
      this.content.scrollToBottom(500);
    }, 300);
  }
}
