import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'reset-password/:email',
        component: ResetPasswordComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class AuthenticationRoutingModule {
}
