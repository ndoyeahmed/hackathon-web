import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SharedModule } from '../shared/shared.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    ResetPasswordComponent
  ],
  imports: [
    AuthenticationRoutingModule,
    SharedModule
  ],
  exports: [
    LoginComponent,
    ResetPasswordComponent
  ]
})
export class AuthenticationModule { }
