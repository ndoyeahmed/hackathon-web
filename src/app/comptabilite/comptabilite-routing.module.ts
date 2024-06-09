import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ChargeFixeComponent } from "./charge-fixe/charge-fixe.component";
import { AuthGuard } from "../shared/services/auth.guard";

@NgModule({
  imports: [
    RouterModule.forChild([

      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'charge-fixe',
        component: ChargeFixeComponent,
        canActivate: [AuthGuard],
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class ComptabiliteRoutingModule {
}
