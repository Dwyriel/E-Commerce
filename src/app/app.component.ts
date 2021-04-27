import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { fromEvent, Observable, Subscription } from "rxjs";

import { User } from './structure/user';
import { AlertService } from './services/alert.service';
import { UserService } from './services/user.service';
import { AppInfoService } from './services/app-info.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  // verification log user
  public user: User = null;
  private loadingAlert: string;
  public firebaseAns: boolean;

  //device
  public isMobile: boolean;

  //subscriptions
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;


  constructor(
    private platform: Platform,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router//could probably remove this
  ) {

  }

  private Observable: Observable<Event>;
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

  GetPlataformInfo() {//does not need to be async yet
    /**the method below needs to be executed once before, either here, in ngInit or in the constructor to get the first values, 
     * because {@link subscription3} doesn't go inside the code until the the {@link window} is resized */
    this.getScreenDimations();
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    this.Observable = fromEvent(window, 'resize');
    this.subscription3 = this.Observable.subscribe(event => {
      this.getScreenDimations();
    });
    if (this.subscription4 && !this.subscription4.closed)
      this.subscription4.unsubscribe();
    this.subscription4 = AppInfoService.GetAppInfo().subscribe(info => {
      this.isMobile = info.appWidth <= AppInfoService.maxMobileWidth;
    });
  }

  getScreenDimations() {
    AppInfoService.PushAppInfo({
      appWidth: this.platform.width(),
      appHeight: this.platform.height(),
      isDesktop: this.platform.is('desktop')
    });
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
            AppInfoService.PushUserInfo(this.user);
          });
          return;
        }
        this.firebaseAns = false;
        this.user = null;
        AppInfoService.PushUserInfo(this.user);
      },
      err => {
        this.user = null;
        AppInfoService.PushUserInfo(this.user);
        console.log(err);
      });
  }

  async logout() {
    await this.alertService.presentLoading().then(ans => { this.loadingAlert = ans });
    await this.userService.auth.signOut().then(async () => {
      this.user = null;
      AppInfoService.PushUserInfo(this.user);
      if (this.subscription2 && !this.subscription2.closed)
        this.subscription2.unsubscribe();
      await this.alertService.dismissLoading(this.loadingAlert);
    });
  }

}