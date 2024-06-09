import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GestionProfesseurComponent } from "./components/gestion-professeur/gestion-professeur.component";
import { GestionFormationComponent } from "./components/gestion-formation/gestion-formation.component";
import { AuthGuard } from "../shared/services/auth.guard";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'gestion-professeurs',
        component: GestionProfesseurComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'gestion-type-formation',
        component: GestionFormationComponent,
        canActivate: [AuthGuard],
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class AdminRoutingModule {
}
