import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { GestionProfesseurComponent } from './components/gestion-professeur/gestion-professeur.component';
import { ProfesseurAddComponent } from './components/gestion-professeur/professeur-add/professeur-add.component';
import { ProfesseurListComponent } from './components/gestion-professeur/professeur-list/professeur-list.component';
import { PaiementProfComponent } from './components/gestion-professeur/paiement-prof/paiement-prof.component';
import { ListPaiementProfComponent } from './components/gestion-professeur/list-paiement-prof/list-paiement-prof.component';
import { GestionFormationComponent } from './components/gestion-formation/gestion-formation.component';
import { ProfesseurViewComponent } from './components/gestion-professeur/professeur-view/professeur-view.component';
import { SeminaireModule } from '../seminaire/seminaire.module';
import { ReglementHonoraireComponent } from './components/gestion-professeur/reglement-honoraire/reglement-honoraire.component';



@NgModule({
  declarations: [
    GestionProfesseurComponent,
    ProfesseurAddComponent,
    ProfesseurListComponent,
    PaiementProfComponent,
    ListPaiementProfComponent,
    GestionFormationComponent,
    ProfesseurViewComponent,
    ReglementHonoraireComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  exports: [
    GestionProfesseurComponent,
    ProfesseurAddComponent,
    ProfesseurListComponent,
    PaiementProfComponent,
    ListPaiementProfComponent,
    GestionFormationComponent,
    ProfesseurViewComponent,
    ReglementHonoraireComponent
  ]
})
export class AdminModule { }
