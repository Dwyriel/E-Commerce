import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AppInfoService } from 'src/app/services/app-info.service';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';
import { Categories, Category, SubCategories, SubCategory } from 'src/app/structure/categories';
import { ItemClassification } from 'src/app/structure/item-classification';
import { Product } from 'src/app/structure/product';
import { User } from 'src/app/structure/user';

export const slideOpts = {
  slidesPerView: 1,
  slidesPerColumn: 1,
  slidesPerGroup: 1,
  watchSlidesProgress: true,
}

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.page.html',
  styleUrls: ['./product-form.page.scss'],
})
export class ProductFormPage implements OnInit {

  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private loadingPopupID: string;

  public title: string = "Formulário de Produto";
  public slideOpts = slideOpts;
  public isMobile: boolean;
  public product: Product = new Product();
  public user: User = null;
  public cats: Category[] = ItemClassification.Categories();
  public subCats: SubCategory[];
  public categoryValue: number = null;
  public subCategoryValue: number = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private productService: ProductService,
    private imageService: ImageService,
    private navController: NavController,
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.checkForUserAndProduct();
    this.GetPlataformInfo();
  }

  ionViewWillLeave() {
    this.user = null;
    this.product = new Product();
    this.categoryValue = null;
    this.subCategoryValue = null;
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

  async checkForUserAndProduct() {
    await this.alertService.presentLoading().then(ans => this.loadingPopupID = ans);
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    this.subscription2 = AppInfoService.GetUserInfo().subscribe(async ans => {
      if (!ans) {
        await this.router.navigate(["/"]);
        await this.alertService.dismissLoading(this.loadingPopupID);
        return;
      }
      this.user = ans;
      await this.checkForProduct();
    });
  }

  async checkForProduct() {
    this.product.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.product.id) {
      if (this.subscription3 && !this.subscription3.closed)
        this.subscription3.unsubscribe();
      this.subscription3 = (await this.productService.Get(this.product.id)).subscribe(async ans => {
        if (ans.sellerID != this.user.id) {
          await this.alertService.dismissLoading(this.loadingPopupID);
          await this.router.navigate(["/"]);
          return;
        }
        this.product = ans;
        await this.alertService.dismissLoading(this.loadingPopupID);
      });
    }
    else {
      this.product.sellerID = this.user.id;
      await this.alertService.dismissLoading(this.loadingPopupID);
    }
  }

  async OnClick(form) {
    if (form.valid) {
      await this.alertService.presentLoading().then(ans => this.loadingPopupID = ans);
      if (!this.product.id) {
        await this.productService.Add(this.product).then(async ans => {
          await form.reset();
          await this.successfulSubmit("Atenção", "Produto registrado!", "/product");//todo change url
        }, async err => {
          console.error(err);
          await this.failedSubmit("Erro", "Produto não registrado!");
        });
      } else {
        this.productService.Update(this.product, this.product.id).then(async ans => {
          await this.successfulSubmit("Atenção", "Produto foi atualizado!", "/product/" + this.product.id);//todo change url
        }, async err => {
          console.error(err);
          await this.failedSubmit("Error", "Produto não foi atualizado!");
        });
      }
    }
  }

  async successfulSubmit(title: string, description: string, navigateTo: string) {
    await this.alertService.dismissLoading(this.loadingPopupID);
    await this.alertService.presentAlert(title, description);
    await this.router.navigate([navigateTo]);
  }

  async failedSubmit(title: string, description: string) {
    await this.alertService.dismissLoading(this.loadingPopupID);
    await this.alertService.presentAlert(title, description);
  }

  async NewPhoto() {
    if (!this.product.gallery)
      this.product.gallery = [];
    var photo: string;
    await this.imageService.getImage(80).then(async returnedPhoto => {
      await this.alertService.presentLoading().then(ans => this.loadingPopupID = ans);
      if (returnedPhoto) {
        photo = returnedPhoto;
        this.product.gallery.push(photo);
      }
      await this.alertService.dismissLoading(this.loadingPopupID);
    });
  }

  async ChancePhoto(index: number) {
    var photo: string;
    await this.imageService.getImageWithDelete().then(async obj => {
      await this.alertService.presentLoading().then(ans => this.loadingPopupID = ans);
      if (obj) {
        if (obj.delete) {
          this.product.gallery.splice(index, 1);
        } else {
          photo = obj.image;
          this.product.gallery[index] = photo;
        }
      }
      await this.alertService.dismissLoading(this.loadingPopupID);
    });
  }

  CatChange($event) {
    this.subCats = ItemClassification.GetSubCatFrom(this.categoryValue);
    this.subCategoryValue = null;
  }

  SubCatChange(event) {
    this.product.subCatValue = this.subCategoryValue;
    this.product.fillSubCategory();
  }

  GoBack() {
    this.navController.back()
  }
}
