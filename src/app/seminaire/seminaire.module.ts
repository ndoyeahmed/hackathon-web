import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlannigFormationComponent } from './components/plannig-formation/plannig-formation.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { SharedModule } from '../shared/shared.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SeminaireRoutingModule } from './seminaire-routing.module';
import { PlanningFormationAddComponent } from './components/planning-formation-add/planning-formation-add.component';
import { PlanningComponent } from './components/planning/planning.component';
import { PlanningFormationListComponent } from './components/planning-formation-list/planning-formation-list.component';
import { DepensesComponent } from './components/depenses/depenses.component';
import { InscriptionApprenantComponent } from './components/inscription-apprenant/inscription-apprenant.component';
import { ApprenantListComponent } from './components/apprenant-list/apprenant-list.component';
import { ReglementComponent } from './components/reglement/reglement.component';

@NgModule({
  declarations: [
    PlannigFormationComponent,
    InscriptionComponent,
    PlanningFormationAddComponent,
    PlanningComponent,
    PlanningFormationListComponent,
    DepensesComponent,
    InscriptionApprenantComponent,
    ApprenantListComponent,
    ReglementComponent
  ],
  imports: [
    SharedModule,
    SeminaireRoutingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  exports: [
    ApprenantListComponent,
    ReglementComponent
  ]
})
export class SeminaireModule { }
