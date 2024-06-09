import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './components/employee/employee.component';
import { EmployeeAddComponent } from './components/employee/employee-add/employee-add.component';
import { EmployeeListComponent } from './components/employee/employee-list/employee-list.component';
import { RessourcesHumainesComponent } from './pages/ressources-humaines/ressources-humaines.component';
import { GestionSalaireComponent } from './components/gestion-salaire/gestion-salaire.component';
import { SharedModule } from '../shared/shared.module';
import { RessourceHumaineRoutingModule } from './ressource-humaine-routing.module';
import {AdminModule} from "../admin/admin.module";
import {SeminaireModule} from "../seminaire/seminaire.module";



@NgModule({
  declarations: [
    EmployeeComponent,
    EmployeeAddComponent,
    EmployeeListComponent,
    RessourcesHumainesComponent,
    GestionSalaireComponent
  ],
    imports: [
        SharedModule,
        RessourceHumaineRoutingModule,
        AdminModule,
        SeminaireModule
    ],
  exports: [
    EmployeeComponent,
    EmployeeAddComponent,
    EmployeeListComponent,
    RessourcesHumainesComponent,
    GestionSalaireComponent
  ]
})
export class RessourceHumaineModule { }
