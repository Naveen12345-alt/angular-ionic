import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private alertController: ToastController) {}
  async success(msg) {
    const alert = await this.alertController.create({
      message: msg,
      position: 'bottom',
      duration: 3000,
      color: 'success',
    });
    await alert.present();
  }
  async warn(msg) {
    const alert = await this.alertController.create({
      message: msg,
      position: 'bottom',
      duration: 3000,
      color: 'danger',
    });

    await alert.present();
  }
}
