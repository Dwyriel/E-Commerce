import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { ValidationService } from 'src/app/services/validation.service';
import { UserService } from 'src/app/services/user.service';
import { AppInfoService } from '../../services/app-info.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email: string = "";
  public password: string = "";

  //device
  public checkScreen: boolean;

  //Subscriptions
  private subscription1: Subscription;
  private subscription2: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    public validationService: ValidationService,
    private alertService: AlertService,
    public navCtrl: NavController
    ) {
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.GetPlataformInfo();
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    this.subscription1 = AppInfoService.GetUserInfo().subscribe(ans => {
      if (ans)
        this.router.navigate(["/"]);
    });
  }

  ionViewWillLeave() {
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
  }

  async OnFormSubmit(form: NgForm) {
    var loadingId: string;
    await this.alertService.presentLoading().then(ans => loadingId = ans);
    await this.userService.auth.signInWithEmailAndPassword(this.email, this.password).then(
      async ans => {
        await this.alertService.dismissLoading(loadingId);
        form.reset();
        await this.router.navigate(["/"]);
      },
      async err => {
        await this.alertService.dismissLoading(loadingId);
        this.password = "";
        await this.alertService.presentAlert("Error", "Email ou Senha invalidos");
      });
  }

  GetPlataformInfo() {
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    this.subscription2 = AppInfoService.GetAppInfo().subscribe(info => {
      this.checkScreen = info.appWidth <= AppInfoService.maxMobileWidth;
      this.setLoginDivWidth(((info.appWidth * .4 > (AppInfoService.maxMobileWidth / 1.5)) ? "40%" : (AppInfoService.maxMobileWidth / 1.5) + "px"));
    });
  }

  RecoveryPass(email: string) {
    this.userService.auth.sendPasswordResetEmail(
      email,
      { url: 'http://localhost:8100' }
    ).then(
      async () => {
        await this.alertService.presentAlert("Sucesso", "E-mail de recuperação enviado para sua caixa de mensagens");
        await this.router.navigate(["/"]);
      },
      async err => {
        await this.alertService.presentAlert("Sucesso", "E-mail de recuperação enviado para sua caixa de mensagens");
        await this.router.navigate(["/"]);
      }
    );
  }

  setLoginDivWidth(value: string) {
    document.body.style.setProperty('--maxWidth', value);
  }

  GoBack() {
    this.navCtrl.back()
  }
}