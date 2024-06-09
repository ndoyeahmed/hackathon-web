import { MouvementDepenseModel } from './../../shared/models/mouvement-depense.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams} from '@angular/common/http';
import { PlanningFormationModel } from 'src/app/shared/models/planning-formation.model';
import { DepenseDTO } from 'src/app/shared/models/depense-dto';
import { ReglementModel } from 'src/app/shared/models/reglement.model';

@Injectable({
  providedIn: 'root'
})
export class SeminaireService {
  notifAddFormSubject = new Subject<any>();
  api = '/api/';
  constructor(private http: HttpClient) { }

  getAllPlanningFormationNotArchive(page = 0, pageSize = 5) {
    const options = {
      params: new HttpParams().set('page', page).set('size', pageSize)
    }

    return this.http.get(this.api + 'v1/page/planning-formations', options);
  }
  getTotalCoutPlanning() {
    return this.http.get(this.api + 'v1/total-cout-planning');
  }

  getListPlanningPdf() {
    return this.http.get(this.api + 'v1/planning-pdf');
  }

  addPlanning(planning: any) {
    return this.http.post(this.api + 'v1/planning-formation', planning);
  }

  getPlanningByID(planningID: number) {
    return this.http.get(this.api + 'v1/planning-formation/' + planningID);
  }

  editPlanning(planning: any) {
    return this.http.put(this.api + 'v1/planning-formation', planning);
  }

  getModulePllaningByPlanningId(planningId: number) {
    return this.http.get(this.api + 'v1/module-planning/planning/' + planningId);
  }

  archivePlanning(planningID: number) {
    return this.http.delete(this.api + 'v1/planning-formation/' + planningID);
  }

  getAllMouvementDepensesByPlanningFormationID(planningID: number) {
    return this.http.get(this.api + 'v1/mouvement-depenses/get-by-planning-formation-id/' + planningID);
  }

  addMouvementDepense(depenseDTO: DepenseDTO) {
    return this.http.post(this.api + 'v1/mouvement-depenses', depenseDTO);
  }

  editMouvementDepense(depenseDTO: DepenseDTO) {
    return this.http.put(this.api + 'v1/mouvement-depenses', depenseDTO);
  }

  addInscription(inscription: any) {
    return this.http.post(this.api + 'v1/inscription', inscription);
  }
  updateInscription(inscription: any) {
    return this.http.put(this.api + 'v1/inscription', inscription);
  }

  getApprenantInscriptionByID(id: number) {
    return this.http.get(this.api + 'v1/inscription/' + id);
  }

  getAllApprenantByPlanningID(planningID: number) {
    return this.http.get(this.api + 'v1/inscription/planning/' + planningID);
  }

  getAllApprenantByPlanningIDPerPage(planningID: number, page = 0, pageSize = 5) {
    const options = {
      params: new HttpParams().set('page', page).set('size', pageSize)
    }
    return this.http.get(this.api + 'v1/inscription/page/planning/' + planningID, options);
  }

  deleteInscriptionApprenant(inscriptionID: number) {
    return this.http.delete(this.api + 'v1/inscription/' + inscriptionID);
  }

  addReglement(reglement: ReglementModel) {
    return this.http.post(this.api + 'v1/reglement', reglement);
  }

  updateReglement(reglement: ReglementModel) {
    return this.http.put(this.api + 'v1/reglement', reglement);
  }

  deleteReglement(reglementID: number) {
    return this.http.delete(this.api + 'v1/reglement/' + reglementID);
  }

  getAllReglementByPaiementID(paiementID: number, page = 0, pageSize = 5) {
    const options = {
      params: new HttpParams().set('page', page).set('size', pageSize)
    }
    return this.http.get(this.api + 'v1/page/reglements/paiement/' + paiementID, options);
  }

  getAllReglementPDf(paiementID: number, planningID: number, apprenantID: number) {
    return this.http.get(this.api + 'v1/pdf/reglements/paiement/' + paiementID + '/planning/' + planningID + '/apprenant/' + apprenantID);
  }
}
