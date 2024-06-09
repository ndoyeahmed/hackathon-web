import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {RegelementSalaireModel} from "../../shared/models/regelement-salaire.model";

@Injectable({
  providedIn: 'root'
})
export class RessourceHumaineService {


  constructor(
    private http: HttpClient
  ) { }

  getPageParams(page: number, pageSize: number) {
    return {
      params: new HttpParams().set('page', page).set('size', pageSize)
    }
  }
  addEmploye(employe: any) {
    return this.http.post('/api/v1/resources-humaine/employe', employe);
  }

  updateEmploye(employe: any, employeId: number) {
    return this.http.put('/api/v1/resources-humaine/employe/' + employeId, employe);
  }
  deleteEmploye(employeId: number, contratId: number) {
    return this.http.delete('/api/v1/resources-humaine/employe/' + employeId + '/contrat/' + contratId);
  }
  getAllEmployees(page = 0, pageSize = 10) {

    return this.http.get('/api/v1/resources-humaine/employees', this.getPageParams(page, pageSize));
  }

  getAllReglementPerPage(contratId: number, page = 0, pageSize = 10) {

    return this.http.get('/api/v1/page/resources-humaine/reglements/contrat/' + contratId, this.getPageParams(page, pageSize));
  }

  getAllReglement(contratId: number) {

    return this.http.get('/api/v1/resources-humaine/reglements/contrat/' + contratId);
  }

  deleteReglement(reglementId: number) {
    return this.http.delete('/api/v1/resources-humaine/reglements/' + reglementId);
  }

  addReglement(reglement: RegelementSalaireModel) {
    return this.http.post('/api/v1/resources-humaine/reglements', reglement);
  }

  updateReglement(reglement: RegelementSalaireModel, reglementId: number) {
    return this.http.put('/api/v1/resources-humaine/reglements/' + reglementId, reglement);
  }
}
