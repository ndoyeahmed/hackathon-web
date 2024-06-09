import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  err = '';
  submitting = false;
  email = '';
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) {
      this.form = this.formBuilder.group({
        confirmpassword: [null, Validators.compose([Validators.required])],
        password: [null, Validators.compose([Validators.required])]
      });
    }
  ngOnInit(): void {
    const routeParam = this.activatedRoute.snapshot.paramMap.get('email');
    if (routeParam) {
      this.email = routeParam;
    }
  }

    onChange(event: any) {
      if (this.form.controls['password'].value) {
        if(this.form.controls['password'].value !== event.target.value) {
          this.err = 'Les deux mots de passe ne sont pas conformes';
        } else {
          this.err = '';
        }
      }
    }

    resetPassword() {
      if (this.form.valid) {
        this.submitting = true;
        const passwordModel = this.form.getRawValue();
        if (passwordModel.confirmpassword === passwordModel.password) {
          if (this.email && this.email !== '') {
            this.authenticationService.resetPassword({email: this.email, password: passwordModel.password}).subscribe(
              (data) => {
                this.authenticationService.identity().subscribe((user: any) => {
                    if (this.authenticationService.hasAuthority(['ADMIN'], user)) {
                      this.authenticationService.storeUser(user)
                        .then(() => {
                          this.router.navigate(['/comptability/dashboard']);
                        });
                    } else {
                      this.authenticationService.storeUser(user)
                        .then(() => {
                          this.router.navigate(['/formation/planning']);
                        });
                    }
                }, (error: any) => console.log(error));
              }, (err) => console.log(err)
            );
          } else {
            this.err = 'Veuillez vous reconnecter à la platforme';
            this.submitting = false;
          }
        } else {
          this.err = 'Les deux mots de passe ne sont pas conformes';
          this.submitting = false;
        }
      } else {
        this.form.markAllAsTouched();
        this.err = 'Tous les champs sont obligatoires';
        this.submitting = false;
      }
    }
}
