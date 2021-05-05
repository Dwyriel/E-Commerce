import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';;
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User, UserType } from 'src/app/structure/user';
import { AlertService } from 'src/app/services/alert.service';
import { ValidationService } from 'src/app/services/validation.service';
import { UserService } from 'src/app/services/user.service';

import { AppResources } from '../../services/app-info.service'
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

  public pword: string = "";
  public confirm: string = ""; // confirm password ?!

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
    this.confirm = "";
    this.pword = "";
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
    this.subscription1 = AppResources.GetUserInfo().subscribe(async ans => {
      if (!ans) {
        this.logged = false;
        this.toBeSentUser = new User();
        this.toBeSentUser.userType = UserType.User;
        this.title = "Novo Usuário";
        await this.alertService.dismissLoading(this.loadingAlert)
      }
      if (ans) {
        this.loggedUser = this.CreateNewUser(ans);
        this.toBeSentUser = this.CreateNewUser(ans);
        this.ddd = ans.tel.substring(0, 2);
        this.number = ans.tel.substring(2);
        this.logged = true;
        await this.alertService.dismissLoading(this.loadingAlert)
      }
      this.subscription1.unsubscribe();
    });
  }

  GetPlataformInfo() {
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    this.subscription2 = AppResources.GetAppInfo().subscribe(info => {
      this.checkScreen = info.appWidth <= AppResources.maxMobileWidth;
      this.setFormDivWidth(((info.appWidth * .4 > (AppResources.maxMobileWidth / 1.5)) ? "40%" : (AppResources.maxMobileWidth / 1.5) + "px"))
    });
  }

  async OnFormSubmit(form: NgForm) {
    this.toBeSentUser.tel = this.ddd + this.number;
    if (form.valid) {
      await this.alertService.presentLoading().then(ans => { this.loadingAlert = ans; });
      this.toBeSentUser.tel = this.ddd + this.number;
      if (!this.logged)
        await this.userService.AddUser(this.toBeSentUser).then(
          async () => {
            form.reset;
            await this.successfulSubmit("Parabens", "Registro efetuado com sucesso.", "");
          }, async err => {
            await this.failedSubmit("Ocorreu um erro", "Seu registro não pôde ser efetuado.");
          });
      else {
        await this.userService.auth.signInWithEmailAndPassword(this.loggedUser.email, this.loggedUser.password).then(async ans => {
          await (await this.userService.auth.currentUser).updatePassword(this.pword).then(async () => {
            await (await this.userService.auth.currentUser).updateEmail(this.toBeSentUser.email).then(async () => {
              this.userService.Update(this.toBeSentUser).then(
                async () => {
                  form.reset();
                  await this.successfulSubmit("Sucesso!", "Seu perfil foi atualizado.", "/profile");
                }, async err => {
                  await this.failedSubmit("Ocorreu um erro", "Seu perfil não pôde ser atualizado. Senha e Email atualizados.");
                });
            }, async err => {
              this.UpdateError("Erro", "Não foi possivel atualizar o email. Senha atualizada.");
            });
          }, async err => {
            this.UpdateError("Error", "Não foi possivel atualizar a senha.");
          });
        }, async err => {
          this.UpdateError("Error", "Senha Antiga não corresponde com a conta.");
        });
      }
    }
  }

  async UpdateError(title: string, message: string) {
    await this.alertService.dismissLoading(this.loadingAlert);
    this.loggedUser.password = "";
    await this.alertService.presentAlert("Error", "Senha Antiga não corresponde com a conta.");
  }

  async successfulSubmit(title: string, description: string, navigateTo: string) {
    this.toBeSentUser = new User();
    this.loggedUser = new User();
    this.logged = false;
    await this.alertService.dismissLoading(this.loadingAlert);
    await this.alertService.presentAlert(title, description);
    await this.router.navigate([navigateTo]);
  }

  async failedSubmit(title: string, description: string) {
    await this.alertService.dismissLoading(this.loadingAlert);
    await this.alertService.presentAlert(title, description);
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