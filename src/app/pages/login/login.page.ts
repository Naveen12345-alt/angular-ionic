import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, ToastService } from '@app/_services';
import { first } from 'rxjs/operators';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-log-in',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  hide = false;
  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private toastService: ToastService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    if (this.accountService.userValue) {
      this.router.navigate(['/task']);
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  async onSubmit() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }

    this.loading = true;
    this.accountService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: async () => {
          // get return url from query parameters or default to home page
          this.toastService.success('Login Sucessful');
          const returnUrl =
            this.route.snapshot.queryParams.returnUrl || '/task';
          this.router.navigateByUrl(returnUrl);
          await loading.dismiss();
        },
        error: async (error) => {
          this.toastService.warn(error);
          await loading.dismiss();
          this.loading = false;
        },
      });
  }

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

  routeTo(url: string) {
    this.router.navigate([url]);
  }
}
