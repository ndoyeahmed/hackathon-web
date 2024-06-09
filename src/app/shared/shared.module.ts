import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { AlertsComponent } from './components/alerts/alerts.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { LoadingInterceptor } from './services/loading.interceptor';
import { PlanningViewComponent } from './components/planning-view/planning-view.component';
import { AuthExpiredInterceptor } from './services/auth-expired.interceptor';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { MultiDropdownComponent } from './components/multi-dropdown/multi-dropdown.component';



@NgModule({
  declarations: [
    AlertsComponent,
    SpinnerComponent,
    PlanningViewComponent,
    SearchFilterPipe,
    MultiDropdownComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AlertsComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbNavModule,
    NgbPaginationModule,
    HttpClientModule,
    SpinnerComponent,
    PlanningViewComponent,
    SearchFilterPipe,
    MultiDropdownComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
