import { NgModule } from '@angular/core';
import { MainContentComponent } from './components/main-content/main-content.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    MainContentComponent
  ],
  exports: [MainContentComponent],
  imports: [
    SharedModule
  ]
})
export class LayoutModule { }
