import { Component, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';;

import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularDelegate } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User, UserType } from 'src/app/structure/user';
import { AlertService } from 'src/app/services/alert.service';
import { ValidationService } from 'src/app/services/validation.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.page.html',
  styleUrls: ['./user-form.page.scss'],
})
export class UserFormPage implements OnInit {

  public width: number;
  public logged: boolean = false;
  public user: User = new User;
  public title: string = "Dados da Conta";
  public minlength: number = 6;
  
  private loadingAlert: string;
  private subscription1: Subscription;
  private subscription2: Subscription;

  public confirm = ""; // confirm password ?!
  
  // telefone
  public ddd: string;
  public number: string;
  public telefone: string;

  constructor(
    private platform: Platform,
    private userService: UserService, 
    public Validation: ValidationService, 
    private alertService: AlertService, 
    private router: Router
    ) { 
      this.getScreenDimations();
    }

  ngOnInit() {
    this.getScreenDimations();
  }
  ionViewWillEnter() {
    this.checkIfLogged();
  }

  ionViewWillLeave() {
    this.user = new User();
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
    this.subscription1 = this.userService.auth.user.subscribe(async ans => {//will always return an ans, even if not logged in, but ans will be null
      if (!ans) {
        this.logged = false;
        this.user = new User();
        this.confirm = null;
        this.user.userType = UserType.User;
        this.title = "Novo Usuário";
        await this.alertService.dismissLoading(this.loadingAlert)
        return;
      }
      if (this.subscription2 && !this.subscription2.closed)
        this.subscription2.unsubscribe();
      this.subscription2 = (await this.userService.Get(ans.uid)).subscribe(data => { this.user = data; this.user.id = ans.uid;});
      this.logged = true;
      await this.alertService.dismissLoading(this.loadingAlert)
    });
  }
  
  async OnFormSubmit(form: NgForm) {
    if (form.valid) {
      await this.alertService.presentLoading().then(ans => { this.loadingAlert = ans; });

      this.TelFone(this.ddd, this.telefone);
      this.user.tel = this.telefone;

      if (!this.logged)
        await this.userService.AddUser(this.user).then(
          ans => {
            form.reset;
            this.successfulSubmit("Parabens", "Registro efetuado com sucesso.", "");
          }, err => {
            this.failedSubmit("Ocorreu um erro", "Seu registro não pôde ser efetuado.", err)
          });
      else {
        this.userService.Update(this.user).then(
          ans =>{
            form.reset();
            this.successfulSubmit("Sucesso!", "Seu perfil foi atualizado.", "/");
          }, err => {
            this.failedSubmit("Ocorreu um erro", "Seu perfil não pôde ser atualizado.", err);
          });
      }
    }
  }

  successfulSubmit(title: string, description: string, navigateTo: string) {
    this.user = new User();
    this.logged = false;
    this.alertService.presentAlert(title, description);
    setTimeout(() => this.alertService.dismissLoading(this.loadingAlert), 200);
    setTimeout(() => this.router.navigate([navigateTo]), 300);
  }

  failedSubmit(title: string, description: string, err) {
    console.log(err);
    this.alertService.presentAlert(title, description);
    setTimeout(() => this.alertService.dismissLoading(this.loadingAlert), 200);
  }

  async TelFone(ddd:string, tel:string){
    this.telefone = ddd + tel;
    return this.telefone;
  }

  getScreenDimations() {
    this.width = this.platform.width();
  }
}