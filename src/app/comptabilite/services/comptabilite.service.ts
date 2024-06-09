import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChargeFixeModel } from 'src/app/shared/models/charge-fixe.model';
import {TypeChargeModel} from "../../shared/models/type-charge.model";

@Injectable({
  providedIn: 'root'
})
export class ComptabiliteService {

  private api = '/api/';
  constructor(private http: HttpClient) { }

  getStatistiques(dateDebut = '', dateFin = '') {
    const options = {
      params: new HttpParams().set('dateDebut', dateDebut).set('dateFin', dateFin)
    }

    return this.http.get(this.api + 'v1/statistiques-paiement', options);
  }

  getAllTypeChargefixe() {
    return this.http.get(this.api + 'v1/type-charge-fixe');
  }

  getAllChargefixe() {
    return this.http.get(this.api + 'v1/charge-fixe');
  }

  getAllChargefixePerPage(page = 0, pageSize = 5) {
    const options = {
      params: new HttpParams().set('page', page).set('size', pageSize)
    }
    return this.http.get(this.api + 'v1/page/charge-fixe', options);
  }

  saveChargeFixe(chargeFixe: ChargeFixeModel) {
    return this.http.post(this.api + 'v1/charge-fixe', chargeFixe);
  }

  deleteChargeFixe(chargeFixeId: number) {
    return this.http.delete(this.api + 'v1/charge-fixe/' + chargeFixeId);
  }

  saveTypeChargeFixe(typeChargeModel: TypeChargeModel) {
    return this.http.post(this.api + 'v1/type-charge-fixe', typeChargeModel);
  }

  deleteTypeChargeFixe(typeChargeFixeId: number) {
    return this.http.delete(this.api + 'v1/type-charge-fixe/' + typeChargeFixeId);
  }
}
