import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComptabiliteRoutingModule } from './comptabilite-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChargeFixeComponent } from './charge-fixe/charge-fixe.component';



@NgModule({
  declarations: [
    DashboardComponent,
    ChargeFixeComponent
  ],
  imports: [
    ComptabiliteRoutingModule,
    SharedModule
  ],
  exports: [
    DashboardComponent,
    ChargeFixeComponent
  ]
})
export class ComptabiliteModule { }
