import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UserComponent } from 'src/app/components/user/user.component';
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
  private privSortedUsers: User[] = [];
  private isLoading: boolean = true;

  public isMobile: boolean;
  public cachedUsers: User[] = [];
  public users: { user: User, shouldShow: boolean }[] = [];
  public sorting: number = 0;

  //Subscriptions
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;

  constructor(private alertService: AlertService, private router: Router, private userService: UserService, private popoverController: PopoverController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.GetPlataformInfo();
    this.GetUser();
  }

  ionViewWillLeave() {
    this.user = null;
    this.users = [];
    this.cachedUsers = [];
    this.privSortedUsers = [];
    this.sorting = 0;
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
    this.subscription3 = (await this.userService.GetAll()).subscribe(async ans => {
      this.cachedUsers = ans;
      this.sortListing();
      if (this.isLoading) {
        this.isLoading = false;
        await this.alertService.dismissLoading(this.loadingAlertID);
      }
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlertID);
      await this.alertService.presentAlert("Ops", "Algo deu errado, tente novamente mais tarde.");
    });
  }

  async ShowUser(user: User) {
    var popover = await this.popoverController.create({
      component: UserComponent,
      mode: 'md',
      componentProps: { user: user },
      animated: true
    });
    await popover.present();
  }

  async ChangeActive(user: User) {
    var confirm: boolean;
    await this.alertService.confirmationAlert(`${(user.active) ? "Desativar" : "Ativar"}`, `Deseja realmente ${(user.active) ? "desativar" : "ativar"} esse usuario?`).then(ans => confirm = ans);
    if (!confirm)
      return;
    await this.alertService.presentLoading().then(ans => this.loadingAlertID = ans);
    this.userService.UpdateActive(user.id, !user.active).then(async () => {
      await this.alertService.ShowToast(`Usuário foi ${(user.active) ? "desativado" : "ativado"}`);
    }).catch(async err => {
      await this.alertService.ShowToast(`Ocorreu um erro, tente novamente`);
    }).finally(async () => {
      await this.alertService.dismissLoading(this.loadingAlertID);
    });
  }

  async ChangeType(user: User) {
    var confirm: boolean;
    await this.alertService.confirmationAlert(`Privilégio`, `Deseja realmente mudar os privilégios desse usuario para ${(user.userType == UserType.Admin) ? "'Usuário'" : "'Admin'"}?`).then(ans => confirm = ans);
    if (!confirm)
      return;
    await this.alertService.presentLoading().then(ans => this.loadingAlertID = ans);
    this.userService.UpdateType(user.id, (user.userType == UserType.Admin) ? UserType.User : UserType.Admin).then(async () => {
      await this.alertService.ShowToast(`Privilégio alterado para ${(user.userType == UserType.Admin) ? "'Usuário'" : "'Admin'"}`);
    }).catch(async err => {
      await this.alertService.ShowToast(`Ocorreu um erro, tente novamente`);
    }).finally(async () => {
      await this.alertService.dismissLoading(this.loadingAlertID);
    })
  }

  HandleSearchbarInput(event) {
    var input: string = event.target.value.toLowerCase();
    for (let item of this.users) {
      item.shouldShow = item.user.name.toLowerCase().includes(input);
    }
  }

  sortListing() {
    this.users = [];
    switch (this.sorting) {
      case 0:
        this.cachedUsers.forEach(item => {
          this.users.push({ user: item, shouldShow: true });
        })
        break;
      case 1:
        for (let user of this.cachedUsers)
          if (user.active)
            this.users.push({ user: user, shouldShow: true });
        break;
      case 2:
        for (let user of this.cachedUsers)
          if (!user.active)
            this.users.push({ user: user, shouldShow: true });
        break;
    }
  }
}
