import { Component, OnInit } from '@angular/core';
import {
  AccountService,
  AlertService,
  NotificationService,
  TaskService,
  ToastService,
} from '@app/_services';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { DialogPage } from '../dialog/dialog.page';

export interface UsersData {
  name: string;
  id: number;
  user: string;
  date: string;
}

const ELEMENT_DATA: UsersData[] = [];

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'user', 'date', 'action'];
  options: string[] = [];
  filterUsername: string[] = [];
  taskServiceSubs: Subscription;
  numberOfNotifications: number;

  dataSource: UsersData[] = ELEMENT_DATA;
  filteredData: UsersData[] = ELEMENT_DATA;

  constructor(
    private accountService: AccountService,
    private taskService: TaskService,
    public modalController: ModalController,
    private toastService: ToastService,
    private alertService: AlertService,
    private notificationService: NotificationService
  ) {
    this.accountService.user.subscribe((res) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      res && this.getAllTasks();
    });
  }

  ngOnInit() {}

  getAllTasks() {
    this.taskService
      .getAll()
      .pipe(first())
      .subscribe((taskData: string) => {
        this.dataSource = JSON.parse(JSON.parse(taskData)[0]) ?? [];
        this.numberOfNotifications = this.dataSource.filter(
          (data) =>
            data.user === JSON.parse(localStorage.getItem('user')).username &&
            new Date(data.date) <= new Date()
        ).length;
        this.filteredData = this.dataSource;
        this.doFilter(this.filterUsername);
        this.options =
          JSON.parse(JSON.parse(taskData)[1]).map((data) =>
            data.username.toLowerCase()
          ) ?? [];
      });
  }

  public doFilter = (value: string[]) => {
    this.filterUsername = value;
    const newDataSource: UsersData[] = [];
    if (value.length) {
      this.filterUsername.forEach((username) => {
        const context = this.dataSource.filter(
          (item) => item.user === username
        );
        newDataSource.push(...context);
      });
    } else {
      newDataSource.push(...this.dataSource);
    }

    this.filteredData = newDataSource;
  };

  public async openDialog(action, obj, array) {
    const modal = await this.modalController.create({
      component: DialogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        options: array,
        action,
        localData: obj,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (!data.dismissed) {
      this.getAllTasks();
      this.toastService.success('Task added successfully');
    }
  }

  async onDelete(action: string, object: any) {
    const role = await this.alertService.warn('Do you really want to delete?');
    if (action === 'Delete' && role === 'ok') {
      this.taskService.delete(object).pipe(first()).subscribe();
      this.toastService.success('Task deleted successfully');
      this.getAllTasks();
    }
  }
}
