import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { fromEvent, Observable, Subscription } from "rxjs";

import { User } from './structure/user';
import { AlertService } from './services/alert.service';
import { UserService } from './services/user.service';
import { AppInfoService } from './services/app-info.service'
import { ThrowStmt } from '@angular/compiler';

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
  private subscription1: Subscription;

  //device
  public test: boolean;
  private subscription2: Subscription;
  private subscription3: Subscription;

  // change pages for categories
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Articles', url: '/Error', icon: 'newspaper' },
    { title: 'About', url: '/about', icon: 'help-circle' },
  ];


  constructor(
    private platform: Platform,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router
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
  }

  GetPlataformInfo() {//does not need to be async yet
    /**the method below needs to be executed once before, either here, on ngInit or the constructor to get the first values, 
     * because {@link subscription2} doesn't go inside the code until the the {@link window} is resized */
    this.getScreenDimations();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    this.Observable = fromEvent(window, 'resize');
    this.subscription2 = this.Observable.subscribe(event => {
      this.getScreenDimations();
    });
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    this.subscription3 = AppInfoService.GetAppInfo().subscribe(info => {
      this.test = info.appWidth <= AppInfoService.maxMobileWidth;
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
    this.userService.auth.user.subscribe(
      async ans => {
        if (ans) {
          this.firebaseAns = true;
          if (this.subscription1 && !this.subscription1.closed)
            this.subscription1.unsubscribe();
          this.subscription1 = (await this.userService.Get(ans.uid)).subscribe(ans => this.user = ans);
          return;
        }
        this.firebaseAns = false;
        this.user = null;
      },
      err => {
        this.user = null;
        console.log(err);
      });
  }

  async logout() {
    await this.alertService.presentLoading().then(ans => { this.loadingAlert = ans });
    await this.userService.auth.signOut().then(async () => {
      await this.alertService.dismissLoading(this.loadingAlert);
      this.user = null;
      if (this.subscription1 && !this.subscription1.closed)
        this.subscription1.unsubscribe();
    });
  }

}