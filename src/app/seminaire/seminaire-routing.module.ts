import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PlanningComponent } from "./components/planning/planning.component";
import { InscriptionComponent } from "./components/inscription/inscription.component";
import { InscriptionApprenantComponent } from "./components/inscription-apprenant/inscription-apprenant.component";
import { ApprenantListComponent } from "./components/apprenant-list/apprenant-list.component";
import { AuthGuard } from "../shared/services/auth.guard";

@NgModule({
  imports: [
    RouterModule.forChild([

      {
        path: 'planning',
        component: PlanningComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'inscription',
        component: InscriptionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'apprenants/register/:planningID',
        component: InscriptionApprenantComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'apprenants/list/:planningID',
        component: ApprenantListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'apprenants/edit/:apprenantID',
        component: InscriptionApprenantComponent,
        canActivate: [AuthGuard],
      }

    ])
  ],
  exports: [
    RouterModule
  ]
})

export class SeminaireRoutingModule {
}
