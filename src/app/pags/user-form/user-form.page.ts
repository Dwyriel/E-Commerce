import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';;
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User, UserType } from 'src/app/structure/user';
import { AlertService } from 'src/app/services/alert.service';
import { ValidationService } from 'src/app/services/validation.service';
import { UserService } from 'src/app/services/user.service';

import { AppInfoService } from '../../services/app-info.service'
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.page.html',
  styleUrls: ['./user-form.page.scss'],
})
export class UserFormPage implements OnInit {

  public logged: boolean = false;
  public toBeSentUser: User = new User();
  public loggedUser: User = new User();
  public title: string = "Dados da Conta";
  public minlength: number = 6;

  private loadingAlert: string;

  public confirm = ""; // confirm password ?!

  // telefone
  public ddd: string;
  public number: string;
  public telefone: string;

  //device
  public checkScreen: boolean;

  //subscriptions
  private subscription1: Subscription;
  private subscription2: Subscription;

  constructor(
    private userService: UserService,
    public Validation: ValidationService,
    private alertService: AlertService,
    private router: Router,
    public navCtrl: NavController
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.checkIfLogged();
    this.GetPlataformInfo();
  }

  ionViewWillLeave() {
    this.toBeSentUser = new User();
    this.logged = false;
    this.confirm = null;
    this.ddd = null;
    this.number = null;
    this.telefone = null;
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
  }

  async checkIfLogged() {
    await this.alertService.presentLoading().then(ans => { this.loadingAlert = ans; });
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();

    this.subscription1 = AppInfoService.GetUserInfo().subscribe(async ans => {
      if (!ans) {
        this.logged = false;
        this.toBeSentUser = new User();
        this.confirm = null;
        this.toBeSentUser.userType = UserType.User;
        this.title = "Novo Usuário";
        await this.alertService.dismissLoading(this.loadingAlert)
        return;
      }
      this.loggedUser = this.CreateNewUser(ans);
      this.toBeSentUser = this.CreateNewUser(ans);
      this.ddd = ans.tel.substring(0, 2);
      this.number = ans.tel.substring(2);
      this.logged = true;
      await this.alertService.dismissLoading(this.loadingAlert)
    });
  }

  GetPlataformInfo() {
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    this.subscription2 = AppInfoService.GetAppInfo().subscribe(info => {
      this.checkScreen = info.appWidth <= AppInfoService.maxMobileWidth;
      this.setFormDivWidth(((info.appWidth * .4 > (AppInfoService.maxMobileWidth / 1.5)) ? "40%" : (AppInfoService.maxMobileWidth / 1.5) + "px"))
    });
  }

  async OnFormSubmit(form: NgForm) {
    this.toBeSentUser.tel = this.ddd + this.number;
    console.log(this.toBeSentUser.password);
    console.log(this.loggedUser.password);
    if (form.valid) {
      await this.alertService.presentLoading().then(ans => { this.loadingAlert = ans; });
      this.toBeSentUser.tel = this.ddd + this.number;//easier no? :)
      if (!this.logged)
        await this.userService.AddUser(this.toBeSentUser).then(
          async () => {
            form.reset;
            await this.successfulSubmit("Parabens", "Registro efetuado com sucesso.", "");
          }, async err => {
            await this.failedSubmit("Ocorreu um erro", "Seu registro não pôde ser efetuado.", err)
          });
      else {
        this.userService.auth.signInWithEmailAndPassword(this.loggedUser.email, this.loggedUser.password).then(async ans => {
          await (await this.userService.auth.currentUser).updateEmail(this.toBeSentUser.email).then(async () => {
            await (await this.userService.auth.currentUser).updatePassword(this.toBeSentUser.password).then(async () => {
              this.userService.Update(this.toBeSentUser).then(
                async () => {
                  form.reset();
                  await this.successfulSubmit("Sucesso!", "Seu perfil foi atualizado.", "/");//send to profile?
                }, async err => {
                  await this.failedSubmit("Ocorreu um erro", "Seu perfil não pôde ser atualizado.", err);
                });
            });
          });
        }, async err => {
          await this.alertService.dismissLoading(this.loadingAlert);
          this.loggedUser.password = "";
          await this.alertService.presentAlert("Error", "Senha Antiga não corresponde com a conta.");
        });
      }
    }
  }

  async successfulSubmit(title: string, description: string, navigateTo: string) {
    this.toBeSentUser = new User();
    this.logged = false;
    await this.alertService.presentAlert(title, description);
    await this.alertService.dismissLoading(this.loadingAlert);
    await this.router.navigate([navigateTo]);
  }

  async failedSubmit(title: string, description: string, err) {
    console.log(err);
    await this.alertService.presentAlert(title, description);
    await this.alertService.dismissLoading(this.loadingAlert);
  }

  setFormDivWidth(value: string) {
    document.body.style.setProperty('--maxWidth', value);
  }

  GoBack() {
    this.navCtrl.back()
    this.navCtrl.pop();//not sure if this is the best way, but it does completely wipe out the page instance from the router, meaning it will be reinitiated every time.
  }

  CreateNewUser(user: User) {
    var newUser: User = new User();
    newUser.email = user.email;
    newUser.name = user.name;
    newUser.tel = user.tel;
    newUser.id = user.id
    return newUser;
  }
}