import { Component, Input, OnInit } from '@angular/core';
import {
  AccountService,
  AlertService,
  NotificationService,
  TaskService,
  ToastService,
} from '@app/_services';
import { ModalController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { DialogPage } from '../dialog/dialog.page';

@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss'],
})
export class HeaderPage implements OnInit {
  numberOfNotifications: number;
  loggedIn = false;

  constructor(
    private accountService: AccountService,
    private notificationService: NotificationService,
    private alertService: AlertService,
    private toastService: ToastService,
    private taskService: TaskService,
    private modalController: ModalController
  ) {
    this.accountService.user.subscribe((res) => {
      if (res) {
        this.loggedIn = true;
        this.taskService
          .getAll()
          .pipe(first())
          .subscribe((taskData: string) => {
            this.numberOfNotifications = JSON.parse(
              JSON.parse(taskData)[0]
            ).filter(
              (data) =>
                data.user ===
                  JSON.parse(localStorage.getItem('user')).username &&
                new Date(data.date) <= new Date()
            ).length;
          });
      } else {
        this.loggedIn = false;
      }
    });
  }

  ngOnInit() {}

  openNotifications() {
    this.notificationService
      .getById(JSON.parse(localStorage.getItem('user')).id)
      .pipe(first())
      .subscribe(async (userTask) => {
        const modal = await this.modalController.create({
          component: DialogPage,
          cssClass: 'my-custom-class',
          componentProps: {
            options: [],
            action: 'Notifications',
            localData: userTask,
          },
        });
        await modal.present();
      });
  }

  async logout() {
    const role = await this.alertService.warn('Do you really want to logout?');
    if (role === 'ok') {
      this.accountService.logout();
      this.toastService.success('logout done successfully');
    }
  }
}
