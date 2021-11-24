import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService, ToastService } from '@app/_services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private toastService: ToastService
  ) {
    if (this.accountService.userValue) {
      this.router.navigate(['/view-task']);
    }
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
    });
  }

  redirectUser() {
    if (this.form.invalid) {
      this.toastService.warn('Check Username!');
      return;
    }

    if (this.form.value) {
      this.toastService.success('Please enter new new password');
      localStorage.setItem('resetUserPassword', this.form.value.username);
      this.router.navigate(['/reset-password']);
    }
  }

  get username() {
    return this.form.get('username');
  }

  routeTo(url: string) {
    this.router.navigate([url]);
  }
}
