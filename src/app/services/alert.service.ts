import { Injectable } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private loadingController: LoadingController, private alertController: AlertController, private toastController: ToastController, private actionSheetController: ActionSheetController) { }

  /**Creates and shows a loading popup.
   * @returns the id of the element created.
  */
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading!',
      backdropDismiss: true
    });
    await loading.present();
    return loading.id;
  }

  /**dismisses the top overlay, or the overlay with the id, if provided.*/
  async dismissLoading(id?: string) {//made some changes on this class. might not work as intended.
    await this.loadingController.dismiss(undefined, undefined, (id) ? id : undefined);
  }

  /**Creates and presents an alert message.
   * @param title the title shown on the top of the alert message
   * @param text the text shown in the middle of the alert message
   */
  async presentAlert(title: string, text: string) {
    const alert = await this.alertController.create({
      header: title,
      message: text,
      buttons: ['OK'],
    });
    await alert.present();
    return alert.id;
  }

  /**Creates and presents an alert message with 2 buttons and a return. 
   * @param title the title shown on the top of the alert message
   * @param text the text shown in the middle of the alert message
   * @returns a boolean value based on the button the user pressed. true for ok, false for cancel. 
   */
  async confirmationAlert(title: string, description: string): Promise<boolean> {
    const alert = await this.alertController.create({
      header: title,
      message: description,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        }, {
          text: 'OK',
          handler: () => {
            alert.dismiss(true);
            return false;
          }
        }
      ]
    });
    var returned;
    await alert.present();
    await alert.onDidDismiss().then((data) => { returned = data; });
    return returned.data;
  }

  //leaving the structure so it can be changed and used later
  /**Not yet functional
   */
  async presentActionSheet() {
    var variable;
    const actionSheet = await this.actionSheetController.create({
      header: 'to be changed header',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'title 1',
        handler: () => {
          actionSheet.dismiss("Return 1");
          return false;
        }
      }, {
        text: 'title 2',
        handler: () => {
          actionSheet.dismiss("Return 2");
          return false;
        }
      }, {
        text: 'title 3',
        handler: () => {
          actionSheet.dismiss("Return 3");
          return false;
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => { }
      }]
    });
    await actionSheet.present();
    await actionSheet.onDidDismiss().then((data) => { variable = data.data });
    return variable;
  }

  /**Creates and presents a toast. 
   * @param text the text of the toast.
   * @param duration the amount of time in ms the toast will be shown to the user, default is 2000ms. 
   * @returns the created toast's id.
   */
  async ShowToast(text: string, duration?: number) {
    const toast = await this.toastController.create({
      message: text,
      color: "tertiary",
      duration: (duration) ? duration : 2000,
      animated: true,
      mode: "ios"
    });
    await toast.present();
    return toast.id;
  }
}
