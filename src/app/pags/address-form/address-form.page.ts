import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppInfoService } from '../../services/app-info.service'
import { Subscription } from 'rxjs';

import { Address } from '../../structure/address';
import { AddresService } from '../../services/addres.service';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';
import { User } from 'src/app/structure/user';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.page.html',
  styleUrls: ['./address-form.page.scss'],
})
export class AddressFormPage implements OnInit {

  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private loadingAlert: string;

  public title: string = "Formulário de Endereço";

  public isMobile: boolean;
  public user: User = new User();
  public address: Address = new Address();

  constructor(
    private router: Router,
    private alertService: AlertService,
    private addressServ: AddresService,
    private userServ: UserService,
    public navController: NavController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.user.address = new Address();
    this.checkForUser();
    this.GetPlataformInfo();
  }

  ionViewWillLeave() {
    this.user = new User();
    this.user.address = new Address();
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
  }

  GetPlataformInfo() {
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    this.subscription1 = AppInfoService.GetAppInfo().subscribe(info => {
      this.isMobile = info.appWidth <= AppInfoService.maxMobileWidth;
      this.setDivWidth(((info.appWidth * .4 > (AppInfoService.maxMobileWidth / 1.5)) ? "40%" : (AppInfoService.maxMobileWidth / 1.5) + "px"));
    });
  }

  setDivWidth(value: string) {
    document.body.style.setProperty('--maxWidth', value);
  }

  async checkForUser() {
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    this.subscription2 = AppInfoService.GetUserInfo().subscribe(async ans => {
      if (!ans) {
        await this.router.navigate(["/"]);
        return;
      }
      this.user = ans;
      if (ans.addressId) {
        if (this.subscription3 && !this.subscription3.closed)
          this.subscription3.unsubscribe();
        this.subscription3 = (await this.addressServ.Get(ans.addressId)).subscribe(async ans2 => this.address = ans2);
      }
    });
  }

  async OnClick(form) {
    if (form.valid) {
      await this.alertService.presentLoading();
      if (!this.user.addressId) {
        await this.addressServ.Add(this.address).then(ans => {
          this.userServ.UpdateAddress(this.user.id, ans.id).then(ans => {
            form.reset();
            this.successfulSubmit("Atenção", "Endereço Registrado!", "/profile");
          }, err => {
            this.addressServ.Delete(ans.id);
            this.failedSubmit("Erro", "Não foi possível registrar seu endereço");
          });
        }, err => {
          this.failedSubmit("Erro", "Não foi possível registrar seu endereço");
        });
      } else {
        this.addressServ.Update(this.address, this.user.addressId).then(ans => {
          form.reset();
          this.successfulSubmit("Atenção", "Seu endereço foi atualizado!", "/profile");
        }, err => {
          console.log(err)
          this.alertService.presentAlert("Erro", "Não foi possivel atualizar seu endereço");
        });
      }
    }
  }

  async successfulSubmit(title: string, description: string, navigateTo: string) {
    await this.alertService.dismissLoading(this.loadingAlert);
    await this.alertService.presentAlert(title, description);
    await this.router.navigate([navigateTo]);
  }

  async failedSubmit(title: string, description: string) {
    await this.alertService.dismissLoading(this.loadingAlert);
    await this.alertService.presentAlert(title, description);
  }

  GoBack() {
    this.navController.back()
  }
}
