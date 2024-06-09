import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  err = '';
  submitting = false;
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
    ) {
      this.form = this.formBuilder.group({
        login: [null, Validators.compose([Validators.required])],
        password: [null, Validators.compose([Validators.required])]
      });
    }
    login() {
      if (this.form.valid) {
        this.submitting = true;
        const val = this.form?.value;
        this.authenticationService.login(val).then(
          (x) => {
            if (x) {
              this.submitting = false;
              this.err = 'Login ou mot de passe incorrect';
              // this.progressbar = false;
            } else {
              this.err = '';
            }
          });
      } else {
        this.err = 'Tous les champs sont obligatoires';
      }
    }
}
