import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { ProfesseurModel } from 'src/app/shared/models/professeur.model';
import { FormationModel } from 'src/app/shared/models/formation.model';
import {ModuleDtoModel} from "../../shared/models/module-dto.model";

@Injectable({
  providedIn: 'root'
})
export class ParametragesService {
  api = '/api/v1';
  constructor(
    private http: HttpClient
  ) { }

  getProfesseurs() {
    return this.http.get<ProfesseurModel[]>(`${this.api}/professeurs`);
  }

  getFormations() {
    return this.http.get<FormationModel[]>(`${this.api}/formations`);
  }

  getModules() {
    return this.http.get<ModuleDtoModel[]>(`${this.api}/modules`);
  }

  getModulesByFormation(formationId: number) {
    return this.http.get<ModuleDtoModel[]>(`${this.api}/modules/formation/${formationId}`);
  }

  getModulesByFormationPerPage(formationId: number, page = 0, pageSize = 5) {
  const options = {
    params: new HttpParams().set('page', page).set('size', pageSize)
  }
    return this.http.get<ModuleDtoModel[]>(`${this.api}/page/modules/formation/${formationId}`, options);
  }

  saveModule(module: ModuleDtoModel) {
    return this.http.post<ModuleDtoModel>(`${this.api}/modules`, module);
  }

  updateModule(module: ModuleDtoModel) {
    return this.http.put<ModuleDtoModel>(`${this.api}/modules`, module);
  }

  deleteModule(moduleId: number) {
    return this.http.delete(`${this.api}/modules/${moduleId}`);
  }
}
