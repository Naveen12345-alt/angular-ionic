import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, ToastService } from '@app/_services';
import { LoadingController } from '@ionic/angular';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  passwordVisible = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private toastService: ToastService,
    private loadingController: LoadingController
  ) {
    if (this.accountService.userValue) {
      this.router.navigate(['/view-task']);
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
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
      this.toastService.warn('Error registering User!');
      return;
    }

    this.loading = true;
    this.accountService
      .register(this.form.value)
      .pipe(first())
      .subscribe({
        next: async () => {
          this.toastService.success('User Registered successfully');
          this.router.navigate(['../login'], { relativeTo: this.route });
          await loading.dismiss();
        },
        error: async (error) => {
          this.toastService.warn('User Registered failed');
          this.loading = false;
          await loading.dismiss();
        },
      });
  }

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }
}
