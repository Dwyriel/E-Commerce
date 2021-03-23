import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { AlertService } from './alert.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';

const { Camera } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private actionSheetController: ActionSheetController, private alerService: AlertService) { }

  /**
   * Shows an actionSheet for the user to choose where to select the image from.
   * @param quality the quality of the image from 0 to 100, default is 90. Value will be clamped.
   * @returns the image file in DataUrl format
   */
  async getImage(quality?: number) {
    var imageUrl;
    const actionSheet = await this.actionSheetController.create({
      header: 'Existing or new photo?',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: async () => {
          actionSheet.dismiss(await this.takePhoto(quality));
          return false;
        }
      }, {
        text: 'Gallery',
        icon: 'image',
        handler: async () => {
          actionSheet.dismiss(await this.choosePhoto(quality));
          return false;
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => { }
      }]
    });
    await actionSheet.present();
    await actionSheet.onDidDismiss().then((data) => { imageUrl = data.data });
    return imageUrl;
  }

  /**
   * Prompt the user to take a new photo with the camera.
   * @param quality the quality of the image from 0 to 100, default is 90. Value will be clamped.
   * @returns the image file in DataUrl format
   */
  async takePhoto(quality?: number) {
    if (quality)
      quality = Math.min(Math.max(0, quality), 100);
    var imageUrl: string;
    const image = await Camera.getPhoto({
      quality: (quality) ? quality : 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      saveToGallery: false,
    });
    imageUrl = image.dataUrl;
    return imageUrl;
  }

  /**
   * Prompt the user to pick a photo from an album.
   * @param quality the quality of the image from 0 to 100, default is 90. Value will be clamped.
   * @returns the image file in DataUrl format
   */
  async choosePhoto(quality?: number) {
    if (quality)
      quality = Math.min(Math.max(0, quality), 100);
    var imageUrl: string;
    const image = await Camera.getPhoto({
      quality: (quality) ? quality : 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
      saveToGallery: false,
    });
    imageUrl = image.dataUrl;
    return imageUrl;
  }
}