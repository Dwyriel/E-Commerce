import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AppResources } from 'src/app/services/app-info.service';
import { UserService } from 'src/app/services/user.service';
import { User, UserType } from 'src/app/structure/user';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.page.html',
  styleUrls: ['./admin-users.page.scss'],
})
export class AdminUsersPage implements OnInit {

  private loadingAlertID: string;
  private user: User;

  public isMobile: boolean;
  public users: User[] = [];

  //Subscriptions
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;

  constructor(private alertService: AlertService, private router: Router, private userService: UserService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.GetPlataformInfo();
    this.GetUser();
  }

  ionViewWillLeave() {
    this.user = null;
    this.users = [];
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
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

  async GetUser() {
    await this.alertService.presentLoading().then(ans => this.loadingAlertID = ans);
    this.subscription2 = AppResources.GetUserInfo().subscribe(async ans => {
      if (!ans) {
        await this.router.navigate(["/login"]);
        await this.alertService.dismissLoading(this.loadingAlertID);
        return;
      }
      if (ans.userType != UserType.Admin) {
        await this.router.navigate(["/"]);
        await this.alertService.dismissLoading(this.loadingAlertID);
        return;
      }
      this.user = ans;
      this.GetUsers();
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Algo deu errado, tente novamente mais tarde.");
    });
  }

  async GetUsers() {
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    this.subscription3 = (await this.userService.GetAll()).subscribe(ans => {
      this.users = ans;
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Algo deu errado, tente novamente mais tarde.");
    });
  }
}
