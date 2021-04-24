import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppInfoService } from '../../services/app-info.service'
import { Subscription } from 'rxjs';

import { Address } from '../../structure/address';
import { AddresService } from '../../services/addres.service';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';
import { User } from 'src/app/structure/user';


@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.page.html',
  styleUrls: ['./address-form.page.scss'],
})
export class AddressFormPage implements OnInit {
  
  private subscription1: Subscription;
  private subscription2: Subscription;
  private loadingAlert: string;

  public title: string = "Formulário de Endereço";

  public isMobile: boolean;
  public user: User = new User();
  public userId: string;
  public address: Address = new Address();
  public idAddress: string;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private alertService: AlertService, 
    private addressServ: AddresService, 
    private userServ: UserService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.checkIdUser();
    this.GetPlataformInfo();
    this.checkIdAdress();
  }
  GetPlataformInfo() {
    this.subscription2 = AppInfoService.GetAppInfo().subscribe(info => {
      this.isMobile = info.appWidth <= AppInfoService.maxMobileWidth;
      this.setDivWidth(((info.appWidth * .4 > (AppInfoService.maxMobileWidth / 1.5)) ? "40%" : (AppInfoService.maxMobileWidth / 1.5) + "px"));
    });
  }
  setDivWidth(value: string) {
    document.body.style.setProperty('--maxWidth', value);
  }
  async checkIdUser() {
    await this.userServ.auth.user.subscribe(ans => {
      if (!ans) {
        this.router.navigate(["/"]);
      } else if (ans) {
        this.user.id = ans.uid;
      }
    });
  }
  async checkIdAdress(){
    this.idAddress = this.activatedRoute.snapshot.paramMap.get("id");
    if(this.idAddress){
      this.subscription1 = (await this.addressServ.Get(this.idAddress)).subscribe(async res => {
        this.address.state = res.state,
        this.address.city = res.city,
        this.address.cep = res.cep,
        this.address.street = res.street,
        this.address.number = res.number
      });
    }
  }
  
  async OnClick(form) {
    if (form.valid) {
      await this.alertService.presentLoading();
      if (!this.idAddress) {
        await this.addressServ.Add(this.address).then(ans => {
          this.userServ.UpdateAddress(this.user.id, ans.id).then(ans => {
            form.reset();
            this.successfulSubmit("Atenção", "Endereço Registrado!", "/");
          }, err => {
            this.addressServ.Delete(ans.id);
            this.failedSubmit("Erro", "Não foi possível registrar seu endereço");
          });
        }, err => {
          this.failedSubmit("Erro", "Não foi possível registrar seu endereço");
        });
      } else {
        this.addressServ.Update(this.address, this.idAddress).then(asn => {
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
    this.idAddress = null;
    this.address = new Address();
    await this.alertService.dismissLoading(this.loadingAlert);
    await this.alertService.presentAlert(title, description);
    await this.router.navigate([navigateTo]);
  }

  async failedSubmit(title: string, description: string) {
    await this.alertService.dismissLoading(this.loadingAlert);
    await this.alertService.presentAlert(title, description);
  }
}
