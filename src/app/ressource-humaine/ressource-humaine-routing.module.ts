import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RessourcesHumainesComponent } from "./pages/ressources-humaines/ressources-humaines.component";
import { AuthGuard } from "../shared/services/auth.guard";

@NgModule({
  imports: [
    RouterModule.forChild([

      {
        path: '',
        component: RessourcesHumainesComponent,
        canActivate: [AuthGuard],
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class RessourceHumaineRoutingModule {
}
