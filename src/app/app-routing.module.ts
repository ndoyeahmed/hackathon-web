import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './layout/components/main-content/main-content.component';
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'formation/planning',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainContentComponent,
    children: [
      {
        path: 'formation',
        loadChildren: () => import('./seminaire/seminaire.module').then(m => m.SeminaireModule)
      },
      {
        path: 'ressource-humaine',
        loadChildren: () => import('./ressource-humaine/ressource-humaine.module').then(m => m.RessourceHumaineModule)
      },
      {
        path: 'comptability',
        loadChildren: () => import('./comptabilite/comptabilite.module').then(m => m.ComptabiliteModule)
      },
      {
        path: 'administration',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'home',
        component: HomeComponent
      }
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
