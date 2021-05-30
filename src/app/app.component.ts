import { Component } from '@angular/core';

import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { fromEvent, Observable, Subscription } from "rxjs";

import { User } from './structure/user';
import { AlertService } from './services/alert.service';
import { UserService } from './services/user.service';
import { AppResources, PlatformType } from './services/app-info.service'
import { ItemClassification } from './structure/item-classification';
import { CategoriesComponent } from './components/categories/categories.component';
import { SidebarModalCategory } from './components/sidebar-modal/sidebar-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  // verification log user
  private loadingAlert: string;
  public user: User = null;
  public firebaseAns: boolean;
  public cartItens: number;
  public dropdown;

  //device
  public isMobile: boolean;

  //subscriptions
  private Observable: Observable<Event>;
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;


  constructor(
    private platform: Platform,
    private userService: UserService,
    private alertService: AlertService,
    private popoverController: PopoverController,
    private modalController: ModalController,
  ) {

  }

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
    this.subscription1 = this.userService.auth.user.subscribe(
      async ans => {
        if (ans) {
          this.firebaseAns = true;
          if (this.subscription2 && !this.subscription2.closed)
            this.subscription2.unsubscribe();
          this.subscription2 = (await this.userService.Get(ans.uid)).subscribe(ans2 => {
            this.user = ans2;
            this.user.id = ans.uid;
            if (ans2.cart && ans2.cart.length > 0)
              this.calculateCartItens();
            else
              this.cartItens = 0;
            AppResources.PushUserInfo(this.user);
          });
          return;
        }
        this.firebaseAns = false;
        this.user = null;
        AppResources.PushUserInfo(this.user);
      },
      err => {
        this.user = null;
        AppResources.PushUserInfo(this.user);
        console.log(err);
      });
  }

  calculateCartItens() {
    this.cartItens = 0;
    for (var item of this.user.cart)
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
}