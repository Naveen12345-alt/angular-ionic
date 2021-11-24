import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService, ToastService } from '@app/_services';
import { ModalController } from '@ionic/angular';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.page.html',
  styleUrls: ['./dialog.page.scss'],
})
export class DialogPage implements OnInit {
  @Input() options: string[];
  @Input() action: string;
  @Input() localData: any;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private toastService: ToastService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [
        this.localData?.name,
        [Validators.required, Validators.maxLength(30)],
      ],
      description: [
        this.localData?.description,
        [Validators.required, Validators.maxLength(250)],
      ],
      user: [this.localData?.user, [Validators.required]],
      date: [this.localData?.date],
    });
  }

  get f() {
    return this.form.controls;
  }

  doAction() {
    this.localData = {
      name: this.f.name.value,
      date: this.f.date.value,
      description: this.f.description.value,
      user: this.f.user.value,
      id: this.localData?.id,
    };
    if (this.form.invalid) {
      this.toastService.warn('Invalid Form');
      return;
    }

    if (this.action === 'Add') {
      this.taskService.create(this.localData).pipe(first()).subscribe();
    } else if (this.action === 'Update') {
      this.taskService.update(this.localData).pipe(first()).subscribe();
    }
    this.toastService.success(`Row ${this.action} done successfully`);
    this.modalController.dismiss({
      dismissed: false,
    });
  }

  closeDialog() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
