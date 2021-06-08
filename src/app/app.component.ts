import { Component } from '@angular/core';

import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { fromEvent, Observable, Subscription } from "rxjs";

import { User, UserType } from './structure/user';
import { AlertService } from './services/alert.service';
import { UserService } from './services/user.service';
import { AppResources, PlatformType } from './services/app-info.service'
import { ItemClassification } from './structure/item-classification';
import { CategoriesComponent } from './components/categories/categories.component';
import { SidebarModalCategory } from './components/sidebar-modal/sidebar-modal.component';
import { Router } from '@angular/router';
import { AppNotification, GetIconForNotification } from './structure/notification';
import { NotificationService } from './services/notification.service';
import { NotificationComponent } from './components/notification/notification.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  // verification log user
  private loadingAlert: string;
  private alertId: string[] = [];
  public user: User = null;
  public firebaseAns: boolean;
  public isAdmin: boolean;
  public cartItens: number;
  public dropdown;
  public numOfnotifications: number;
  public notifications: AppNotification[] = [];

  //device
  public isMobile: boolean;

  //subscriptions
  private Observable: Observable<Event>;
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  private subscription5: Subscription;

  //search
  public searchtext: string = null;

  constructor(
    private platform: Platform,
    private userService: UserService,
    private alertService: AlertService,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  async ngOnInit() {
    await this.verifyUser();
    this.GetPlataformInfo();
  }

  ngOnDestroy() {
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
    this.getScreenDimations();
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    this.Observable = fromEvent(window, 'resize');
    this.subscription3 = this.Observable.subscribe(event => {
      this.getScreenDimations();
    });
    if (this.subscription4 && !this.subscription4.closed)
      this.subscription4.unsubscribe();
    this.subscription4 = AppResources.GetAppInfo().subscribe(info => {
      this.isMobile = info.appWidth <= AppResources.maxMobileWidth;
    });
  }

  getScreenDimations() {
    AppResources.PushAppInfo({
      appWidth: this.platform.width(),
      appHeight: this.platform.height(),
      platform: this.GetPlatformType()
    });
  }

  GetPlatformType() {
    if (this.platform.is("mobileweb"))
      return PlatformType.mobileweb;
    if (this.platform.is("desktop"))
      return PlatformType.desktop;
    if (this.platform.is("mobile"))
      return PlatformType.mobile;
    return null;
  }

  async verifyUser() {
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    this.subscription1 = this.userService.auth.user.subscribe(async ans => {
      this.alertId = [];
      if (ans) {
        await this.GetUser(ans.uid);
        return;
      }
      this.firebaseAns = false;
      this.user = null;
      AppResources.PushUserInfo(this.user);
    }, err => {
      this.user = null;
      AppResources.PushUserInfo(this.user);
      console.log(err);
    });
  }

  async GetUser(userId: string) {
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    this.subscription2 = (await this.userService.Get(userId)).subscribe(async ans2 => {
      if (!ans2.active) {
        await this.UserNotActive();
      } else {
        this.user = ans2;
        this.user.id = userId;
        this.isAdmin = this.user.userType == UserType.Admin;
        if (ans2.cart && ans2.cart.length > 0)
          this.calculateCartItens();
        else
          this.cartItens = 0;
        this.firebaseAns = true;
        if (this.subscription5 && !this.subscription5.closed)
          this.subscription5.unsubscribe();
        this.subscription5 = (await this.notificationService.GetAllFromUser(this.user.id)).subscribe(async ans3 => {
          for (let notification of ans3) {
            notification.icon = GetIconForNotification(notification.from)
          }
          this.numOfnotifications = ans3.length;
          this.notifications = ans3;
        });
      }
      AppResources.PushUserInfo(this.user);
    });
  }

  async UserNotActive() {
    await this.userService.auth.signOut().then(() => {//only stop subscription if signOut was successful
      if (this.subscription2 && !this.subscription2.closed)
        this.subscription2.unsubscribe();
      if (this.subscription5 && !this.subscription5.closed)
        this.subscription5.unsubscribe();
    });
    this.user = null;
    this.firebaseAns = false;
    if (this.alertId.length < 1) {
      await this.alertService.presentAlert("Aviso", "Esta conta foi desativada, entre em contato com nosso suporte para saber mais").then(alertAns => this.alertId.push(alertAns));
      await this.router.navigate(["/login"]);
    }
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
  }

  calculateCartItens() {
    this.cartItens = 0;
    for (let item of this.user.cart)
      this.cartItens += item.amount;
  }

  async logout() {
    await this.alertService.presentLoading().then(ans => { this.loadingAlert = ans });
    await this.userService.auth.signOut().then(async () => {
      this.user = null;
      AppResources.PushUserInfo(this.user);
      if (this.subscription2 && !this.subscription2.closed)
        this.subscription2.unsubscribe();
      await this.alertService.dismissLoading(this.loadingAlert);
    });
  }

  async ShowCategories(event) {
    AppResources.popovers = [];
    var popover = await this.popoverController.create({
      component: CategoriesComponent,
      event: event,
      mode: 'ios',
      componentProps: { categories: ItemClassification.Categories() }
    });
    popover.present();
    AppResources.popovers.push(popover);
  }

  async ShowCategoriesModal() {
    AppResources.modals = [];
    var modal = await this.modalController.create({
      component: SidebarModalCategory,
      mode: 'ios',
      componentProps: { categories: ItemClassification.Categories() }
    });
    AppResources.modals.push(modal);
    await modal.present();
  }

  async ShowNotifications(event) {
    AppResources.popovers = [];
    var popover = await this.popoverController.create({
      component: NotificationComponent,
      event: event,
      mode: 'md',
      cssClass: "notificationPopover",
      componentProps: { notifications: this.notifications }
    });
    popover.present();
    AppResources.popovers.push(popover);
  }

  async ShowNotificationsModal() {
    AppResources.modals = [];
    var modal = await this.modalController.create({
      component: NotificationComponent,
      mode: 'md',
      componentProps: { notifications: this.notifications, isMobile: this.isMobile }
    });
    modal.present();
    AppResources.modals.push(modal);
  }

  async InputEnter() {
    document.getElementById('btnSearch').click();
  }

  async searchProd() {
    if (this.searchtext == "" || this.searchtext == null) {
      return;
    }
    await this.router.navigate(["/products/" + this.searchtext]);
  }
}