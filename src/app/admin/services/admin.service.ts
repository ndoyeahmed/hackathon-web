import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormationProfesseurModel } from 'src/app/shared/models/formation-professeur.model';
import { FormationModel } from 'src/app/shared/models/formation.model';
import { ProfesseurModel } from 'src/app/shared/models/professeur.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient
  ) { }

  getAllFormationNotArchive(page = 0, pageSize = 5) {
    const options = {
      params: new HttpParams().set('page', page).set('size', pageSize)
    }
    return this.http.get('/api/v1/page/formations', options);
  }

  deleteFormation(formationID: number) {
    return this.http.delete('/api/v1/formation/' + formationID);
  }

  addFormation(formation: FormationModel) {
    return this.http.post('/api/v1/formation', formation);
  }

  updateFormation(formation: FormationModel) {
    return this.http.put('/api/v1/formation', formation);
  }

  // ---------------- professeur services ----------------
  addProfesseur(professeur: ProfesseurModel) {
    return this.http.post('/api/v1/professeur', professeur);
  }

  updateProfesseur(professeur: ProfesseurModel) {
    return this.http.put('/api/v1/professeur', professeur);
  }

  getAllProfesseurNotArchive(page = 0, pageSize = 5) {
    const options = {
      params: new HttpParams().set('page', page).set('size', pageSize)
    }
    return this.http.get('/api/v1/page/professeurs', options);
  }

  deleteProfesseur(professeurID: number) {
    return this.http.delete('/api/v1/professeur/' + professeurID);
  }

  // ------------------- formation professeur --------------------
  updateFormationProfesseur(formationProfId: number, formationProfesseur: any) {
    return this.http.put('/api/v1/formation-professeur/' + formationProfId, formationProfesseur);
  }

  getAllFormationProfesseurNotArchiveEncoursByProfesseurPerPage(professeurID: number, page = 0, pageSize = 5) {
    const options = {
      params: new HttpParams().set('page', page).set('size', pageSize)
    }
    return this.http.get('/api/v1/formation-professeur-encours/page/' + professeurID, options);
  }

  getAllFormationProfesseurNotArchiveEncoursByProfesseur(professeurID: number) {
    return this.http.get('/api/v1/formation-professeur-encours/' + professeurID);
  }

  getAllFormationProfesseurNotArchivePayerByProfesseurPerPage(professeurID: number, page = 0, pageSize = 5) {
    const options = {
      params: new HttpParams().set('page', page).set('size', pageSize)
    }
    return this.http.get('/api/v1/formation-professeur-payer/page/' + professeurID, options);
  }

  getAllFormationProfesseurNotArchivePayerByProfesseur(professeurID: number) {
    return this.http.get('/api/v1/formation-professeur-payer/' + professeurID);
  }

  // --------------------------- reglement honoraire service -------------------------------------
  getAllReglementHonoraireByFormationProfPerPage(formationProfesseurID: number, page = 0, pageSize = 5) {
    const options = {
      params: new HttpParams().set('page', page).set('size', pageSize)
    }
    return this.http.get('/api/v1/page/reglement-honoraire-formation-professeur/' + formationProfesseurID, options);
  }

  getAllReglementHonoraireByFormationProf(formationProfesseurID: number) {

    return this.http.get('/api/v1/reglement-honoraire-formation-professeur/' + formationProfesseurID);
  }
}
