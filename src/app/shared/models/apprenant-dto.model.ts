import { PaiementModel } from "./paiement.model";
import { ReglementModel } from "./reglement.model";

export class ApprenantDTO {
  public id?: number;
  public nom?: string;
  public prenom?: string;
  public email?: string;
  public telephone?: string;
  public paiement?: PaiementModel;
  public reglements?: ReglementModel[];
  public deleteAction?: boolean = false;
}
