import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddresService } from 'src/app/services/addres.service';
import { AlertService } from 'src/app/services/alert.service';
import { AppResources } from 'src/app/services/app-info.service';
import { ImageService } from 'src/app/services/image.service';
import { RatingService } from 'src/app/services/rating.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/structure/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private loadingPopupID: string;
  public title: string = "Perfil";
  public id: string;
  public user: User = new User();
  public loggedUser: User = null;
  public telephone: string = "";
  public isMobile: boolean;
  public showButtons: boolean = false;

  //Subscriptions
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  private subscription5: Subscription;
  private subscription6: Subscription;
  private subscription7: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private imageService: ImageService,
    private router: Router, private alertService: AlertService, private addressService: AddresService, private ratingService: RatingService) { }

  ngOnInit() { }

  async ionViewWillEnter() {
    await this.getUser();
    this.GetPlataformInfo()
  }

  ionViewWillLeave() {
    this.user = new User();
    this.loggedUser = null;
    this.telephone = "";
    this.showButtons = false;
    this.id = null;
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    if (this.subscription4 && !this.subscription4.closed)
      this.subscription4.unsubscribe();
    if (this.subscription5 && !this.subscription5.closed)
      this.subscription5.unsubscribe();
    if (this.subscription6 && !this.subscription6.closed)
      this.subscription6.unsubscribe();
    if (this.subscription7 && !this.subscription7.closed)
      this.subscription7.unsubscribe();
  }

  GetPlataformInfo() {
    this.subscription5 = AppResources.GetAppInfo().subscribe(info => {
      this.isMobile = info.appWidth <= AppResources.maxMobileWidth;
      this.setDivWidth(((info.appWidth * .4 > (AppResources.maxMobileWidth / 1.5)) ? "40%" : (AppResources.maxMobileWidth / 1.5) + "px"));
    });
  }

  setDivWidth(value: string) {
    document.body.style.setProperty('--maxWidth', value);
  }

  async getUser() {//this method can and should be divided into multiple methods
    var shouldWait: boolean = true;
    var shouldWait2: boolean = true;
    await this.alertService.presentLoading().then(ans => this.loadingPopupID = ans);
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.subscription1 = (await this.userService.Get(this.id)).subscribe(async ans => {
        this.user = ans;
        this.user.calculateAvgRating = new User().calculateAvgRating;
        this.telephone = this.GetUITel(ans.tel);
        this.title = `Perfil de ${ans.name}`;
        if (ans.addressId) {
          if (this.subscription2 && !this.subscription2.closed)
            this.subscription2.unsubscribe();
          this.subscription2 = (await this.addressService.Get(ans.addressId)).subscribe(async ans2 => { this.user.address = ans2; shouldWait = false; }, err => shouldWait = false);
        }
        else
          shouldWait = false;
        if (this.subscription6 && !this.subscription6.closed)
          this.subscription6.unsubscribe();
        this.subscription6 = (await this.ratingService.GetAllFromUser(this.id)).subscribe(ans3 => { this.user.ratings = ans3; this.user.calculateAvgRating(); shouldWait2 = false; }, err => shouldWait2 = false);
      }, async err => {
        shouldWait = false;
      });
    }
    if (this.id)
      while (shouldWait && shouldWait2)
        await new Promise(resolve => setTimeout(resolve, 10))
    this.subscription3 = AppResources.GetUserInfo().subscribe(async ans => {
      if (ans) {
        this.loggedUser = ans;
        this.loggedUser.id = ans.id;
        if (!this.id) {
          this.user = ans;
          this.user.calculateAvgRating = new User().calculateAvgRating;
          this.title = `Perfil de ${ans.name}`;
          this.telephone = this.GetUITel(ans.tel);
          if (ans.addressId) {
            if (this.subscription4 && !this.subscription4.closed)
              this.subscription4.unsubscribe();
            this.subscription4 = (await this.addressService.Get(ans.addressId)).subscribe(ans2 => this.user.address = ans2);
          }
          if (this.subscription7 && !this.subscription7.closed)
            this.subscription7.unsubscribe();
          this.subscription7 = (await this.ratingService.GetAllFromUser(ans.id)).subscribe(ans3 => { this.user.ratings = ans3; this.user.calculateAvgRating(); });
        }
        await this.alertService.dismissLoading(this.loadingPopupID);
      }
      if (!this.id && !ans) {
        await this.alertService.dismissLoading(this.loadingPopupID);
        await this.router.navigate(["/"]);
      }
      if (this.id && !ans) {
        await this.alertService.dismissLoading(this.loadingPopupID);
      }
      this.showButtons = (!this.id || (this.loggedUser && this.id == this.loggedUser.id)) ? true : false;
    }, async err => {
      await this.alertService.dismissLoading(this.loadingPopupID);
      this.loggedUser = null;
      if (!this.id)
        await this.router.navigate(["/"]);
    });
  }

  async alterPhoto() {
    await this.imageService.getImage().then(async returnedPhoto => {
      await this.alertService.presentLoading().then(ans => this.loadingPopupID = ans);
      if (returnedPhoto) {
        await this.userService.UpdatePhoto(this.user.id, returnedPhoto).then(async () => {
          this.user.photo = returnedPhoto;
          await this.alertService.dismissLoading(this.loadingPopupID);
        });
      } else
        await this.alertService.dismissLoading(this.loadingPopupID);
    });
  }

  async logout() {
    await this.alertService.presentLoading();
    await this.userService.auth.signOut().then(async () => {
      await this.alertService.dismissLoading();
      await this.router.navigate(["/"]);
    });
  }

  GetUITel(tel: string) {
    var ddd = tel.substring(0, 2);
    var number = tel.substring(2);
    var length: number = number.length;
    var part1, part2
    if (length === 9) {
      part1 = number.substring(0, 5);
      part2 = number.substring(5,);
    }
    if (length === 8) {
      part1 = number.substring(0, 4);
      part2 = number.substring(4,);
    }
    return `(${ddd}) ${part1}-${part2}`
  }
}
