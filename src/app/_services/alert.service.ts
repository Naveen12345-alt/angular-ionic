import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private alertController: AlertController) {}

  async warn(message: string) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: `<strong>${message}</strong>`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (blah) => {},
        },
        {
          text: 'Okay',
          role: 'ok',
          handler: () => {},
        },
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();

    return role;
  }
}
